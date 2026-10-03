import "../styles/CartItem.css";

export default function CartItem({
  product,
  onAddUnit,
  onRemoveUnit,
  onRemove,
}) {
  const price = Number(
    product.b2c?.sale_price ?? product.b2c?.regular_price ?? 0,
  );
  const currency = product.currency === "CRC" ? "₡" : "$";

  return (
    <article className="cart-item">
      <img
        className="cart-item-image"
        src={product.image_url}
        alt={product.title}
      />

      <div className="cart-item-information">
        <h2>{product.title}</h2>
        <p className="cart-item-model">MOD: {product.model}</p>
        <p className="cart-item-price">
          {currency}
          {price.toLocaleString("en-US")}
        </p>
      </div>

      <div className="cart-item-actions">
        <div
          className="cart-quantity"
          aria-label={`Cantidad de ${product.title}`}
        >
          <button
            type="button"
            onClick={onRemoveUnit}
            disabled={product.order_quantity <= 1}
            aria-label="Disminuir cantidad"
          >
            -
          </button>
          <span>{product.order_quantity}</span>
          <button
            type="button"
            onClick={onAddUnit}
            disabled={product.order_quantity >= product.stock_quantity}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <p className="cart-item-subtotal">
          Subtotal: {currency}
          {(price * product.order_quantity).toLocaleString("en-US")}
        </p>

        <button type="button" className="cart-remove-button" onClick={onRemove}>
          Eliminar
        </button>
      </div>
    </article>
  );
}
