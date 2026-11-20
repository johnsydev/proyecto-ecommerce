const STOCK_OVERRIDES_KEY = "stockOverrides";

/*
 * Objetivo:
 * Leer los cambios de inventario hechos desde el panel administrativo.
 *
 * Salida:
 * - Objeto con la forma { idProducto: { idSucursal: unidades } }.
 *
 * Restricciones:
 * - Si los datos están dañados o localStorage no está disponible se devuelve
 *   un objeto vacío.
 */
export function readStockOverrides() {
  try {
    const raw = localStorage.getItem(STOCK_OVERRIDES_KEY);
    const data = raw ? JSON.parse(raw) : {};

    if (!data || typeof data !== "object" || Array.isArray(data)) return {};

    return data;
  } catch {
    return {};
  }
}

/*
 * Objetivo:
 * Guardar las nuevas unidades de un producto en una sucursal.
 *
 * Entrada:
 * - productId: objectID del producto.
 * - branchId: Identificador de la sucursal.
 * - units: Unidades nuevas (entero mayor o igual a cero).
 *
 * Salida:
 * - Todos los cambios de inventario guardados.
 *
 * Restricciones:
 * - Solo se modifica localStorage; no se escribe en Algolia.
 * - Lanza un error si el navegador no permite guardar los datos.
 */
export function saveStockOverride(productId, branchId, units) {
  const overrides = readStockOverrides();
  const updated = {
    ...overrides,
    [productId]: { ...overrides[productId], [branchId]: units },
  };

  try {
    localStorage.setItem(STOCK_OVERRIDES_KEY, JSON.stringify(updated));
  } catch {
    throw new Error(
      "No se pudo guardar el cambio. Verificá que el navegador permita guardar datos.",
    );
  }

  return updated;
}

/* Elimina todos los cambios de inventario y devuelve los datos originales. */
export function clearStockOverrides() {
  try {
    localStorage.removeItem(STOCK_OVERRIDES_KEY);
  } catch {
    throw new Error("No se pudo restablecer el inventario. Intentá nuevamente.");
  }
}

/*
 * Objetivo:
 * Aplicar a un producto los cambios de inventario hechos por el administrador.
 *
 * Entrada:
 * - product: Producto tal como viene de Algolia (o un producto del carrito).
 * - overrides: Cambios guardados; por defecto se leen de localStorage.
 *
 * Salida:
 * - Una copia del producto con las unidades de sucursal, el stock total y
 *   in_stock actualizados, o el mismo producto si no tiene cambios.
 *
 * Restricciones:
 * - No modifica el producto recibido.
 * - Una sucursal con 0 unidades queda como no disponible y una con unidades
 *   queda disponible, igual que en los datos de Algolia.
 * - Se ignoran los valores guardados que no sean enteros mayores o iguales a cero.
 */
export function applyStockOverrides(product, overrides = readStockOverrides()) {
  const changes = overrides[product?.objectID ?? product?.id];

  if (!changes || !Array.isArray(product.branches)) return product;

  let hasChanges = false;

  const branches = product.branches.map((branch) => {
    const units = changes[branch.branch_id];

    if (!Number.isInteger(units) || units < 0) return branch;

    hasChanges = true;
    return { ...branch, stock_quantity: units, available: units > 0 };
  });

  if (!hasChanges) return product;

  const total = branches.reduce(
    (sum, branch) => sum + Math.max(0, Number(branch.stock_quantity) || 0),
    0,
  );

  return { ...product, branches, stock_quantity: total, in_stock: total > 0 };
}