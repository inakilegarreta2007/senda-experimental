
export const isValidCUIT = (cuit: string): boolean => {
    if (!cuit) return false;
    const cleaned = cuit.replace(/-/g, '').replace(/\s/g, '');
    return cleaned.length === 11 && /^\d+$/.test(cleaned);
};

export const formatCUIT = (cuit: string): string => {
    const cleaned = cuit.replace(/\D/g, '');
    if (cleaned.length !== 11) return cuit;
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 10)}-${cleaned.slice(10)}`;
};
