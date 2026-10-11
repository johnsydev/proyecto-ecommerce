import { useState } from "react";
import { Trash2 } from "lucide-react";
import "../styles/CartItem.css";

export default function CartItem({ product, onAddUnit, onRemoveUnit, onRemove }) {
  
  const [showModal, setShowModal] = useState(false);

  const salePrice = Number(product.b2c?.sale_price ?? 0);
  const regularPrice = Number(product.b2c?.regular_price ?? 0);
  const currency = product.currency === "CRC" ? "₡" : "$";
  const tieneDescuento = product.b2c?.discount_percentage > 0;

  const subtotal = salePrice * product.order_quantity;

  
  const handleDecrease = () => {
    if (product.order_quantity <= 1) {
      setShowModal(true);
    } else {
      onRemoveUnit();
    }
  };

  const confirmRemove = () => {
    setShowModal(false);
    onRemove();
  };

  return (
    <>
      <article className="cart-item">
        <div className="cart-item-main">
          <div className="cart-item-image-wrapper">
            <img src={product.image_url} alt={product.title} />
          </div>

          <div className="cart-item-content">
            <div className="cart-item-info">
              <h2>{product.title}</h2>
              <p className="cart-item-desc">{product.description?.substring(0, 65)}...</p>
              <p className="cart-item-meta">
                Marca: <strong>{product.brand}</strong> / Mod: <strong>{product.model}</strong>
              </p>
            </div>

            <div className="cart-item-prices-group">
              <div className="price-column">
                <span className="price-label">PRECIO U.</span>
                <span className="current-price">{currency}{salePrice.toLocaleString("en-US")}</span>
                {tieneDescuento && (
                  <span className="old-price">{currency}{regularPrice.toLocaleString("en-US")}</span>
                )}
              </div>

              <div className="price-column subtotal-column">
                <span className="price-label">SUBTOTAL</span>
                <span className="subtotal-price">{currency}{subtotal.toLocaleString("en-US")}</span>
              </div>
            </div>

            <div className="cart-item-bottom-section">
              <div className="qty-selector">
                <button type="button" onClick={handleDecrease}>-</button>
                <span>{product.order_quantity}</span>
                <button type="button" onClick={onAddUnit} disabled={product.order_quantity >= product.stock_quantity}>+</button>
              </div>

              <button type="button" className="delete-btn" onClick={() => setShowModal(true)} title="Eliminar producto">
                <Trash2 size={18} strokeWidth={2} />
              </button>
            </div>

            <div className="cart-item-divider"></div>
          </div>
        </div>
      </article>

      
      {showModal && (
        <div className="custom-confirm-overlay">
          <div className="custom-confirm-modal">
            <div className="custom-confirm-icon">?</div>
            <h3>¿Estás seguro?</h3>
            <p>Se eliminará <strong>{product.title}</strong> de tu carrito. No podrás revertir esto.</p>
            <div className="custom-confirm-actions">
              <button type="button" className="btn-confirm" onClick={confirmRemove}>
                Sí, eliminar
              </button>
              <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}