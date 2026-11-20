/*
 * Objetivo:
 * Mostrar las pestañas del panel administrativo y avisar cuál se selecciona.
 *
 * Entrada:
 * - tabs: Lista de pestañas { id, label, icon }.
 * - activeTab: Identificador de la pestaña activa.
 * - onChange: Función que recibe el identificador de la pestaña elegida.
 *
 * Salida:
 * - Barra de pestañas con la pestaña activa resaltada.
 *
 * Restricciones:
 * - Solo se resalta la pestaña recibida en activeTab.
 */
export default function AdminTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="admin-tabs" role="tablist" aria-label="Secciones del panel">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`admin-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls="admin-panel"
            className={isActive ? "admin-tab admin-tab--active" : "admin-tab"}
            onClick={() => onChange(tab.id)}
          >
            <Icon size={17} aria-hidden="true" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}