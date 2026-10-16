import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowUp, ArrowLeft, ShieldCheck, XOctagon, Info } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import PurchaseStepper from "../../../components/PurchaseStepper";
import PaymentSandbox from "./PaymentSandbox";
import { ORDER_STATUS, PAYMENT_STATUS } from "../../../utils/constants";
import {
    MAX_PAYMENT_ATTEMPTS,
    FAILURE_REASON,
    getCurrentOrder,
    expireStaleOrders,
    recoverInterruptedPayment,
    markPaymentStarted,
    recordPaymentAttempt,
    clearCurrentOrder,
} from "../../../utils/orderStorage";
import "../../checkout/styles/Checkout.css"; 
import "../styles/Pay.css";



const PAYMENT_LABELS = {
    [PAYMENT_STATUS.PENDING]: "Pendiente",
    [PAYMENT_STATUS.APPROVED]: "Aprobado",
    [PAYMENT_STATUS.DECLINED]: "Rechazado",
    [PAYMENT_STATUS.ERROR]: "Error",
};

const ORDER_LABELS = {
    [ORDER_STATUS.PENDING]: "Pendiente",
    [ORDER_STATUS.CONFIRMED]: "Confirmada",
    [ORDER_STATUS.DELIVERED]: "Entregada",
    [ORDER_STATUS.FAILED]: "Fallida",
};

const FAILURE_MESSAGES = {
    [FAILURE_REASON.MAX_ATTEMPTS_REACHED]:
        "Se alcanzó el número máximo de intentos de pago. No se realizó ningún cobro.",
    [FAILURE_REASON.ORDER_EXPIRED]:
        "La orden expiró por inactividad antes de completarse el pago. No se realizó ningún cobro.",
};

const CURRENCY = "₡"; 

const formatMoney = (currency, value) =>
    `${currency}${Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export default function Pay() {
    const navigate = useNavigate();
    const location = useLocation();
    const { clearCart } = useCart();

    const [showScrollTop, setShowScrollTop] = useState(false);
    const [orderInfo, setOrderInfo] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [interruptedNotice, setInterruptedNotice] = useState(false);

    // Carga la orden en proceso desde el historial; sin orden no hay nada que pagar
    useEffect(() => {
        expireStaleOrders();
        const current = getCurrentOrder();
        if (!current) {
            navigate("/cart", { replace: true });
            return;
        }

       
        const { order, interrupted } = recoverInterruptedPayment(current.orderNumber);
        setOrderInfo(order);
        setInterruptedNotice(interrupted);
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
        navigate("/checkout", { state: location.state }); 
    };

 
    const handleBackToCart = () => {
        clearCurrentOrder();
        navigate("/cart");
    };

  
    const handleProcessingChange = (processing) => {
        setIsProcessing(processing);
        if (processing && orderInfo) markPaymentStarted(orderInfo.orderNumber);
    };

    const handlePaymentResult = (response) => {
        const updated = recordPaymentAttempt(orderInfo.orderNumber, {
            ...response,
            currencySymbol: CURRENCY,
        });
        if (!updated) return;

        setOrderInfo(updated);
        setInterruptedNotice(false);

        if (updated.orderStatus === ORDER_STATUS.CONFIRMED) {
            clearCart?.();
            navigate("/order-confirmation");
        }
    };

    if (!orderInfo) return null;

    const currency = CURRENCY;
    const fullName = orderInfo.client?.fullName || "Cliente";
    const total = orderInfo.total || 0;
    const isFailed = orderInfo.orderStatus === ORDER_STATUS.FAILED;
    const attemptsLeft = Math.max(MAX_PAYMENT_ATTEMPTS - (orderInfo.paymentAttempts ?? 0), 0);

    return (
        <div className="checkout-page">
            <PurchaseStepper currentStep={3} />

            <div className="pay-layout">
                {isFailed ? (
                    <section className="pay-failed" role="alert">
                        <XOctagon size={40} className="pay-failed-icon" aria-hidden="true" />
                        <h2>No pudimos completar su orden</h2>
                        <p>{FAILURE_MESSAGES[orderInfo.failureReason] ?? "La orden no pudo completarse."}</p>
                        <p className="pay-failed-order">
                            Orden <strong>{orderInfo.orderNumber}</strong> · Estado: Fallida
                        </p>
                        <button type="button" className="pay-failed-btn" onClick={handleBackToCart}>
                            Volver al carrito
                        </button>
                    </section>
                ) : (
                    <div className="pay-main">
                        {interruptedNotice && (
                            <div className="pay-notice" role="status">
                                <Info size={20} />
                                <p>
                                    Detectamos que un intento de pago anterior no terminó. No se realizó ningún
                                    cobro; puede intentarlo de nuevo.
                                </p>
                            </div>
                        )}
                        <PaymentSandbox
                            orderId={orderInfo.orderNumber}
                            total={total}
                            currency={currency}
                            attemptsLeft={attemptsLeft}
                            onResult={handlePaymentResult}
                            onProcessingChange={handleProcessingChange}
                        />
                    </div>
                )}

                <aside className="pay-summary-sidebar" aria-label="Resumen del pedido">
                    <h3>Resumen del pedido</h3>

                    <div className="pay-summary-details">
                        <div className="pay-summary-line">
                            <span>N.º de orden</span>
                            <span>{orderInfo.orderNumber}</span>
                        </div>
                        <div className="pay-summary-line">
                            <span>Cliente</span>
                            <span>{fullName}</span>
                        </div>
                        <div className="pay-summary-line">
                            <span>Estado de la orden</span>
                            <span className={`status-pill status-${orderInfo.orderStatus.toLowerCase()}`}>
                                {ORDER_LABELS[orderInfo.orderStatus] ?? orderInfo.orderStatus}
                            </span>
                        </div>
                        <div className="pay-summary-line">
                            <span>Estado del pago</span>
                            <span className={`status-pill status-${orderInfo.paymentStatus.toLowerCase()}`}>
                                {PAYMENT_LABELS[orderInfo.paymentStatus] ?? orderInfo.paymentStatus}
                            </span>
                        </div>

                        <div className="pay-summary-divider"></div>

                        {orderInfo.subtotal !== undefined && (
                            <div className="pay-summary-line">
                                <span>Subtotal</span>
                                <span>{formatMoney(currency, orderInfo.subtotal)}</span>
                            </div>
                        )}
                        {orderInfo.total_iva !== undefined && (
                            <div className="pay-summary-line">
                                <span>IVA</span>
                                <span>{formatMoney(currency, orderInfo.total_iva)}</span>
                            </div>
                        )}
                        {orderInfo.shippingCost !== undefined && (
                            <div className="pay-summary-line">
                                <span>Envío</span>
                                <span>{formatMoney(currency, orderInfo.shippingCost)}</span>
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

            {!isFailed && (
                <div
                    className={`go-back-to-cart ${isProcessing ? "is-disabled" : ""}`}
                    onClick={handleGoBack}
                    role="button"
                    tabIndex={isProcessing ? -1 : 0}
                    onKeyDown={(e) => e.key === "Enter" && handleGoBack()}
                >
                    <ArrowLeft size={16} />
                    <small>Volver a información de checkout</small>
                </div>
            )}

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