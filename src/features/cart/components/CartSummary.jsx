import "../styles/CartSummary.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
    calculateCartSummary,
    formatPrice,
} from "../../../utils/cartCalculations";

export default function CartSummary({ cart }) {
  const navigate = useNavigate();
  const location = useLocation();
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

  return (
    <div className="cart-summary-wrapper">
      <aside className="cart-summary">
        <h2>Resumen de Orden</h2>

        <div className="summary-details">
          <div className="cart-summary-line">
            <span>Subtotal</span>
            <span>{currency}{subtotal.toLocaleString("en-US")}</span>
          </div>

          {discount > 0 && (
            <div className="cart-summary-line discount-line">
              <span>Descuento</span>
              <span>-{currency}{discount.toLocaleString("en-US")}</span>
            </div>
          )}

          <div className="cart-summary-line">
            <span>IVA (13%)</span>
            <span>{currency}{iva.toLocaleString("en-US")}</span>
          </div>

          <div className="cart-summary-line">
            <span>Envío</span>
            <span className={costoEnvio === 0 ? "free-shipping" : ""}>
              {costoEnvio === 0 ? "Gratis" : `${currency}${costoEnvio.toLocaleString("en-US")}`}
            </span>
          </div>
        </div>

        <div className="cart-summary-total">
          <span>Total</span>
          <strong>{currency}{total.toLocaleString("en-US")}</strong>
        </div>

        <button type="button" className="checkout-button" onClick={() => navigate("/checkout", { state: { from: location.pathname } })}>
          Proceder al Pago
        </button>

        <p className="estimated-delivery">
          Entrega estimada para el <strong>{formattedDate}</strong>
        </p>
      </aside>

      <div className="coupon-box">
        <h3>¿Tienes un Cupón?</h3>
        <div className="coupon-input-group">
          <input type="text" placeholder="Código de cupón" />
          <button type="button">Aplicar</button>
        </div>
      </div>
    </div>
  );
}