
/*
   * Objetivo:
   *   - Calcular el resumen del carrito de compras, incluyendo subtotal, descuentos, IVA, costos de envío y fecha estimada de entrega.
   * 
   * Entrada:
   *   - cart: Arreglo de productos en el carrito, cada uno con información de precios, cantidad y detalles de envío.
   * 
   * Salida:
   *   - Objeto con el resumen del carrito, incluyendo moneda, subtotal, descuento, IVA, costos de envío, total y fecha estimada de entrega.
   * 
   * Restricciones:
   *   - Asume que los precios están en la moneda especificada en el primer producto del carrito.
   */
export function calculateCartSummary(cart = []) {
    const currency = cart[0]?.currency === "CRC" ? "₡" : "$";

    const subtotal = cart.reduce((total, product) => {
        const price = Number(
            product.b2c?.sale_price ??
            product.b2c?.regular_price ??
            0
        );

        const quantity = Number(product.order_quantity || 1);

        return total + price * quantity;
    }, 0);

    const discount = cart.reduce((total, product) => {
        const regularPrice = Number(product.b2c?.regular_price ?? 0);
        const salePrice = Number(
            product.b2c?.sale_price ?? regularPrice
        );
        const quantity = Number(product.order_quantity || 1);

        return total +
            Math.max(0, regularPrice - salePrice) * quantity;
    }, 0);

    const iva = subtotal * 0.13;

    const requiereEnvioPagado = cart.some(
        (product) => product.b2c?.free_shipping === false
    );

    const costoEnvio =
        requiereEnvioPagado && cart.length > 0 ? 3000 : 0;

    const total = subtotal + iva + costoEnvio;

    const maxDeliveryDays = cart.reduce((max, product) => {
        const days = Number(product.b2c?.estimated_delivery_days || 0);

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