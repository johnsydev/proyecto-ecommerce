import { getCommercialTerms, getPriceInfo, getUnitPrice } from "./pricing";

/*
   * Objetivo:
   *   - Calcular el resumen del carrito de compras, incluyendo subtotal, descuentos, IVA, costos de envío y fecha estimada de entrega.
   * 
   * Entrada:
   *   - cart: Arreglo de productos en el carrito, cada uno con información de precios, cantidad y detalles de envío.
   *   - user: Usuario activo (null para visitante); define la lista de precios B2C o B2B.
   * 
   * Salida:
   *   - Objeto con el resumen del carrito, incluyendo moneda, subtotal, descuento, IVA, costos de envío, total y fecha estimada de entrega.
   * 
   * Restricciones:
   *   - Asume que los precios están en la moneda especificada en el primer producto del carrito.
   *   - Los precios se obtienen siempre con getPriceInfo; una línea con precio inválido no suma al total.
   */
export function calculateCartSummary(cart = [], user = null) {
    const currency = cart[0]?.currency === "CRC" ? "₡" : "$";

    const subtotal = cart.reduce((total, product) => {
        const price = getUnitPrice(product, user) ?? 0;
        const quantity = Number(product.order_quantity || 1);

        return total + price * quantity;
    }, 0);

    const discount = cart.reduce((total, product) => {
        const { unitPrice, regularPrice } = getPriceInfo(product, user);
        const quantity = Number(product.order_quantity || 1);

        if (unitPrice === null) return total;

        return total + Math.max(0, regularPrice - unitPrice) * quantity;
    }, 0);

    const iva = subtotal * 0.13;

    const requiereEnvioPagado = cart.some(
        (product) => getCommercialTerms(product, user)?.free_shipping === false
    );

    const costoEnvio =
        requiereEnvioPagado && cart.length > 0 ? 3000 : 0;

    const total = subtotal + iva + costoEnvio;

    const maxDeliveryDays = cart.reduce((max, product) => {
        const days = Number(
            getCommercialTerms(product, user)?.estimated_delivery_days || 0
        );

        return Math.max(max, days);
    }, 0);

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + maxDeliveryDays);

    const formattedDate = deliveryDate.toLocaleDateString("es-CR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return {
        currency,
        subtotal,
        discount,
        iva,
        requiereEnvioPagado,
        costoEnvio,
        total,
        maxDeliveryDays,
        deliveryDate,
        formattedDate,
    };
}

/*
   * Objetivo:
   *   - Formatear un monto como precio en la moneda local.
   * 
   * Entrada:
   *   - amount: Monto a formatear.
   * 
   * Salida:
   *   - Cadena con el monto formateado.
   */
export function formatPrice(amount) {
    return Number(amount).toLocaleString("en-US");
}

/*
   * Objetivo:
   *   - Formatear una fecha de entrega estimada.
   * 
   * Entrada:
   *   - date: Objeto Date a formatear.
   *   - locale: (Opcional) Configuración regional para el formato de fecha. Por defecto "es-CR".
   * 
   * Salida:
   *   - Cadena con la fecha formateada.
   */
export function formatDeliveryDate(date, locale = "es-CR") {
    return date.toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}