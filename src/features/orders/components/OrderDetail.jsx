import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import sadRobot from "../../../assets/electroTriste.png";
import { useUser } from "../../../context/useUser";
import { FAILURE_MESSAGES } from "../../../utils/orderStorage";
import { useUserOrders } from "../hooks/useUserOrders";
import { formatOrderDate, formatOrderMoney } from "../services/ordersService";
import StatusPill from "./StatusPill";
import "../styles/Orders.css";

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("es-CR", { dateStyle: "long" });
};

/*
 * Objetivo:
 * Mostrar el detalle completo de una orden del usuario activo.
 *
 * Entrada:
 * - orderNumber: Parámetro de la ruta /orders/:orderNumber.
 *
 * Salida:
 * - Datos de la orden: usuario, rol, cliente, empresa, sucursal, condiciones
 *   comerciales, productos con precio aplicado, totales y estados.
 * - Pantalla "Orden no encontrada" si la orden no existe o no pertenece al usuario.
 *
 * Restricciones:
 * - Solo busca entre las órdenes del usuario activo.
 * - Las órdenes antiguas sin sucursal o condiciones muestran "No registrada".
 */
export default function OrderDetail() {
  const { orderNumber } = useParams();
  const { user } = useUser();
  const { orders, loading } = useUserOrders(user?.id ?? null);

  if (loading) {
    return (
      <div className="orders-page">
        <p className="orders-loading" role="status">Cargando la orden...</p>
      </div>
    );
  }

  const order = orders.find((item) => item.orderNumber === orderNumber);

  if (!order) {
    return (
      <div className="orders-page">
        <section className="orders-not-found" role="alert">
          <img src={sadRobot} alt="Mascota de Electro-Commerce CR triste" />
          <h1>Orden no encontrada</h1>
          <p>
            No encontramos la orden <strong>{orderNumber}</strong>. Verifica el
            número o consulta el listado de tus órdenes.
          </p>
          <Link to="/orders" className="orders-primary-link">
            Ir a mis órdenes
          </Link>
        </section>
      </div>
    );
  }

  const { client = {}, delivery = {}, products = [] } = order;
  const conditions = order.commercialConditions;
  const addressLine = [delivery.address, delivery.district, delivery.canton, delivery.province]
    .filter(Boolean)
    .join(", ");
  const estimatedDate = formatDate(delivery.estimatedDate);
  const failureMessage =
    order.failureReason &&
    (FAILURE_MESSAGES[order.failureReason] ?? "La orden no pudo completarse.");

  return (
    <div className="orders-page">
      <Link to="/orders" className="orders-back">
        <ArrowLeft size={16} aria-hidden="true" /> Volver a mis órdenes
      </Link>

      <header className="orders-heading">
        <span className="orders-eyebrow">DETALLE DE LA ORDEN</span>
        <h1>{order.orderNumber}</h1>
        <p>{formatOrderDate(order.date)}</p>
        <div className="orders-pills">
          <StatusPill status={order.orderStatus} />
          <StatusPill status={order.paymentStatus} type="payment" />
        </div>
      </header>

      {failureMessage && (
        <p className="orders-notice orders-notice--error" role="alert">{failureMessage}</p>
      )}

      <div className="orders-detail-grid">
        <section className="orders-block">
          <h2>Cliente</h2>
          <dl>
            <dt>Usuario</dt>
            <dd>
              {order.username ?? "Visitante"}
              {order.role ? ` · Rol ${order.role}` : ""}
            </dd>
            <dt>Nombre</dt>
            <dd>{client.fullName ?? "—"}</dd>
            <dt>Correo</dt>
            <dd>{client.email ?? "—"}</dd>
            <dt>Teléfono</dt>
            <dd>{client.phone ?? "—"}</dd>
            {order.company?.name && (
              <>
                <dt>Empresa</dt>
                <dd>{order.company.name}</dd>
                {order.company.taxId && (
                  <>
                    <dt>Cédula jurídica</dt>
                    <dd>{order.company.taxId}</dd>
                  </>
                )}
              </>
            )}
          </dl>
        </section>

        <section className="orders-block">
          <h2>Condiciones comerciales</h2>
          <dl>
            <dt>Sucursal</dt>
            <dd>{order.branch?.name ?? "No registrada"}</dd>
            <dt>Lista de precios</dt>
            <dd>{conditions?.priceList ?? "No registrada"}</dd>
            {conditions?.minQuantity && (
              <>
                <dt>Cantidad mínima por producto</dt>
                <dd>{conditions.minQuantity}</dd>
              </>
            )}
            {conditions?.rule && (
              <>
                <dt>Regla aplicada</dt>
                <dd>{conditions.rule}</dd>
              </>
            )}
          </dl>
        </section>

        <section className="orders-block">
          <h2>Entrega</h2>
          <dl>
            <dt>Dirección</dt>
            <dd>{addressLine || "—"}</dd>
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
          </dl>
        </section>

        <section className="orders-block">
          <h2>Pago</h2>
          <dl>
            <dt>Estado del pago</dt>
            <dd><StatusPill status={order.paymentStatus} type="payment" /></dd>
            <dt>Intentos de pago</dt>
            <dd>{order.paymentAttempts ?? 0}</dd>
            {order.transactionId && (
              <>
                <dt>Transacción</dt>
                <dd>{order.transactionId}</dd>
              </>
            )}
          </dl>
        </section>
      </div>

      <section className="orders-products" aria-label="Productos de la orden">
        <h2>Productos</h2>
        <ul>
          {products.map((product) => (
            <li key={product.productId} className="orders-product">
              {product.image_url && (
                <img src={product.image_url} alt={product.name ?? "Producto"} />
              )}
              <div className="orders-product-info">
                <strong>{product.name}</strong>
                <span>
                  {product.quantity} × {formatOrderMoney(order, product.saleUnitPrice)}
                  {product.priceList ? ` · Precio ${product.priceList}` : ""}
                  {product.originalUnitPrice > product.saleUnitPrice && (
                    <s>{formatOrderMoney(order, product.originalUnitPrice)}</s>
                  )}
                </span>
              </div>
              <strong className="orders-product-total">
                {formatOrderMoney(
                  order,
                  product.lineSubtotal ?? product.saleUnitPrice * product.quantity,
                )}
              </strong>
            </li>
          ))}
        </ul>

        <div className="orders-totals">
          <div><span>Subtotal</span><span>{formatOrderMoney(order, order.subtotal)}</span></div>
          <div><span>IVA</span><span>{formatOrderMoney(order, order.total_iva)}</span></div>
          <div>
            <span>Envío</span>
            <span>
              {Number(order.shippingCost) === 0
                ? "Gratis"
                : formatOrderMoney(order, order.shippingCost)}
            </span>
          </div>
          <div className="orders-totals-total">
            <span>Total</span>
            <strong>{formatOrderMoney(order, order.total)}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
