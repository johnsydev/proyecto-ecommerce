import { getCurrentUser } from "./userStorage";
import { getBranch } from "./inventory";

/*
 * Objetivo:
 * Identificar al propietario del carrito y las órdenes locales.
 *
 * Entrada:
 * - userId: Identificador del usuario; null representa al visitante.
 *
 * Salida:
 * - Clave estable por usuario o "guest" para compras sin iniciar sesión.
 */
export function getPurchaseOwnerKey(userId = getCurrentUser()?.id ?? null) {
  return userId === null ? "guest" : `user_${encodeURIComponent(userId)}`;
}

/*
 * Objetivo:
 * Separar el almacenamiento de compras según su propietario.
 *
 * Restricciones:
 * - El visitante conserva las claves anteriores para no perder datos existentes.
 * - Los datos del visitante no se transfieren automáticamente a una cuenta.
 */
export function getPurchaseStorageKey(key, ownerKey = getPurchaseOwnerKey()) {
  return ownerKey === "guest" ? key : `${key}:${ownerKey}`;
}

/* Recuperar el carrito del propietario sin registrar nuevas adiciones. */
export function readCart(ownerKey) {
  try {
    const raw = localStorage.getItem(getPurchaseStorageKey("cart", ownerKey));
    const cart = raw ? JSON.parse(raw) : [];
    return Array.isArray(cart)
      ? cart.filter((item) => item && typeof item === "object")
      : [];
  } catch {
    return [];
  }
}

/* Recuperar la sucursal elegida por el propietario del carrito. */
export function readBranchId(ownerKey) {
  try {
    const branchId = localStorage.getItem(
      getPurchaseStorageKey("selectedBranch", ownerKey),
    );
    return getBranch(branchId) ? branchId : null;
  } catch {
    return null;
  }
}

export function writeBranchId(branchId, ownerKey) {
  try {
    const key = getPurchaseStorageKey("selectedBranch", ownerKey);

    if (branchId) {
      localStorage.setItem(key, branchId);
    } else {
      localStorage.removeItem(key);
    }
    return true;
  } catch {
    return false;
  }
}

/* Guardar en la clave capturada por el carrito, aunque la cuenta haya cambiado. */
export function writeCart(cart, ownerKey) {
  try {
    localStorage.setItem(
      getPurchaseStorageKey("cart", ownerKey),
      JSON.stringify(cart),
    );
    return true;
  } catch {
    return false;
  }
}
