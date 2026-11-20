export const MAX_STOCK = 9999;

/*
 * Objetivo:
 * Validar las unidades nuevas de un producto en una sucursal.
 *
 * Entrada:
 * - rawValue: Texto escrito por el administrador.
 * - current: Unidades actuales en la sucursal.
 *
 * Salida:
 * - { value } con las unidades listas para guardar o { error } con el mensaje.
 *
 * Restricciones:
 * - Debe ser un número entero entre 0 y MAX_STOCK.
 * - No se permite guardar el mismo valor que ya tiene la sucursal.
 */
export function validateStock(rawValue, current) {
  const text = String(rawValue).trim();

  if (text === "") return { error: "Ingresá las unidades nuevas." };

  const number = Number(text);

  if (!Number.isFinite(number)) {
    return { error: "El inventario debe ser un número válido." };
  }

  if (!Number.isInteger(number)) {
    return { error: "El inventario debe ser un número entero." };
  }

  if (number < 0) return { error: "El inventario no puede ser negativo." };

  if (number > MAX_STOCK) {
    return { error: `El inventario no puede superar las ${MAX_STOCK} unidades.` };
  }

  if (number === current) {
    return { error: "El inventario ingresado es igual al actual. No hay cambios que guardar." };
  }

  return { value: number };
}