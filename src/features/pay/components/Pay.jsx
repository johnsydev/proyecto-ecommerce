import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, ArrowLeft, ShieldCheck } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import PurchaseStepper from "../../../components/PurchaseStepper";
import PaymentSandbox from "./PaymentSandbox";
import { ORDER_STATUS, PAYMENT_STATUS } from "../../../utils/constants";
import "../../checkout/styles/Checkout.css"; 
import "../styles/Pay.css";


const PAYMENT_LABELS = {
    [PAYMENT_STATUS.PENDING]: "Pendiente",
    [PAYMENT_STATUS.APPROVED]: "Aprobado",
    [PAYMENT_STATUS.DECLINED]: "Rechazado",
    [PAYMENT_STATUS.ERROR]: "Error",
};
 
const formatMoney = (currency, value) => `${currency}${Number(value).toLocaleString("en-US")}`;
 
export default function Pay() {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
 
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [orderInfo, setOrderInfo] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
 
    
    useEffect(() => {
        try {
            const savedOrder = localStorage.getItem("order");
            if (!savedOrder) {
                navigate("/cart");
                return;
            }
            const parsed = JSON.parse(savedOrder);
            
            setOrderInfo({
                ...parsed,
                orderStatus: parsed.orderStatus ?? ORDER_STATUS.PENDING,
                paymentStatus: parsed.paymentStatus ?? PAYMENT_STATUS.PENDING,
            });
        } catch {
            navigate("/cart");
        }
    }, [navigate]);
 
    useEffect(() => {
        window.scrollTo(0, 0);
        const handleScroll = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
 
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
 
    const handleGoBack = () => {
        if (isProcessing) return;
        navigate("/checkout");
    };
 
   
    const handlePaymentResult = (response) => {
        const attempts = (orderInfo.paymentAttempts ?? 0) + 1;
 
        if (response.status === "PAYMENT_APPROVED") {
            const finalOrder = {
                ...orderInfo,
                paymentStatus: PAYMENT_STATUS.APPROVED,
                orderStatus: ORDER_STATUS.CONFIRMED,
                transactionId: response.transactionId,
                paymentAttempts: attempts,
                paidAt: response.processedAt,
            };
            localStorage.setItem("finalOrder", JSON.stringify(finalOrder));
            localStorage.removeItem("order");
            clearCart?.();
            navigate("/order-confirmation");
            return;
        }
 
       
        const updatedOrder = {
            ...orderInfo,
            paymentStatus:
                response.status === "PAYMENT_DECLINED" ? PAYMENT_STATUS.DECLINED : PAYMENT_STATUS.ERROR,
            orderStatus: ORDER_STATUS.PENDING,
            paymentAttempts: attempts,
            lastPaymentFailure: { reason: response.reason, at: response.processedAt },
        };
        setOrderInfo(updatedOrder);
        localStorage.setItem("order", JSON.stringify(updatedOrder));
    };
 
    if (!orderInfo) return null;
 
    const firstItem = orderInfo.products?.[0] || cart?.[0];
    const currency = firstItem?.currency === "CRC" ? "₡" : "$";
    const fullName = orderInfo.client?.fullName || "Cliente";
    const total = orderInfo.total || 0;
    const orderId = orderInfo.orderNumber;
 
    
    const subtotal = orderInfo.subtotal;
    const tax = orderInfo.total_iva;
    const shipping = orderInfo.shippingCost;
 
    return (
        <div className="checkout-page">
            <PurchaseStepper currentStep={3} />
 
            <div className="pay-layout">
                <PaymentSandbox
                    orderId={orderId}
                    total={total}
                    currency={currency}
                    onResult={handlePaymentResult}
                    onProcessingChange={setIsProcessing}
                />
 
                <aside className="pay-summary-sidebar" aria-label="Resumen del pedido">
                    <h3>Resumen del pedido</h3>
 
                    <div className="pay-summary-details">
                        <div className="pay-summary-line">
                            <span>N.º de orden</span>
                            <span>{orderId}</span>
                        </div>
                        <div className="pay-summary-line">
                            <span>Cliente</span>
                            <span>{fullName}</span>
                        </div>
                        <div className="pay-summary-line">
                            <span>Estado del pago</span>
                            <span className={`status-pill status-${orderInfo.paymentStatus.toLowerCase()}`}>
                                {PAYMENT_LABELS[orderInfo.paymentStatus] ?? orderInfo.paymentStatus}
                            </span>
                        </div>
 
                        <div className="pay-summary-divider"></div>
 
                        {subtotal !== undefined && (
                            <div className="pay-summary-line">
                                <span>Subtotal</span>
                                <span>{formatMoney(currency, subtotal)}</span>
                            </div>
                        )}
                        {tax !== undefined && (
                            <div className="pay-summary-line">
                                <span>IVA</span>
                                <span>{formatMoney(currency, tax)}</span>
                            </div>
                        )}
                        {shipping !== undefined && (
                            <div className="pay-summary-line">
                                <span>Envío</span>
                                <span>{formatMoney(currency, shipping)}</span>
                            </div>
                        )}
 
                        <div className="pay-summary-total">
                            <span>Total</span>
                            <strong>{formatMoney(currency, total)}</strong>
                        </div>
                    </div>
 
                    <div className="pay-security-note">
                        <ShieldCheck size={20} />
                        <span>Transacción encriptada y 100% segura.</span>
                    </div>
                </aside>
            </div>
 
            <div
                className={`go-back-to-cart ${isProcessing ? "is-disabled" : ""}`}
                onClick={handleGoBack}
                role="button"
                tabIndex={isProcessing ? -1 : 0}
                onKeyDown={(e) => e.key === "Enter" && handleGoBack()}
            >
                <ArrowLeft size={16} />
                <small>Volver a información de envío</small>
            </div>
 
            {showScrollTop && (
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