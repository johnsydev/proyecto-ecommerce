import { useState } from "react";
import { AlertCircle, XCircle, CreditCard, Lock, WifiOff } from "lucide-react";
import "../styles/PaymentSandbox.css";


const FIXED_CARDS = {
    "4242424242424242": "PAYMENT_APPROVED",
    "4000000000000002": "PAYMENT_DECLINED",
    "4000000000000119": "PAYMENT_ERROR",
    "5555555555554444": "PAYMENT_APPROVED",
    "5105105105105100": "PAYMENT_DECLINED",
    "5200828282828210": "PAYMENT_ERROR",
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
            if (typeof navigator !== "undefined" && navigator.onLine === false) {
                return reject(new Error("NETWORK_OFFLINE"));
            }

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



const CARD_BRANDS = {
    visa: { name: "Visa", pattern: /^4/, length: 16, cvvLength: 3, gaps: [4, 8, 12] },
    mastercard: {
        name: "Mastercard",
        
        pattern: /^(5[1-5]|2(22[1-9]|2[3-9]\d|[3-6]\d\d|7[01]\d|720))/,
        length: 16,
        cvvLength: 3,
        gaps: [4, 8, 12],
    },
    amex: { name: "American Express", pattern: /^3[47]/, length: 15, cvvLength: 4, gaps: [4, 10] },
};

function detectBrand(number) {
    const digits = number.replace(/\D/g, "");
    return Object.values(CARD_BRANDS).find((brand) => brand.pattern.test(digits)) ?? null;
}


function passesLuhn(digits) {
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
        let digit = Number(digits[digits.length - 1 - i]);
        if (i % 2 === 1) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
    }
    return sum % 10 === 0;
}

function formatCardNumber(value) {
    const digits = value.replace(/\D/g, "");
    const brand = detectBrand(digits);
    const trimmed = digits.slice(0, brand?.length ?? 16);
    const gaps = brand?.gaps ?? [4, 8, 12];

    return trimmed
        .split("")
        .map((digit, i) => (gaps.includes(i) ? ` ${digit}` : digit))
        .join("");
}

const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

function validateCard({ number, name, expiry, cvv }) {
    const errors = {};
    const digits = number.replace(/\s/g, "");
    const brand = detectBrand(digits);

    if (!digits) {
        errors.number = "Ingrese el número de tarjeta.";
    } else if (!brand) {
        errors.number = "Solo aceptamos tarjetas Visa, Mastercard o American Express.";
    } else if (digits.length !== brand.length) {
        errors.number = `Las tarjetas ${brand.name} tienen ${brand.length} dígitos.`;
    } else if (!passesLuhn(digits)) {
        errors.number = "El número de tarjeta no es válido. Revise que esté bien escrito.";
    }

    if (!/^[\p{L}][\p{L}\s.'-]{2,}$/u.test(name.trim())) {
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

        if (month < 1 || month > 12) {
            errors.expiry = "El mes debe estar entre 01 y 12.";
        } else if (isExpired) {
            errors.expiry = "La tarjeta está vencida.";
        } else if (year > now.getFullYear() + 10) {
            errors.expiry = "La fecha de vencimiento no es válida.";
        }
    }

    const cvvLength = brand?.cvvLength;
    const cvvOk = cvvLength ? cvv.length === cvvLength : /^\d{3,4}$/.test(cvv);
    if (!cvvOk) {
        errors.cvv = cvvLength ? `Ingrese los ${cvvLength} dígitos del código.` : "Ingrese 3 o 4 dígitos.";
    }

    return errors;
}

/* ---------- Logos de marca (SVG propio, sin recursos externos) ---------- */

function CardBrandLogo({ brand }) {
    if (!brand) return null;

    if (brand.name === "Visa") {
        return (
            <svg viewBox="0 0 48 30" role="img" aria-label="Visa" className="card-brand-logo">
                <rect width="48" height="30" rx="4" fill="#1a1f71" />
                <text x="24" y="21" textAnchor="middle" fontSize="15" fontWeight="800" fontStyle="italic" fill="#fff" fontFamily="Arial, sans-serif">
                    VISA
                </text>
            </svg>
        );
    }

    if (brand.name === "Mastercard") {
        return (
            <svg viewBox="0 0 48 30" role="img" aria-label="Mastercard" className="card-brand-logo">
                <rect width="48" height="30" rx="4" fill="#ffffff" stroke="#e5e7eb" />
                <circle cx="19" cy="15" r="9" fill="#eb001b" />
                <circle cx="29" cy="15" r="9" fill="#f79e1b" />
                <path d="M24 7.8a9 9 0 0 1 0 14.4 9 9 0 0 1 0-14.4z" fill="#ff5f00" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 48 30" role="img" aria-label="American Express" className="card-brand-logo">
            <rect width="48" height="30" rx="4" fill="#2e77bc" />
            <text x="24" y="19" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">
                AMEX
            </text>
        </svg>
    );
}

/* ==========================================================================
   Componente
   Props:
     orderId, total, currency    -> datos de la transacción
     attemptsLeft                -> intentos de pago que le quedan a la orden
     onResult(response)          -> recibe la respuesta de la pasarela
                                    (Pay.jsx registra el intento en la orden)
     onProcessingChange(bool)    -> avisa a Pay.jsx cuando hay un pago en curso
   ========================================================================== */

export default function PaymentSandbox({ orderId, total, currency, attemptsLeft, onResult, onProcessingChange }) {
    const [status, setStatus] = useState("IDLE"); 
    const [alertMessage, setAlertMessage] = useState("");
    const [offline, setOffline] = useState(false);
    const [errors, setErrors] = useState({});
    const [cardData, setCardData] = useState({ number: "", name: "", expiry: "", cvv: "" });

    const isProcessing = status === "PROCESSING";
    const brand = detectBrand(cardData.number);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        let formatted = value;
        if (name === "number") formatted = formatCardNumber(value);
        if (name === "expiry") formatted = formatExpiry(value);
        if (name === "cvv") formatted = value.replace(/\D/g, "").slice(0, brand?.cvvLength ?? 4);

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
                setAlertMessage(response.message);
                setStatus("DECLINED");
            }
            onResult(response);
        } catch (error) {
            const isOffline = error?.message === "NETWORK_OFFLINE";
            setOffline(isOffline);
            setStatus("ERROR");
            onResult({
                status: "PAYMENT_ERROR",
                orderId,
                reason: isOffline ? "NETWORK_OFFLINE" : "SERVICE_UNAVAILABLE",
                message: isOffline
                    ? "Parece que no tiene conexión a internet."
                    : "No pudimos conectar con la red de procesamiento.",
                processedAt: new Date().toISOString(),
            });
        } finally {
            onProcessingChange?.(false);
        }
    };

    const attemptsText =
        attemptsLeft === 1 ? "Le queda 1 intento." : `Le quedan ${attemptsLeft} intentos.`;

    return (
       
        <section className="checkout-form payment-form" aria-labelledby="payment-title">
            <h2 id="payment-title">Pago con tarjeta</h2>

            <div aria-live="polite">
                {status === "DECLINED" && (
                    <div className="payment-alert alert-declined" role="alert">
                        <XCircle size={22} />
                        <div>
                            <strong>Pago rechazado</strong>
                            <p>
                                {alertMessage} Su pedido sigue pendiente. {attemptsText}
                            </p>
                        </div>
                    </div>
                )}

                {status === "ERROR" && (
                    <div className="payment-alert alert-error" role="alert">
                        {offline ? <WifiOff size={22} /> : <AlertCircle size={22} />}
                        <div>
                            <strong>No se pudo procesar el pago</strong>
                            <p>
                                {offline
                                    ? "Parece que no tiene conexión a internet."
                                    : "Ocurrió un problema de comunicación."}{" "}
                                No se realizó ningún cobro. {attemptsText}
                            </p>
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
                        <CardBrandLogo brand={brand} />
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
                            placeholder={brand?.cvvLength === 4 ? "****" : "***"}
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