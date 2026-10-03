import "../styles/CartSummary.css";

export default function CartSummary({ cart }) {
  const currency = cart[0]?.currency === "CRC" ? "₡" : "$";

  // Cálculos
  const subtotal = cart.reduce((total, product) => {
    const price = Number(product.b2c?.sale_price ?? product.b2c?.regular_price ?? 0);
    return total + (price * product.order_quantity);
  }, 0);

  const discount = cart.reduce((total, product) => {
    const regPrice = Number(product.b2c?.regular_price ?? 0);
    const salePrice = Number(product.b2c?.sale_price ?? regPrice);
    return total + ((regPrice - salePrice) * product.order_quantity);
  }, 0);

  const iva = subtotal * 0.13;
  const requiereEnvioPagado = cart.some(product => product.b2c?.free_shipping === false);
  const costoEnvio = requiereEnvioPagado && cart.length > 0 ? 3000 : 0; 
  
  const total = subtotal + iva + costoEnvio;

  // Fecha Estimada
  const maxDeliveryDays = cart.reduce((max, product) => {
    const days = product.b2c?.estimated_delivery_days || 0;
    return days > max ? days : max;
  }, 0);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + maxDeliveryDays);
  
  const formattedDate = deliveryDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

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

        <button type="button" className="checkout-button">
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