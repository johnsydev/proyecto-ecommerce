
import { useState } from "react";
import "../styles/PurchaseSummary.css";

export default function PurchaseSummary({
    cart = [],
    termsAccepted,
    onTermsChange,
}) {
    const [localTermsAccepted, setLocalTermsAccepted] = useState(false);

    const isControlled = typeof termsAccepted === "boolean";
    const accepted = isControlled ? termsAccepted : localTermsAccepted;

    const currency = cart[0]?.currency === "CRC" ? "₡" : "$";

    // Cálculos del pedido
    const subtotal = cart.reduce((total, product) => {
        const price = Number(
            product.b2c?.sale_price ??
            product.b2c?.regular_price ??
            0
        );

        return total + price * (product.order_quantity || 1);
    }, 0);

    const discount = cart.reduce((total, product) => {
        const regularPrice = Number(product.b2c?.regular_price ?? 0);
        const salePrice = Number(
            product.b2c?.sale_price ?? regularPrice
        );

        return total +
            Math.max(0, regularPrice - salePrice) *
            (product.order_quantity || 1);
    }, 0);

    const iva = subtotal * 0.13;

    const requiereEnvioPagado = cart.some(
        (product) => product.b2c?.free_shipping === false
    );

    const costoEnvio =
        requiereEnvioPagado && cart.length > 0 ? 3000 : 0;

    const total = subtotal + iva + costoEnvio;

    // Fecha estimada de entrega
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

    const formatPrice = (amount) => amount.toLocaleString("en-US");

    const handleTermsChange = (e) => {
        const checked = e.target.checked;

        if (!isControlled) {
            setLocalTermsAccepted(checked);
        }

        onTermsChange?.(checked);
    };

    return (
        <aside className="purchase-summary">
            {/* Resumen de la compra */}
            <section className="purchase-summary-overview">
                <h2>Resumen de la compra</h2>

                <div className="purchase-summary-details">
                    <div className="purchase-summary-line">
                        <span>Subtotal</span>
                        <span>{currency}{formatPrice(subtotal)}</span>
                    </div>

                    {discount > 0 && (
                        <div className="purchase-summary-line discount-line">
                            <span>Descuento aplicado</span>
                            <span>-{currency}{formatPrice(discount)}</span>
                        </div>
                    )}

                    <div className="purchase-summary-line">
                        <span>IVA (13%)</span>
                        <span>{currency}{formatPrice(iva)}</span>
                    </div>

                    <div className="purchase-summary-line">
                        <span>Envío</span>
                        <span className={costoEnvio === 0 ? "free-shipping" : ""}>
                            {costoEnvio === 0
                                ? "Gratis"
                                : `${currency}${formatPrice(costoEnvio)}`}
                        </span>
                    </div>
                </div>

                <div className="purchase-summary-total">
                    <span>Total</span>
                    <strong>{currency}{formatPrice(total)}</strong>
                </div>

                {cart.length > 0 && (
                    <p className="purchase-summary-delivery">
                        Entrega estimada para el <strong>{formattedDate}</strong>
                    </p>
                )}
            </section>

            {/* Aceptación de términos */}
            <section className="purchase-summary-terms">
                <h3>Términos y condiciones</h3>

                <label className="purchase-summary-terms-label">
                    <input
                        type="checkbox"
                        checked={accepted}
                        onChange={handleTermsChange}
                    />

                    <span>
                        Acepto los{" "}
                        <a
                            href="#"
                            onClick={(event) => {
                            event.preventDefault();
                            window.open("#/terminos", "_blank");
                            }}
                        >
                            términos y condiciones
                        </a>
                        {" "}y la{" "}

                        <a href="/proyecto-ecommerce/#/politica-privacidad" target="_blank" rel="noopener noreferrer">
                            política de privacidad
                        </a>
                        .
                    </span>
                    </label>
            </section>

            {/* Lista de productos */}
            <section className="purchase-summary-products">
                <div className="purchase-summary-products-header">
                    <h3>Productos de tu pedido</h3>
                    <span>
                        {cart.length} {cart.length === 1 ? "producto" : "productos"}
                    </span>
                </div>

                {cart.length === 0 ? (
                    <p className="purchase-summary-empty">
                        No hay productos en el carrito.
                    </p>
                ) : (
                    <div className="purchase-summary-product-list">
                        {cart.map((product, index) => {
                            const keyId =
                                product.id ?? product.objectID ?? index;

                            const price = Number(
                                product.b2c?.sale_price ??
                                product.b2c?.regular_price ??
                                0
                            );

                            const quantity = product.order_quantity || 1;
                            const symbol =
                                product.currency === "CRC" ? "₡" : "$";

                            return (
                                <article
                                    className="purchase-summary-product"
                                    key={keyId}
                                >
                                    <div className="purchase-summary-product-image">
                                        <img
                                            src={product.image_url}
                                            alt={product.title || "Producto"}
                                        />
                                    </div>

                                    <div className="purchase-summary-product-info">
                                        <p className="purchase-summary-product-name">
                                            {product.title}
                                        </p>

                                        {product.model && (
                                            <span className="purchase-summary-product-model">
                                                MOD: {product.model}
                                            </span>
                                        )}

                                        <span className="purchase-summary-product-quantity">
                                            Cantidad: {quantity}
                                        </span>

                                        <strong className="purchase-summary-product-price">
                                            {symbol}{formatPrice(price * quantity)}
                                        </strong>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </aside>
    );
}
