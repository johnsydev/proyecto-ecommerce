import { useSearchParams } from "react-router-dom";
import { ClipboardList, Package, Store } from "lucide-react";
import RoleGuard from "../components/RoleGuard";
import AdminTabs from "../features/admin/components/AdminTabs";
import { useUser } from "../context/useUser";
import { PERMISSIONS } from "../utils/permissions";
import "../styles/AdminPage.css";
import "../features/admin/styles/Admin.css";

const TABS = [
  { id: "orders", label: "Órdenes", icon: ClipboardList },
  { id: "products", label: "Productos", icon: Package },
  { id: "inventory", label: "Inventario por sucursal", icon: Store },
];

/*
 * Objetivo:
 * Mostrar el panel administrativo, disponible únicamente para el rol ADMIN.
 *
 * Salida:
 * - Encabezado con el usuario activo y pestañas de órdenes, productos e
 *   inventario por sucursal.
 *
 * Restricciones:
 * - El acceso se controla con RoleGuard y el permiso VIEW_ADMIN_INFO.
 * - La pestaña activa se guarda en la URL (?tab=...). Si el valor no
 *   corresponde a una pestaña existente se muestra la de órdenes.
 */
export default function AdminPage() {
  const { user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedTab = searchParams.get("tab");
  const activeTab = TABS.some((tab) => tab.id === requestedTab)
    ? requestedTab
    : "orders";

  return (
    <RoleGuard permission={PERMISSIONS.VIEW_ADMIN_INFO}>
      <section className="admin-page">
        <header className="admin-heading">
          <span className="admin-eyebrow">ADMINISTRACIÓN</span>
          <h1>Panel administrativo</h1>
          <p>Consulta de órdenes, productos e inventario por sucursal.</p>
          <p className="admin-session">
            Sesión: {user?.name} · Administrador
          </p>
        </header>

        <AdminTabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={(id) => setSearchParams({ tab: id })}
        />

        <div
          id="admin-panel"
          role="tabpanel"
          aria-labelledby={`admin-tab-${activeTab}`}
        >
          <p className="admin-empty">Esta sección se completa en los siguientes commits.</p>
        </div>
      </section>
    </RoleGuard>
  );
}