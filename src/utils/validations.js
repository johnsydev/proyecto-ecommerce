/*
   * Objetivo:
   *   - Limpiar un número de cédula o teléfono eliminando espacios, paréntesis, puntos y guiones.
   * 
   * Entrada:
   *   - value: Cadena de texto que representa el número a limpiar.
   * 
   * Salida:
   *   - Cadena de texto con el número limpio.
   */
const cleanNumber = (value) => {
    return value.trim().replace(/[\s().-]/g, "");
};

/*
   * Objetivo:
   *   - Normalizar una cédula costarricense eliminando caracteres no numéricos.
   * 
   * Entrada:
   *   - cedula: Cadena de texto que representa la cédula a normalizar.
   * 
   * Salida:
   *   - Cadena de texto con la cédula normalizada.
   */

export const normalizeCedulaCR = (cedula) => {
    return cleanNumber(cedula);
};

export const isValidCedulaCR = (cedula) => {
    const normalized = normalizeCedulaCR(cedula);

    return /^[1-9]\d{8}$/.test(normalized);
};

/*
   * Objetivo:
   *   - Normalizar un número de teléfono costarricense eliminando caracteres no numéricos y el código de país si está presente.
   * 
   * Entrada:
   *   - phone: Cadena de texto que representa el número de teléfono a normalizar.
   * 
   * Salida:
   *   - Cadena de texto con el número de teléfono normalizado.
   */
export const normalizePhoneCR = (phone) => {
    let normalized = cleanNumber(phone);

    if (normalized.startsWith("+506")) {
        normalized = normalized.slice(4);
    } else if (normalized.startsWith("506") && normalized.length === 11) {
        normalized = normalized.slice(3);
    }

    return normalized;
};

/*
   * Objetivo:
   *   - Validar si un número de teléfono costarricense es válido.
   * 
   * Entrada:
   *   - phone: Cadena de texto que representa el número de teléfono a validar.
   * 
   * Salida:
   *   - Booleano que indica si el número de teléfono es válido.
   */
export const isValidPhoneCR = (phone) => {
    const normalized = normalizePhoneCR(phone);

    return /^[2-9]\d{7}$/.test(normalized);
};