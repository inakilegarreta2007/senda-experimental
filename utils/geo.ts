
export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const normalizeText = (text: string) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const splitAddress = (fullAddress: string) => {
    if (!fullAddress) return { street: '', number: '' };

    // Regex to find the last sequence of numbers which usually is the house number
    const match = fullAddress.trim().match(/^(.*?)\s+(\d+[a-zA-Z]?|S\/N|s\/n)$/);

    if (match) {
        return {
            street: match[1].trim(),
            number: match[2].trim()
        };
    }

    // Fallback: If no trailing number found, return the whole string as street
    return {
        street: fullAddress.trim(),
        number: ''
    };
};
