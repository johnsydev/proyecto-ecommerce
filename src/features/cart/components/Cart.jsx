import "../styles/Cart.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addUnit, getCart, removeFromCart, removeUnit } from "../services/cartService";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => getCart());

  const getProductId = (product) => product.id ?? product.objectID;

  const refreshCart = () => {
    setCart(getCart());
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Carrito</h1>
        
        <div className="cart-stepper">
          <span className="step active">1. Carrito</span>
          <span className="step-line"></span>
          <span className="step">2. Pago</span>
          <span className="step-line"></span>
          <span className="step">3. Confirmación</span>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <h2>Tu carrito está vacío</h2>
          <p>Explora nuestro catálogo para añadir componentes.</p>
          <button type="button" className="cart-continue-button" onClick={() => navigate("/search")}>
            Ver Catálogo
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items-container" aria-label="Productos en el carrito">
            {cart.map((product) => (
              <CartItem
                key={getProductId(product)}
                product={product}
                onAddUnit={() => {
                  addUnit(getProductId(product));
                  refreshCart();
                }}
                onRemoveUnit={() => {
                  removeUnit(getProductId(product));
                  refreshCart();
                }}
                onRemove={() => {
                  removeFromCart(getProductId(product));
                  refreshCart();
                }}
              />
            ))}
          </section>
          
          <CartSummary cart={cart} />
        </div>
      )}
    </div>
  );
}