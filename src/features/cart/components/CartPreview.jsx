import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "../../../context/CartContext";

export default function CartPreview({ mode = "single", product, cart = [], cartItemCount, onClose }) {
  const navigate = useNavigate();
  const { removeFromCart } = useCart();

  // --- MODO 1: MENÚ LATERAL---
  if (mode === "drawer") {
    const subtotal = cart.reduce((tot, p) => {
      const pPrice = Number(p.b2c?.sale_price ?? p.b2c?.regular_price ?? 0);
      return tot + (pPrice * (p.order_quantity || 1));
    }, 0);
    
    const currency = cart[0]?.currency === "CRC" ? "₡" : "$";

    return (
      <>
        
        <div className="cart-drawer-overlay" onClick={onClose} />
        
        <div className="cart-drawer" role="dialog" aria-label="Menú del carrito">
          <div className="cart-drawer-header">
            <h3>Mi Carrito <span className="cart-drawer-count">{cartItemCount}</span></h3>
            <button type="button" className="cart-drawer-close" onClick={onClose} aria-label="Cerrar">
              ×
            </button>
          </div>

          <div className="cart-drawer-items">
            {cart.map((p, idx) => {
              const price = Number(p.b2c?.sale_price ?? p.b2c?.regular_price ?? 0);
              const symbol = p.currency === "CRC" ? "₡" : "$";
              const keyId = p.id ?? p.objectID ?? idx;

              return (
                <div className="cart-drawer-item" key={keyId}>
                  
                  <div 
                    className="cart-drawer-image-wrapper"
                    onClick={() => {
                      onClose();
                      navigate(`/producto/${keyId}`);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={p.image_url} alt={p.title} className="cart-drawer-image" />
                  </div>

                  <div className="cart-drawer-item-info">
                    <div className="cart-drawer-item-title-row">
                     
                      <p 
                        className="cart-drawer-item-name"
                        onClick={() => {
                          onClose();
                          navigate(`/producto/${keyId}`);
                        }}
                      >
                        {p.title}
                      </p>
                      
                      
                      <button 
                        type="button" 
                        className="cart-drawer-item-delete"
                        onClick={() => removeFromCart(keyId)}
                        title="Eliminar producto"
                      >
                        <Trash2 size={16} strokeWidth={2.5}/>
                      </button>
                    </div>

                    {p.model && <span className="cart-drawer-item-model">MOD: {p.model}</span>}

                    <div className="cart-drawer-item-bottom">
                      <strong className="cart-drawer-item-price">
                        {symbol}{price.toLocaleString("en-US")}
                      </strong>
                      <div className="cart-drawer-item-qty">
                        Cantidad: {p.order_quantity}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        
          <div className="cart-drawer-footer">
            <div className="cart-drawer-subtotal">
              <span>Subtotal</span>
              <strong>{currency}{subtotal.toLocaleString("en-US")}</strong>
            </div>
            
            <button 
              type="button" 
              className="cart-drawer-button" 
              onClick={() => {
                onClose();
                navigate("/cart"); // Te lleva a la página completa de carrito
              }}
            >
              Ver Mi Carrito
            </button>
          </div>
        </div>
      </>
    );
  }

  // --- MODO 2: BURBUJA DE ANIMACIÓN ---
  const price = Number(product?.b2c?.sale_price ?? product?.b2c?.regular_price ?? 0);
  const symbol = product?.currency === "CRC" ? "₡" : "$";

  return (
    <div className="cart-preview" role="dialog" aria-label="Producto agregado al carrito">
      <div className="cart-preview-header">
        <div className="cart-preview-confirmation">
          <span className="cart-preview-check">✓</span>
          <span>Agregado al carrito</span>
        </div>
        <button type="button" className="cart-preview-close" onClick={onClose} aria-label="Cerrar">×</button>
      </div>

      <div className="cart-preview-product">
        <div className="cart-preview-image-wrapper">
          <img src={product?.image_url} alt={product?.title} className="cart-preview-image" />
        </div>

        <div className="cart-preview-info">
          <p className="cart-preview-name">{product?.title}</p>
          {product?.model && <span className="cart-preview-model">MOD: {product.model}</span>}

          <div className="cart-preview-product-footer">
            <span className="cart-preview-quantity">Cantidad: {product?.order_quantity}</span>
            <strong className="cart-preview-price">{symbol}{price.toLocaleString("en-US")}</strong>
          </div>
        </div>
      </div>

      <div className="cart-preview-divider" />
      <div className="cart-preview-summary">
        <span>Carrito</span>
        <span>{cartItemCount} {cartItemCount === 1 ? "producto" : "productos"}</span>
      </div>
      <a href="#/cart" className="cart-preview-button" onClick={onClose}>Ver carrito</a>
    </div>
  );
}