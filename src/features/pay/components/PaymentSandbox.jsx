import { useState } from "react";
import { AlertCircle, XCircle, CreditCard, Lock } from "lucide-react";
import "../styles/PaymentSandbox.css";


const FIXED_CARDS = {
    "4000123456780000": "PAYMENT_APPROVED",
    "4000123456780001": "PAYMENT_DECLINED",
    "4000123456780002": "PAYMENT_ERROR",
};

const SCENARIO_BAG_KEY = "sandboxScenarioBag";
const SANDBOX_DELAY_MS = 2000;

const shuffle = (list) => {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

function nextBalancedScenario() {
    const all = ["PAYMENT_APPROVED", "PAYMENT_DECLINED", "PAYMENT_ERROR"];
    try {
        let bag = JSON.parse(localStorage.getItem(SCENARIO_BAG_KEY) || "[]");
        if (!Array.isArray(bag) || bag.length === 0) bag = shuffle(all);
        const next = bag.pop();
        localStorage.setItem(SCENARIO_BAG_KEY, JSON.stringify(bag));
        return next;
    } catch {
        return shuffle(all)[0]; 
    }
}

function simulatePaymentGateway({ orderId, amount, currency, card }) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const base = { orderId, amount, currency, processedAt: new Date().toISOString() };
            const cardNumber = card.number.replace(/\s/g, "");
            const scenario = FIXED_CARDS[cardNumber] ?? nextBalancedScenario();

            if (scenario === "PAYMENT_APPROVED") {
                return resolve({
                    ...base,
                    status: "PAYMENT_APPROVED",
                    transactionId: `TX-${Date.now()}`,
                    message: "Pago aprobado.",
                });
            }
            if (scenario === "PAYMENT_DECLINED") {
                return resolve({
                    ...base,
                    status: "PAYMENT_DECLINED",
                    reason: "INSUFFICIENT_FUNDS",
                    message: "Fondos insuficientes o tarjeta declinada por el banco emisor.",
                });
            }
           
            return reject(new Error("SERVICE_UNAVAILABLE"));
        }, SANDBOX_DELAY_MS);
    });
}


const formatCardNumber = (value) =>
    value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

function validateCard({ number, name, expiry, cvv }) {
    const errors = {};

    if (number.replace(/\s/g, "").length !== 16) {
        errors.number = "Ingrese los 16 dígitos de la tarjeta.";
    }
    if (name.trim().length < 3) {
        errors.name = "Ingrese el nombre tal como aparece en la tarjeta.";
    }

    const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
    if (!match) {
        errors.expiry = "Use el formato MM/AA.";
    } else {
        const month = Number(match[1]);
        const year = 2000 + Number(match[2]);
        const now = new Date();
        const isExpired =
            year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1);
        if (month < 1 || month > 12) errors.expiry = "El mes debe estar entre 01 y 12.";
        else if (isExpired) errors.expiry = "La tarjeta está vencida.";
    }

    if (!/^\d{3,4}$/.test(cvv)) {
        errors.cvv = "Ingrese 3 o 4 dígitos.";
    }

    return errors;
}


export default function PaymentSandbox({ orderId, total, currency, onResult, onProcessingChange }) {
    const [status, setStatus] = useState("IDLE"); 
    const [declineMessage, setDeclineMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [cardData, setCardData] = useState({ number: "", name: "", expiry: "", cvv: "" });

    const isProcessing = status === "PROCESSING";

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        let formatted = value;
        if (name === "number") formatted = formatCardNumber(value);
        if (name === "expiry") formatted = formatExpiry(value);
        if (name === "cvv") formatted = value.replace(/\D/g, "").slice(0, 4);

        setCardData((prev) => ({ ...prev, [name]: formatted }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (isProcessing) return; 

        const validationErrors = validateCard(cardData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setStatus("PROCESSING");
        onProcessingChange?.(true);

        try {
            const response = await simulatePaymentGateway({
                orderId,
                amount: Number(total),
                currency,
                card: cardData,
            });

            if (response.status === "PAYMENT_DECLINED") {
                setDeclineMessage(response.message);
                setStatus("DECLINED");
            }
            onResult(response); 
        } catch {
            setStatus("ERROR");
            onResult({
                status: "PAYMENT_ERROR",
                orderId,
                reason: "SERVICE_UNAVAILABLE",
                message: "No pudimos conectar con la red de procesamiento.",
                processedAt: new Date().toISOString(),
            });
        } finally {
            onProcessingChange?.(false);
        }
    };

    return (
        
        <section className="checkout-form payment-form" aria-labelledby="payment-title">
            <h2 id="payment-title">Pago con tarjeta</h2>

            <div aria-live="polite">
                {status === "DECLINED" && (
                    <div className="payment-alert alert-declined" role="alert">
                        <XCircle size={22} />
                        <div>
                            <strong>Pago rechazado</strong>
                            <p>{declineMessage} Su pedido sigue pendiente: puede intentarlo de nuevo.</p>
                        </div>
                    </div>
                )}

                {status === "ERROR" && (
                    <div className="payment-alert alert-error" role="alert">
                        <AlertCircle size={22} />
                        <div>
                            <strong>No se pudo procesar el pago</strong>
                            <p>Ocurrió un problema de comunicación y no se realizó ningún cobro. Intente de nuevo.</p>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handlePaymentSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="card-number">
                        Número de tarjeta <span className="field-required">*</span>
                    </label>
                    <div className="input-with-icon">
                        <CreditCard size={18} className="input-icon" />
                        <input
                            id="card-number"
                            type="text"
                            name="number"
                            inputMode="numeric"
                            autoComplete="off"
                            value={cardData.number}
                            onChange={handleFormChange}
                            placeholder="0000 0000 0000 0000"
                            aria-invalid={!!errors.number}
                            disabled={isProcessing}
                        />
                    </div>
                    {errors.number && <p className="field-error">{errors.number}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="card-name">
                        Nombre en la tarjeta <span className="field-required">*</span>
                    </label>
                    <input
                        id="card-name"
                        type="text"
                        name="name"
                        autoComplete="off"
                        value={cardData.name}
                        onChange={handleFormChange}
                        placeholder="Ej. Juan Pérez"
                        aria-invalid={!!errors.name}
                        disabled={isProcessing}
                    />
                    {errors.name && <p className="field-error">{errors.name}</p>}
                </div>

                <div className="payment-form-row">
                    <div className="form-group">
                        <label htmlFor="card-expiry">
                            Vencimiento <span className="field-required">*</span>
                        </label>
                        <input
                            id="card-expiry"
                            type="text"
                            name="expiry"
                            inputMode="numeric"
                            autoComplete="off"
                            value={cardData.expiry}
                            onChange={handleFormChange}
                            placeholder="MM/AA"
                            aria-invalid={!!errors.expiry}
                            disabled={isProcessing}
                        />
                        {errors.expiry && <p className="field-error">{errors.expiry}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="card-cvv">
                            CVV <span className="field-required">*</span>
                        </label>
                        <input
                            id="card-cvv"
                            type="password"
                            name="cvv"
                            inputMode="numeric"
                            autoComplete="off"
                            value={cardData.cvv}
                            onChange={handleFormChange}
                            placeholder="***"
                            aria-invalid={!!errors.cvv}
                            disabled={isProcessing}
                        />
                        {errors.cvv && <p className="field-error">{errors.cvv}</p>}
                    </div>
                </div>

                <button type="submit" className="checkout-continue-button payment-submit" disabled={isProcessing}>
                    {isProcessing ? (
                        <>
                            <span className="spinner" aria-hidden="true" />
                            Procesando pago...
                        </>
                    ) : (
                        <>
                            <Lock size={16} />
                            {status === "DECLINED" || status === "ERROR" ? "Reintentar pago de " : "Pagar "}
                            {currency}{Number(total).toLocaleString("en-US")}
                        </>
                    )}
                </button>
            </form>
        </section>
    );
}