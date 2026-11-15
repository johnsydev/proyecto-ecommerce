import RoleGuard from "../components/RoleGuard";
import { PERMISSIONS } from "../utils/permissions";
import "../styles/AdminPage.css";

/*
 * Objetivo:
 * Mostrar el panel administrativo, disponible únicamente para el rol ADMIN.
 *
 * Restricciones:
 * - El acceso se controla con RoleGuard y el permiso VIEW_ADMIN_INFO.
 * - Las secciones de órdenes, productos e inventario se agregan en las
 *   siguientes fases del proyecto.
 */
export default function AdminPage() {
  return (
    <RoleGuard permission={PERMISSIONS.VIEW_ADMIN_INFO}>
      <section className="admin-page">
        <h1>Panel administrativo</h1>
        <p>Consulta de órdenes, productos e inventario por sucursal.</p>
      </section>
    </RoleGuard>
  );
}
