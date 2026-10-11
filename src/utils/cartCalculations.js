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

export function formatPrice(amount) {
    return Number(amount).toLocaleString("en-US");
}

export function formatDeliveryDate(date, locale = "es-CR") {
    return date.toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}