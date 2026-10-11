import "../styles/Checkout.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, ArrowLeft } from "lucide-react";
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
    const errorTimeout = useRef(null);

    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [termsError, setTermsError] = useState(false);

    const handleTermsError = () => {
        setTermsError(true);

        /*
        clearTimeout(errorTimeout.current);

        errorTimeout.current = setTimeout(() => {
            setTermsError(false);
        }, 3000);*/
    };

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

    useEffect(() => {
        return () => clearTimeout(errorTimeout.current);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleGoBack = () => {
        if (window.history.state?.idx > 0) {
            navigate(-1);
        } else {
            navigate("/cart");
        }
    };

    return (
        <div className="checkout-page">
            <PurchaseStepper currentStep={2} />

            {cart.length > 0 && (
                <div className="checkout-layout">
                    <div className="checkout-form-wrapper" ref={checkoutFormRef}>
                        <CheckoutForm
                            acceptedTerms={acceptedTerms}
                            onTermsError={handleTermsError}
                        />
                    </div>

                    <div
                        className="purchase-summary-wrapper"
                        style={{ "--form-height": `${formHeight}px` }}
                    >
                        <PurchaseSummary
                            cart={cart}
                            acceptedTerms={acceptedTerms}
                            setAcceptedTerms={setAcceptedTerms}
                            termsError={termsError}
                            setTermsError={setTermsError}
                            onTermsError={handleTermsError}
                        />
                    </div>
                </div>
            )}

            <div className="go-back-to-cart" onClick={() => handleGoBack()}>
                <ArrowLeft size={16} />
                <small>Volver al carrito</small>
            </div>

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