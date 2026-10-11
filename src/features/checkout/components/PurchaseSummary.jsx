import { Link } from "react-router-dom";
import {
    calculateCartSummary,
    formatPrice,
} from "../../../utils/cartCalculations";
import "../styles/PurchaseSummary.css";
import { Info } from "lucide-react";

export default function PurchaseSummary({
    cart = [],
    acceptedTerms,
    setAcceptedTerms,
    termsError,
    setTermsError,
    onTermsError,
}) {
    const {
        currency,
        subtotal,
        discount,
        iva,
        costoEnvio,
        total,
        maxDeliveryDays,
        deliveryDate,
        formattedDate,
    } = calculateCartSummary(cart);

    const handleTermsChange = (e) => {
        const checked = e.target.checked;

        setAcceptedTerms(checked);

        if (checked) {
            setTermsError(false);
        }
    };

    return (
        <aside className="purchase-summary">
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
                        Entrega estimada para el{" "}
                        <strong>{formattedDate}</strong>
                    </p>
                )}
            </section>

            <section
                className={`purchase-summary-terms ${
                    termsError ? "terms-error" : ""
                }`}
            >
                <h3>Términos y condiciones</h3>

                <label className="purchase-summary-terms-label">
                    <input
                        type="checkbox"
                        checked={acceptedTerms}
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

                {termsError && (
                    <p className="purchase-summary-terms-error">
                        <Info size={16} />
                        Debes aceptar los términos y condiciones para continuar.
                    </p>
                )}
            </section>

            <button
                type="submit"
                form="checkout-form"
                className="checkout-continue-button"
                onClick={() => {
                    if (!acceptedTerms) {
                        onTermsError();
                    }
                }}
            >
                Continuar al pago
            </button>

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