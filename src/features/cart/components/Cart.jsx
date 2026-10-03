import "../styles/Cart.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addUnit,
  getCart,
  removeFromCart,
  removeUnit
} from "../services/cartService";
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

        <div className="cart-heading">


          <h1>Mi carrito</h1>

          <p>
            Revisa tus productos antes de continuar con la compra.
          </p>
        </div>

        
        <div className="cart-stepper" aria-label="Progreso de compra">

          <div className="step active" aria-current="step">
            <span className="step-number">1</span>
            <span className="step-label">Carrito</span>
          </div>

          <span className="step-line"></span>

          <div className="step">
            <span className="step-number">2</span>
            <span className="step-label">Pago</span>
          </div>

          <span className="step-line"></span>

          <div className="step">
            <span className="step-number">3</span>
            <span className="step-label">Confirmación</span>
          </div>

        </div>
      </div>

      
      {cart.length === 0 ? (

        <div className="cart-empty">
          <h2>Tu carrito está vacío</h2>

          <p>
            Explora nuestro catálogo para añadir componentes.
          </p>

          <button
            type="button"
            className="cart-continue-button"
            onClick={() => navigate("/search")}
          >
            Ver Catálogo
          </button>
        </div>

      ) : (

        <div className="cart-layout">

         
          <section
            className="cart-items-container"
            aria-label="Productos en el carrito"
          >
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
