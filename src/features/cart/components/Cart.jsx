
import "../styles/Cart.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import emptyCartImage from "../../../assets/electro_carrito_vacio.png";
import { useCart } from "../../../context/CartContext";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import PurchaseStepper from "../../../components/PurchaseStepper";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, addUnit, removeUnit, removeFromCart } = useCart();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const getProductId = (product) => product.id ?? product.objectID;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="cart-page">

      {/* Encabezado y pasos */}
      <PurchaseStepper currentStep={1} />

      {/* Contenido del carrito */}
      {cart.length === 0 ? (

        <div className="cart-empty">
          <img
            className="cart-empty-image"
            src={emptyCartImage}
            alt="Carrito vacío"
          />

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

          {/* Lista de productos */}
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
                }}
                onRemoveUnit={() => {
                  removeUnit(getProductId(product));
                }}
                onRemove={() => {
                  removeFromCart(getProductId(product));
                }}
              />
            ))}
          </section>

          {/* Resumen de compra */}
          <CartSummary cart={cart} />

        </div>
      )}

      {/* Botón flotante para volver arriba */}
      {cart.length > 0 && showScrollTop && (
        <button
          type="button"
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Volver al inicio de la página"
          title="Volver arriba"
        >
          <ArrowUp size={22} strokeWidth={2.5} />
        </button>
      )}

    </div>
  );
}