import { useState } from "react";
import { Search } from "lucide-react";
import { useAdminOrders } from "../hooks/useAdminOrders";
import { formatOrderDate, formatOrderMoney } from "../../orders/services/ordersService";
import StatusPill from "../../orders/components/StatusPill";
import "../../orders/styles/Orders.css";

/*
 * Objetivo:
 * Mostrar todas las órdenes generadas en la tienda para el administrador.
 *
 * Salida:
 * - Tabla con número de orden, fecha, cliente, tipo de cliente, empresa,
 *   total, sucursal, estado de la orden y estado del pago.
 * - Buscador por número de orden, cliente, usuario o empresa.
 *
 * Restricciones:
 * - Debe renderizarse dentro de RoleGuard con el permiso VIEW_ALL_ORDERS.
 * - Si el historial de Algolia no está disponible se avisa y se muestran
 *   únicamente las órdenes guardadas en este navegador.
 * - Los datos que falten en una orden se muestran como "—".
 */
export default function AdminOrders() {
  const { orders, loading, historyError } = useAdminOrders();
  const [search, setSearch] = useState("");

  const text = search.trim().toLowerCase();
  const visibleOrders = orders.filter((order) => {
    const data = [
      order.orderNumber,
      order.client?.fullName,
      order.username,
      order.company?.name,
    ]
      .join(" ")
      .toLowerCase();

    return data.includes(text);
  });

  if (loading) {
    return <p className="admin-loading" role="status">Cargando órdenes...</p>;
  }

  return (
    <div>
      {historyError && (
        <p className="admin-notice" role="status">
          No pudimos cargar el historial de órdenes desde Algolia. Estás viendo
          solo las órdenes guardadas en este navegador.
        </p>
      )}

      {orders.length === 0 ? (
        <p className="admin-empty">Todavía no hay órdenes registradas.</p>
      ) : (
        <>
          <div className="admin-toolbar">
            <label className="admin-search">
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por orden, cliente o empresa"
                aria-label="Buscar órdenes"
              />
            </label>
            <span className="admin-count">
              Mostrando {visibleOrders.length} de {orders.length} órdenes
            </span>
          </div>

          {visibleOrders.length === 0 ? (
            <p className="admin-empty">Ninguna orden coincide con tu búsqueda.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Orden</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th>Empresa</th>
                    <th>Total</th>
                    <th>Sucursal</th>
                    <th>Estado</th>
                    <th>Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleOrders.map((order) => (
                    <tr key={order.orderNumber}>
                      <td><strong>{order.orderNumber}</strong></td>
                      <td>{formatOrderDate(order.date)}</td>
                      <td>{order.client?.fullName ?? order.username ?? "—"}</td>
                      <td>
                        {order.commercialConditions?.customerType ?? order.role ?? "—"}
                      </td>
                      <td>{order.company?.name ?? "—"}</td>
                      <td><strong>{formatOrderMoney(order, order.total)}</strong></td>
                      <td>{order.branch?.name ?? "No registrada"}</td>
                      <td><StatusPill status={order.orderStatus} /></td>
                      <td><StatusPill status={order.paymentStatus} type="payment" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}