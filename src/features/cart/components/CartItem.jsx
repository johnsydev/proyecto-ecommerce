import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useUser } from "../../../context/useUser";
import { formatUnits, getBranch } from "../../../utils/inventory";
import { getMaxQuantity } from "../../../utils/cartValidation";
import { getMinQuantity, getPriceInfo, PRICE_LISTS } from "../../../utils/pricing";
import "../styles/CartItem.css";

/*
   * Objetivo:
   *   - Mostrar y gestionar un ítem individual en el carrito de compras.
   *   - Permitir la adición, eliminación y actualización de la cantidad del producto.
   * 
   * Entrada:
   *   - product: Objeto que representa el producto en el carrito.
   *   - branchId: Sucursal seleccionada, que limita la cantidad máxima.
   *   - issue: Problema de validación de la línea (precio, inventario o mínimo B2B), si existe.
   *   - onAddUnit: Función para aumentar la cantidad del producto.
   *   - onRemoveUnit: Función para disminuir la cantidad del producto.
   *   - onRemove: Función para eliminar el producto del carrito.
   *   - onAdjust: Función que ajusta la cantidad a un valor válido.
   * 
   * Salida:
   *   - Renderizado del ítem del carrito con la información del producto y controles de cantidad.
   * 
   * Restricciones:
   *   - La cantidad de un producto no puede exceder su stock disponible en la sucursal seleccionada.
   *   - La cantidad de un producto no puede ser negativa.
   *   - El precio mostrado es el de la lista del usuario (B2C o B2B).
   */

export default function CartItem({ product, branchId = null, issue = null, onAddUnit, onRemoveUnit, onRemove, onAdjust }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);

  const price = getPriceInfo(product, user);
  const minQuantity = getMinQuantity(product, user);
  const isB2B = price.priceList === PRICE_LISTS.B2B;
  const branch = getBranch(branchId);
  const maxQuantity = getMaxQuantity(product, branchId);
  const currency = product.currency === "CRC" ? "₡" : "$";

  const subtotal = (price.unitPrice ?? 0) * product.order_quantity;
  const keyId = product.id ?? product.objectID;

  const handleDecrease = () => {
    if (product.order_quantity <= minQuantity) {
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
          
          <div 
            className="cart-item-image-wrapper"
            onClick={() => navigate(`/producto/${keyId}`)}
            style={{ cursor: "pointer" }}
          >
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
                <span className="price-label">
                  {isB2B ? "PRECIO B2B U." : "PRECIO U."}
                </span>
                {price.isValid ? (
                  <span className="current-price">{currency}{price.unitPrice.toLocaleString("en-US")}</span>
                ) : (
                  <span className="current-price price-unavailable">No disponible</span>
                )}
                {price.hasDiscount && (
                  <span className="old-price">{currency}{price.regularPrice.toLocaleString("en-US")}</span>
                )}
              </div>

              <div className="price-column subtotal-column">
                <span className="price-label">SUBTOTAL</span>
                <span className="subtotal-price">{currency}{subtotal.toLocaleString("en-US")}</span>
              </div>
            </div>
          </div>
        </div>
        
        
        <div className="cart-item-bottom-section">
          <div className="cart-item-quantity-group">
            <div className="qty-selector">
              <button type="button" onClick={handleDecrease}>-</button>
              <span>{product.order_quantity}</span>
              <button type="button" onClick={onAddUnit} disabled={product.order_quantity >= maxQuantity}>+</button>
            </div>

            {isB2B && (
              <small className="cart-item-note">Mínimo B2B: {minQuantity} unidades</small>
            )}
            {branch && maxQuantity > 0 && (
              <small className="cart-item-note">
                Disponible en {branch.name}: {formatUnits(maxQuantity)}
              </small>
            )}
          </div>

          <button 
            type="button" 
            className="delete-btn" 
            // onClick = {onRemove}
            onClick={() => setShowModal(true)} 
            title="Eliminar producto"
          >
            <Trash2 size={18} strokeWidth={2} />
          </button>
        </div>

        {issue && (
          <div className="cart-item-issue" role="alert">
            <span>{issue.message}</span>
            {issue.adjustTo && (
              <button type="button" onClick={() => onAdjust(issue.adjustTo)}>
                Ajustar a {formatUnits(issue.adjustTo)}
              </button>
            )}
          </div>
        )}

        
        <div className="cart-item-divider"></div>
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