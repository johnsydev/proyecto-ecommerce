import { applyStockOverrides } from "./stockOverrides";

export const BRANCHES = Object.freeze([
  { branch_id: "SJ-01", name: "San José Centro", province: "San José" },
  { branch_id: "HER-01", name: "Heredia", province: "Heredia" },
  { branch_id: "ALA-01", name: "Alajuela", province: "Alajuela" },
  { branch_id: "LIM-01", name: "Limón", province: "Limón" },
]);

/* Sucursal registrada para un identificador, o null si no existe. */
export function getBranch(branchId) {
  return BRANCHES.find((branch) => branch.branch_id === branchId) ?? null;
}

/*
 * Objetivo:
 * Consultar las unidades disponibles de un producto.
 *
 * Entrada:
 * - product: Producto con la lista branches.
 * - branchId: Sucursal consultada; null consulta el inventario total.
 *
 * Salida:
 * - Unidades disponibles, o 0 si la sucursal no tiene el producto,
 *   está marcada como no disponible o el inventario es inválido.
 *
 * Restricciones:
 * - Es el único punto de lectura del inventario por sucursal.
 * - Incluye los cambios de inventario hechos desde el panel administrativo.
 */
export function getBranchStock(product, branchId = null) {
  const current = applyStockOverrides(product);
  if (branchId === null) {
    const total = Number(current?.stock_quantity);
    return Number.isFinite(total) && total > 0 ? total : 0;
  }

  const branch = current?.branches?.find((item) => item.branch_id === branchId);
  const stock = Number(branch?.stock_quantity);

  if (!branch || branch.available === false) return 0;

  return Number.isFinite(stock) && stock > 0 ? stock : 0;
}

export function formatUnits(quantity) {
  return `${quantity} ${quantity === 1 ? "unidad" : "unidades"}`;
}


/*
 * Objetivo:
 * Calcular las unidades disponibles de un producto sumando todas las sucursales.
 *
 * Entrada:
 * - product: Producto con la lista branches.
 *
 * Salida:
 * - Total de unidades en las sucursales registradas en BRANCHES.
 */
export function getTotalBranchStock(product) {
  return BRANCHES.reduce(
    (total, branch) => total + getBranchStock(product, branch.branch_id),
    0,
  );
}