export default function CartPreview({ product, cartItemCount, onClose }) {
  const price = Number(
    product.b2c?.sale_price ?? product.b2c?.regular_price ?? 0,
  );

  const symbol = product.currency === "CRC" ? "₡" : "$";

  return (
    <div
      className="cart-preview"
      role="dialog"
      aria-label="Producto agregado al carrito"
    >
      <div className="cart-preview-header">
        <div className="cart-preview-confirmation">
          <span className="cart-preview-check">✓</span>
          <span>Agregado al carrito</span>
        </div>

        <button
          type="button"
          className="cart-preview-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      <div className="cart-preview-product">
        <div className="cart-preview-image-wrapper">
          <img
            src={product.image_url}
            alt={product.title}
            className="cart-preview-image"
          />
        </div>

        <div className="cart-preview-info">
          <p className="cart-preview-name">{product.title}</p>

          {product.model && (
            <span className="cart-preview-model">MOD: {product.model}</span>
          )}

          <div className="cart-preview-product-footer">
            <span className="cart-preview-quantity">
              Cantidad: {product.order_quantity}
            </span>

            <strong className="cart-preview-price">
              {symbol}
              {price.toLocaleString("en-US")}
            </strong>
          </div>
        </div>
      </div>

      <div className="cart-preview-divider" />

      <div className="cart-preview-summary">
        <span>Carrito</span>

        <span>
          {cartItemCount} {cartItemCount === 1 ? "producto" : "productos"}
        </span>
      </div>

      <a href="#/cart" className="cart-preview-button" onClick={onClose}>
        Ver carrito
      </a>
    </div>
  );
}
