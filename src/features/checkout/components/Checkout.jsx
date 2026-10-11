import "../styles/Checkout.css";
import { useState, useEffect, useRef } from "react";
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
  const [formHeight, setFormHeight] = useState(0);
  const checkoutFormRef = useRef(null);

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

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const form = checkoutFormRef.current;

    if (!form) return;

    const updateFormHeight = () => {
      setFormHeight(form.getBoundingClientRect().height);
    };

    updateFormHeight();

    const observer = new ResizeObserver(updateFormHeight);
    observer.observe(form);

    return () => observer.disconnect();
  }, [cart.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="checkout-page">
      <PurchaseStepper currentStep={2} />

      {cart.length > 0 && (
        <div className="checkout-layout">
          <div className="checkout-form-wrapper" ref={checkoutFormRef}>
            <CheckoutForm />
          </div>

          <div
            className="purchase-summary-wrapper"
            style={{ "--form-height": `${formHeight}px` }}
          >
            <PurchaseSummary cart={cart} />
          </div>
        </div>
      )}

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