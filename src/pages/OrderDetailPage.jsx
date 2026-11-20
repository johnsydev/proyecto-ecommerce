import RoleGuard from "../components/RoleGuard";
import OrderDetail from "../features/orders/components/OrderDetail";
import { PERMISSIONS } from "../utils/permissions";

/*
 * Objetivo:
 * Mostrar el detalle de una orden propia, disponible solo para clientes B2C y B2B.
 */
export default function OrderDetailPage() {
  return (
    <RoleGuard permission={PERMISSIONS.VIEW_OWN_ORDERS}>
      <OrderDetail />
    </RoleGuard>
  );
}
