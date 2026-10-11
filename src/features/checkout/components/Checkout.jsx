import "../styles/Checkout.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import PurchaseStepper from "../../../components/PurchaseStepper";
import CheckoutForm from "./CheckoutForm";
import PurchaseSummary from "./PurchaseSummary";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [showScrollTop, setShowScrollTop] = useState(false);

  //si el carrito está vacío, redirigir al usuario a la página del carrito
  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

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
    <div className="checkout-page">

      {/* Encabezado y pasos */}
      <PurchaseStepper currentStep={2} />

      {/* Contenido del carrito */}
      {cart.length > 0 && (

        <div className="checkout-layout">

          {/* Formulario */}
          <CheckoutForm />

          {/* Resumen de compra */}
          <PurchaseSummary cart={cart} />

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