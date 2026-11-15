import { ROLES } from "./permissions";

export const PRICE_LISTS = Object.freeze({
  B2C: "B2C",
  B2B: "B2B",
});

// Condición comercial B2B: cantidad mínima de compra por producto.
export const DEFAULT_MIN_QUANTITY = Object.freeze({
  [PRICE_LISTS.B2C]: 1,
  [PRICE_LISTS.B2B]: 5,
});

export const IVA_PERCENTAGE = 13;

/*
 * Objetivo:
 * Determinar la lista de precios del usuario.
 *
 * Salida:
 * - "B2B" para clientes B2B; "B2C" para cualquier otro usuario o visitante.
 */
export function getPriceList(user) {
  return user?.role === ROLES.B2B ? PRICE_LISTS.B2B : PRICE_LISTS.B2C;
}

/* Bloque comercial del producto (b2c o b2b) que corresponde al usuario. */
export function getCommercialTerms(product, user) {
  return product?.[getPriceList(user).toLowerCase()] ?? null;
}

const isValidPrice = (value) => Number.isFinite(value) && value > 0;

/*
 * Objetivo:
 * Calcular el precio que aplica a un producto según el usuario.
 *
 * Entrada:
 * - product: Producto con los bloques b2c y b2b.
 * - user: Usuario activo o null para un visitante.
 *
 * Salida:
 * - priceList, unitPrice, regularPrice, discountPercentage, hasDiscount
 *   e isValid.
 *
 * Restricciones:
 * - Es la única fuente de precios de la aplicación: catálogo, detalle,
 *   carrito, checkout, resumen y orden.
 * - Un precio inexistente, no numérico, menor o igual a cero, o mayor al
 *   precio regular se considera inválido (isValid = false).
 */
export function getPriceInfo(product, user) {
  const priceList = getPriceList(user);
  const regularPrice = Number(product?.b2c?.regular_price);

  const isB2B = priceList === PRICE_LISTS.B2B;
  const unitPrice = isB2B
    ? Number(product?.b2b?.price)
    : Number(product?.b2c?.sale_price ?? product?.b2c?.regular_price);

  const isValid =
    isValidPrice(unitPrice) &&
    isValidPrice(regularPrice) &&
    unitPrice <= regularPrice;

  const discountPercentage = isB2B
    ? Number(product?.b2b?.discount_percentage || 0)
    : Number(product?.b2c?.discount_percentage || 0);

  return {
    priceList,
    unitPrice: isValid ? unitPrice : null,
    regularPrice: isValid ? regularPrice : null,
    discountPercentage,
    hasDiscount: isValid && regularPrice > unitPrice,
    isValid,
  };
}

/* Precio unitario aplicado, o null si la información comercial es inválida. */
export function getUnitPrice(product, user) {
  return getPriceInfo(product, user).unitPrice;
}

/*
 * Objetivo:
 * Obtener la cantidad mínima de compra por producto según el usuario.
 *
 * Salida:
 * - min_quantity del bloque comercial si es válido; en su defecto, 1 para
 *   B2C y 5 para B2B.
 */
export function getMinQuantity(product, user) {
  const configured = Number(getCommercialTerms(product, user)?.min_quantity);

  if (Number.isInteger(configured) && configured >= 1) return configured;

  return DEFAULT_MIN_QUANTITY[getPriceList(user)];
}

/* Indica si el producto está habilitado para la lista de precios del usuario. */
export function isProductEnabled(product, user) {
  return getCommercialTerms(product, user)?.enabled === true;
}

/*
 * Objetivo:
 * Describir las condiciones comerciales que se guardan en la orden.
 */
export function getCommercialConditions(user) {
  const priceList = getPriceList(user);
  const minQuantity = DEFAULT_MIN_QUANTITY[priceList];

  return {
    customerType: priceList,
    priceList,
    minQuantity,
    ivaPercentage: IVA_PERCENTAGE,
    rule: `Precio ${priceList} con cantidad mínima de compra de ${minQuantity} ${
      minQuantity === 1 ? "unidad" : "unidades"
    }${priceList === PRICE_LISTS.B2B ? " por producto" : ""}.`,
  };
}
