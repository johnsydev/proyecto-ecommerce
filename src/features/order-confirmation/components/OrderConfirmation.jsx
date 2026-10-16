import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Printer, ShoppingBag } from "lucide-react";
import PurchaseStepper from "../../../components/PurchaseStepper";
import { ORDER_STATUS, PAYMENT_STATUS } from "../../../utils/constants";
import { getLastConfirmedOrder } from "../../../utils/orderStorage";
import "../styles/OrderConfirmation.css";

const formatMoney = (symbol, value) =>
    `${symbol}${Number(value ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;


const formatDateTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString("es-CR", { dateStyle: "long", timeStyle: "short" });
};

const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString("es-CR", { dateStyle: "long" });
};

export default function OrderConfirmation() {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    // Solo se puede ver esta página con una orden pagada y confirmada
    useEffect(() => {
        window.scrollTo(0, 0);
        try {
            const confirmed = getLastConfirmedOrder();

            if (
                !confirmed ||
                confirmed.orderStatus !== ORDER_STATUS.CONFIRMED ||
                confirmed.paymentStatus !== PAYMENT_STATUS.APPROVED
            ) {
                navigate("/cart", { replace: true });
                return;
            }
            setOrder(confirmed);
        } catch {
            navigate("/cart", { replace: true });
            return;
        }
        //setOrder(confirmed);
    }, [navigate]);

    if (!order) {
        return null;
    }

    const symbol = order.currencySymbol ?? "$";
    const { client = {}, delivery = {}, products = [] } = order;
    const estimatedDate = formatDate(delivery.estimatedDate);

    const addressLine = [delivery.address, delivery.district, delivery.canton, delivery.province]
        .filter(Boolean)
        .join(", ");

    return (
        <div className="confirmation-page">
            <PurchaseStepper currentStep={4} />

            <div className="confirmation-layout">
               
                <section className="confirmation-main">
                    <div className="confirmation-hero">
                        <CheckCircle2 size={44} className="confirmation-check" aria-hidden="true" />
                        <h1>¡Gracias por su compra!</h1>
                        <p>
                            Su pago fue aprobado y su pedido está confirmado. Le notificaremos al correo{" "}
                            <strong>{client.email}</strong> sobre el estado de su envío.
                        </p>
                    </div>

                    <dl className="confirmation-meta">
                        <div>
                            <dt>N.º de orden</dt>
                            <dd>{order.orderNumber}</dd>
                        </div>
                        <div>
                            <dt>Fecha</dt>
                            <dd>{formatDateTime(order.date)}</dd>
                        </div>
                        <div>
                            <dt>Pago</dt>
                            <dd>
                                Tarjeta <span className="status-pill status-approved">Aprobado</span>
                            </dd>
                        </div>
                        {order.transactionId && (
                            <div>
                                <dt>Transacción</dt>
                                <dd>{order.transactionId}</dd>
                            </div>
                        )}
                    </dl>

                    <div className="confirmation-blocks">
                        <div className="confirmation-block">
                            <h2>Datos del comprador</h2>
                            <dl>
                                <dt>Nombre</dt>
                                <dd>{client.fullName}</dd>
                                <dt>Correo</dt>
                                <dd>{client.email}</dd>
                                <dt>Teléfono</dt>
                                <dd>{client.phone}</dd>
                            </dl>
                        </div>

                        <div className="confirmation-block">
                            <h2>Datos de entrega</h2>
                            <dl>
                                <dt>Dirección</dt>
                                <dd>{addressLine}</dd>
                                {delivery.recipients && (
                                    <>
                                        <dt>Recibe</dt>
                                        <dd>{delivery.recipients}</dd>
                                    </>
                                )}
                                {estimatedDate && (
                                    <>
                                        <dt>Entrega estimada</dt>
                                        <dd>{estimatedDate}</dd>
                                    </>
                                )}
                                {delivery.additionalNotes && (
                                    <>
                                        <dt>Notas</dt>
                                        <dd>{delivery.additionalNotes}</dd>
                                    </>
                                )}
                            </dl>
                        </div>
                    </div>

                    <div className="confirmation-actions">
                        <button type="button" className="confirmation-primary-btn" onClick={() => navigate("/")}>
                            <ShoppingBag size={18} />
                            Seguir comprando
                        </button>
                    </div>
                </section>

                
                <aside className="confirmation-receipt" aria-label="Resumen de la compra">
                    <h2>Resumen de la compra</h2>

                    <ul className="receipt-items">
                        {products.map((product) => {
                            const lineTotal = product.saleUnitPrice * product.quantity;
                            const hasDiscount = product.originalUnitPrice > product.saleUnitPrice;
                            
                            
                            const productImage = product.imageUrl || product.image_url;

                            return (
                                <li key={product.productId} className="receipt-item">
                                    
                                    {productImage && (
                                        <div className="receipt-item-image">
                                            <img src={productImage} alt={product.name || "Producto"} />
                                        </div>
                                    )}
                                    
                                    <div className="receipt-item-body">
                                        <div className="receipt-item-info">
                                            <span className="receipt-item-name">{product.name}</span>
                                            <span className="receipt-item-detail">
                                                {product.quantity} × {formatMoney(symbol, product.saleUnitPrice)}
                                                {hasDiscount && (
                                                    <s className="receipt-old-price">
                                                        {formatMoney(symbol, product.originalUnitPrice)}
                                                    </s>
                                                )}
                                            </span>
                                        </div>
                                        <span className="receipt-item-total">{formatMoney(symbol, lineTotal)}</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="receipt-totals">
                        <div className="receipt-line">
                            <span>Subtotal</span>
                            <span>{formatMoney(symbol, order.subtotal)}</span>
                        </div>
                        <div className="receipt-line">
                            <span>IVA</span>
                            <span>{formatMoney(symbol, order.total_iva)}</span>
                        </div>
                        <div className="receipt-line">
                            <span>Envío</span>
                            <span>{formatMoney(symbol, order.shippingCost)}</span>
                        </div>
                        <div className="receipt-total">
                            <span>Total</span>
                            <strong>{formatMoney(symbol, order.total)}</strong>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}