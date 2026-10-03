import "../styles/CartSummary.css";

export default function CartSummary({ cart }) {
  const totalItems = cart.reduce(
    (total, product) => total + product.order_quantity,
    0,
  );
  const subtotal = cart.reduce((total, product) => {
    const price = Number(
      product.b2c?.sale_price ?? product.b2c?.regular_price ?? 0,
    );

    return total + price * product.order_quantity;
  }, 0);
  const currency = cart[0]?.currency === "CRC" ? "₡" : "$";

  return (
    <aside className="cart-summary">
      <h2>Resumen del carrito</h2>

      <div className="cart-summary-line">
        <span>Productos ({totalItems})</span>
        <span>
          {currency}
          {subtotal.toLocaleString("en-US")}
        </span>
      </div>

      <div className="cart-summary-line">
        <span>Envío</span>
        <span>Gratis</span>
      </div>

      <div className="cart-summary-total">
        <span>Total</span>
        <strong>
          {currency}
          {subtotal.toLocaleString("en-US")}
        </strong>
      </div>

      <button type="button" className="checkout-button">
        Proceder al pago
      </button>
    </aside>
  );
}