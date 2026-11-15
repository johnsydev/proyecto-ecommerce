import RoleGuard from "../components/RoleGuard";
import MyOrders from "../features/orders/components/MyOrders";
import { PERMISSIONS } from "../utils/permissions";

/*
 * Objetivo:
 * Mostrar el historial de órdenes propias, disponible solo para clientes B2C y B2B.
 */
export default function OrdersPage() {
  return (
    <RoleGuard permission={PERMISSIONS.VIEW_OWN_ORDERS}>
      <MyOrders />
    </RoleGuard>
  );
}
