import { Link } from "react-router-dom";
import { ArrowRight, Building2, Store } from "lucide-react";
import emptyCartImage from "../../../assets/electro_carrito_vacio.png";
import { useUser } from "../../../context/useUser";
import { useUserOrders } from "../hooks/useUserOrders";
import { formatOrderDate, formatOrderMoney } from "../services/ordersService";
import StatusPill from "./StatusPill";
import "../styles/Orders.css";

/*
 * Objetivo:
 * Mostrar el historial de órdenes del usuario activo.
 *
 * Salida:
 * - Lista de órdenes con número, fecha, estados, sucursal, empresa y total.
 * - Mensaje de lista vacía si el usuario aún no tiene órdenes.
 *
 * Restricciones:
 * - Solo se muestran órdenes del usuario activo.
 * - Debe renderizarse dentro de RoleGuard con el permiso VIEW_OWN_ORDERS.
 * - Si el historial de Algolia no está disponible se avisa y se muestran las órdenes locales.
 */
export default function MyOrders() {
  const { user } = useUser();
  const { orders, loading, historyError } = useUserOrders(user?.id ?? null);

  return (
    <div className="orders-page">
      <header className="orders-heading">
        <span className="orders-eyebrow">MI CUENTA</span>
        <h1>Mis órdenes</h1>
        <p>Consulta el estado y el detalle de tus compras.</p>
      </header>

      {historyError && (
        <p className="orders-notice" role="status">
          No pudimos cargar tu historial anterior. Estás viendo solo las órdenes
          guardadas en este navegador.
        </p>
      )}

      {loading ? (
        <p className="orders-loading" role="status">Cargando tus órdenes...</p>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <img src={emptyCartImage} alt="" />
          <h2>Aún no tienes órdenes</h2>
          <p>Cuando completes una compra, la verás aquí.</p>
          <Link to="/search" className="orders-primary-link">
            Ver catálogo
          </Link>
        </div>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => {
            const units = (order.products ?? []).reduce(
              (total, product) => total + Number(product.quantity ?? 0),
              0,
            );

            return (
              <li key={order.orderNumber} className="orders-card">
                <div className="orders-card-top">
                  <div>
                    <strong className="orders-number">{order.orderNumber}</strong>
                    <span className="orders-date">{formatOrderDate(order.date)}</span>
                  </div>
                  <div className="orders-pills">
                    <StatusPill status={order.orderStatus} />
                    <StatusPill status={order.paymentStatus} type="payment" />
                  </div>
                </div>

                <div className="orders-card-info">
                  <span>
                    <Store size={15} aria-hidden="true" />
                    {order.branch?.name ?? "Sucursal no registrada"}
                  </span>
                  {order.company?.name && (
                    <span>
                      <Building2 size={15} aria-hidden="true" />
                      {order.company.name}
                    </span>
                  )}
                  <span>
                    {units} {units === 1 ? "unidad" : "unidades"}
                    {order.commercialConditions?.priceList
                      ? ` · Precio ${order.commercialConditions.priceList}`
                      : ""}
                  </span>
                </div>

                <div className="orders-card-bottom">
                  <strong className="orders-total">{formatOrderMoney(order, order.total)}</strong>
                  <Link to={`/orders/${order.orderNumber}`} className="orders-detail-link">
                    Ver detalle <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
