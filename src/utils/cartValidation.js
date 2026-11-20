import { formatUnits, getBranch, getBranchStock } from "./inventory";
import {
  getMinQuantity,
  getPriceInfo,
  getPriceList,
  isProductEnabled,
  PRICE_LISTS,
} from "./pricing";

export const ISSUE_CODES = Object.freeze({
  PRICE: "PRICE_INVALID",
  UNAVAILABLE: "UNAVAILABLE",
  NO_STOCK: "NO_STOCK",
  LOW_STOCK: "LOW_STOCK",
  MIN_QUANTITY: "MIN_QUANTITY",
});

export const BRANCH_REQUIRED_MESSAGE =
  "Selecciona la sucursal donde recibirás tu pedido para continuar.";

const getProductId = (product) => product.id ?? product.objectID;

/*
 * Objetivo:
 * Validar una línea del carrito contra precio, disponibilidad, inventario
 * de la sucursal y cantidad mínima del usuario.
 *
 * Entrada:
 * - product: Línea del carrito con order_quantity.
 * - user: Usuario activo o null.
 * - branchId: Sucursal seleccionada o null.
 *
 * Salida:
 * - { code, message, adjustTo? } con el primer problema encontrado, o null
 *   si la línea es válida. adjustTo es la cantidad válida a la que puede
 *   ajustarse la línea.
 */
export function getLineIssue(product, user, branchId = null) {
  const quantity = Number(product.order_quantity || 0);
  const minQuantity = getMinQuantity(product, user);
  const isB2B = getPriceList(user) === PRICE_LISTS.B2B;

  if (!getPriceInfo(product, user).isValid) {
    return {
      code: ISSUE_CODES.PRICE,
      message:
        "No pudimos obtener un precio válido para este producto. Quítalo del carrito o inténtalo más tarde.",
    };
  }

  if (!isProductEnabled(product, user)) {
    return {
      code: ISSUE_CODES.UNAVAILABLE,
      message: isB2B
        ? "Este producto no está disponible para clientes B2B."
        : "Este producto no está disponible por el momento.",
    };
  }

  const branch = getBranch(branchId);
  const stock = getBranchStock(product, branch ? branch.branch_id : null);
  const place = branch ? ` en ${branch.name}` : "";

  if (stock <= 0) {
    return {
      code: ISSUE_CODES.NO_STOCK,
      message: branch
        ? `Sin existencias en ${branch.name}. Elige otra sucursal o quita el producto.`
        : "Este producto está agotado.",
    };
  }

  if (quantity > stock) {
    if (stock < minQuantity) {
      return {
        code: ISSUE_CODES.LOW_STOCK,
        message: `Solo hay ${formatUnits(stock)}${place} y la compra mínima B2B es de ${formatUnits(minQuantity)}. Elige otra sucursal o quita el producto.`,
      };
    }

    return {
      code: ISSUE_CODES.LOW_STOCK,
      message: `Solo hay ${formatUnits(stock)}${place}.`,
      adjustTo: stock,
    };
  }

  if (quantity < minQuantity) {
    return {
      code: ISSUE_CODES.MIN_QUANTITY,
      message: `Compra mínima B2B: ${formatUnits(minQuantity)} por producto.`,
      adjustTo: minQuantity,
    };
  }

  return null;
}

/*
 * Objetivo:
 * Validar todo el carrito antes de continuar al checkout o crear la orden.
 *
 * Salida:
 * - isValid: true solo si hay sucursal válida y ninguna línea con problemas.
 * - branchMissing: true si falta seleccionar una sucursal.
 * - lineIssues: Problemas por identificador de producto.
 */
export function validateCart(cart, user, branchId = null) {
  const branchMissing = cart.length > 0 && !getBranch(branchId);
  const lineIssues = {};

  cart.forEach((product) => {
    const issue = getLineIssue(product, user, branchId);
    if (issue) lineIssues[getProductId(product)] = issue;
  });

  return {
    isValid: cart.length > 0 && !branchMissing && Object.keys(lineIssues).length === 0,
    branchMissing,
    lineIssues,
  };
}

/* Cantidad máxima que admite una línea según la sucursal seleccionada. */
export function getMaxQuantity(product, branchId = null) {
  return getBranchStock(product, getBranch(branchId) ? branchId : null);
}
