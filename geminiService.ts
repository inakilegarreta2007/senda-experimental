
const API_KEY = import.meta.env.VITE_API_KEY;
const MODEL_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

interface GeocodeResult {
    lat: number;
    lng: number;
}

interface ValidationResult {
    legitimo: boolean;
    motivo: string;
}

// Función auxiliar para limpiar y parsear JSON de respuestas de LLM
const parseGeminiJSON = <T>(text: string): T => {
    try {
        // Eliminar bloques de código markdown si existen
        let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // Intentar encontrar el primer objeto JSON o array válido
        const firstBrace = cleaned.indexOf('{');
        const firstBracket = cleaned.indexOf('[');

        let start = -1;
        let end = -1;

        // Determinar si buscamos objeto o array basado en lo que aparece primero
        if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
            start = firstBrace;
            end = cleaned.lastIndexOf('}');
        } else if (firstBracket !== -1) {
            start = firstBracket;
            end = cleaned.lastIndexOf(']');
        }

        if (start !== -1 && end !== -1) {
            // Extraer solo la parte JSON
            cleaned = cleaned.substring(start, end + 1);
        }

        return JSON.parse(cleaned);
    } catch (error) {
        console.error("Error parseando JSON de Gemini:", text, error);
        throw new Error("Formato de respuesta inválido por parte de la IA.");
    }
}

// Nominatim Search Helper
const searchNominatim = async (query: string): Promise<GeocodeResult | null> => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
            headers: {
                // User-Agent is required by Nominatim
                'User-Agent': 'SendaApp/1.0'
            }
        });

        if (!response.ok) return null;

        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }
        return null;
    } catch (error) {
        console.warn("Nominatim search failed:", error);
        return null;
    }
};

export const geocodeAddress = async (
    address: string,
    number: string,
    city: string,
    province: string,
    zipCode?: string
): Promise<GeocodeResult | null> => {
    try {
        // 0. Clean inputs
        const cleanNumber = number.toLowerCase().includes('s/n') || number.toLowerCase().includes('sin num') ? '' : number.replace(/\D/g, '');
        const cleanAddress = address.trim();
        const cleanCity = city.trim();
        const cleanProvince = province.trim();

        // Strategy 1: Absolute Precision (Address + Number + City + Province + Zip)
        if (zipCode && cleanNumber) {
            const strictQuery = `${cleanAddress} ${cleanNumber}, ${cleanCity}, ${cleanProvince} ${zipCode}, Argentina`;
            const result = await searchNominatim(strictQuery);
            if (result) return result;
        }

        // Strategy 2: High Precision (Address + Number + City + Province)
        if (cleanNumber) {
            const fullQuery = `${cleanAddress} ${cleanNumber}, ${cleanCity}, ${cleanProvince}, Argentina`;
            const result = await searchNominatim(fullQuery);
            if (result) return result;
        }

        // Strategy 3: Street Level (Address + City + Province + Zip)
        if (zipCode) {
            const streetZipQuery = `${cleanAddress}, ${cleanCity}, ${cleanProvince} ${zipCode}, Argentina`;
            const result = await searchNominatim(streetZipQuery);
            if (result) return result;
        }

        // Strategy 4: Street Level Standard (Address + City + Province)
        const streetQuery = `${cleanAddress}, ${cleanCity}, ${cleanProvince}, Argentina`;
        const result = await searchNominatim(streetQuery);
        if (result) return result;

        // Strategy 5: IA FALLBACK - Let Gemini try to standardize or guess if the address is complex
        console.log("Traditional geocoding failed, trying AI interpretation...");
        const aiResult = await aiGeocodeInterpretation(cleanAddress, cleanNumber, cleanCity, cleanProvince, zipCode);
        if (aiResult) {
            // If AI gave us a better search string, try one last Nominatim search
            const finalTry = await searchNominatim(aiResult);
            if (finalTry) return finalTry;

            // If AI guessed coordinates (advanced), we could return those, but for now we use it to 'fix' the query
        }

        // Strategy 6: City Level Fallback
        const cityQuery = `${cleanCity}, ${cleanProvince}, Argentina`;
        const cityResult = await searchNominatim(cityQuery);
        if (cityResult) return cityResult;

        return null;

    } catch (error: any) {
        console.error("Error geocoding:", error);
        throw error;
    }
};

/**
 * Uses Gemini to interpret a potentially malformed or complex address 
 * to return a more searchable string for Nominatim.
 */
async function aiGeocodeInterpretation(address: string, number: string, city: string, province: string, zipCode?: string): Promise<string | null> {
    try {
        const prompt = `Interpret this address and return a standardized, searchable address string for OpenStreetMap/Nominatim in Argentina. 
        Input: Calle "${address}", Altura "${number}", Ciudad "${city}", Provincia "${province}", CP "${zipCode || 'N/A'}".
        The address might contain errors, descriptive landmarks, or local names. 
        Return ONLY the standardized address string. example: "Avenida Alem 1234, Santa Fe, Argentina".
        Do not use markdown.`;

        const response = await fetch(MODEL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        if (!data.candidates || !data.candidates[0].content) return null;
        return data.candidates[0].content.parts[0].text.trim();
    } catch (e) {
        console.warn("AI Fallback failed", e);
        return null;
    }
}

export const validateRegistration = async (
    name: string,
    description: string,
    imageBase64?: string
): Promise<ValidationResult> => {
    try {
        const parts: any[] = [
            {
                text: `Act as a gov auditor. Validate if this entity "${name}" matches the description "${description}" and looks like a valid social institution (NGO, community center, church, club, etc). 
      Return ONLY a raw JSON object with:
      - "legitimo": boolean (true if it seems valid/social, false if it looks like spam, commercial, or unsafe)
      - "motivo": string (short explanation in Spanish).
      Do not use Markdown.` }
        ];

        if (imageBase64) {
            parts.push({
                inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64
                }
            });
        }

        const response = await fetch(MODEL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts }] })
        });

        const data = await response.json();
        console.log("[DEBUG] Gemini Validation Response:", data);

        if (!data.candidates || !data.candidates[0].content) {
            console.warn("Gemini API Error (Validate), allowing by default:", data);
            return { legitimo: true, motivo: "Verificación IA no disponible, aprobado temporalmente." };
        }

        const text = data.candidates[0].content.parts[0].text;
        const json = parseGeminiJSON<any>(text);

        return {
            legitimo: !!json.legitimo,
            motivo: json.motivo || "Validado por IA"
        };

    } catch (error) {
        console.error("Error validating with Gemini:", error);
        return {
            legitimo: true,
            motivo: "Validación técnica no disponible. Se requiere revisión manual estricta."
        };
    }
};

export const generateImpactSummary = async (stats: any): Promise<string> => {
    try {
        const prompt = `Generate a 1-sentence specialized summary of social impact based on these stats for an executive dashboard: 
    Total Institutions: ${stats.totalInstitutions}, Beneficiaries: ${stats.totalBeneficiaries}, Active Request: ${stats.activeRequests}. 
    Tone: Professional, government-like, inspiring. Spanish language.`;

        const response = await fetch(MODEL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        if (!data.candidates || !data.candidates[0].content) return "Red activa y en crecimiento sosteniendo el tejido social.";
        return data.candidates[0].content.parts[0].text.trim();
    } catch (e) {
        return "Monitoreo de red activo. Datos actualizados en tiempo real.";
    }
};

export const expandSearchQuery = async (query: string): Promise<string[]> => {
    try {
        const prompt = `Return a raw JSON string array of 5 semantic keywords related to this search term context (social help context): "${query}". 
    Example: if query is "hambre", return ["comedor", "alimentos", "merendero", "nutrición", "viandas"]. 
    Do not use markdown.`;

        const response = await fetch(MODEL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        console.log("[DEBUG] Gemini Search Expansion Response:", data);
        if (!data.candidates || !data.candidates[0].content) return [];

        const text = data.candidates[0].content.parts[0].text;
        return parseGeminiJSON<string[]>(text);
    } catch (e) {
        return [];
    }
};
