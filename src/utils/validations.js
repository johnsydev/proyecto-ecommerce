const cleanNumber = (value) => {
    return value.trim().replace(/[\s().-]/g, "");
};

// Acepta 1-2345-6789 o 123456789.
export const normalizeCedulaCR = (cedula) => {
    return cleanNumber(cedula);
};

export const isValidCedulaCR = (cedula) => {
    const normalized = normalizeCedulaCR(cedula);

    return /^[1-9]\d{8}$/.test(normalized);
};

// Acepta 8888-8888, 88888888 o +506 8888-8888.
export const normalizePhoneCR = (phone) => {
    let normalized = cleanNumber(phone);

    if (normalized.startsWith("+506")) {
        normalized = normalized.slice(4);
    } else if (normalized.startsWith("506") && normalized.length === 11) {
        normalized = normalized.slice(3);
    }

    return normalized;
};

export const isValidPhoneCR = (phone) => {
    const normalized = normalizePhoneCR(phone);

    return /^[2-9]\d{7}$/.test(normalized);
};