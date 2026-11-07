import { Eye, Search, ShoppingCart, ShoppingBag } from "lucide-react";

const METRICS = [
  {
    key: "productViews",
    label: "Visualizaciones de productos",
    description: "Incluye visitas repetidas al mismo producto.",
    Icon: Eye,
  },
  {
    key: "searches",
    label: "Búsquedas realizadas",
    description: "Búsquedas confirmadas durante la sesión.",
    Icon: Search,
  },
  {
    key: "productsAdded",
    label: "Unidades agregadas al carrito",
    description: "Acumulado de unidades agregadas, aunque luego se retiren.",
    Icon: ShoppingCart,
  },
  {
    key: "purchases",
    label: "Compras realizadas",
    description: "Órdenes con pago aprobado.",
    Icon: ShoppingBag,
  },
];

/*
 * Objetivo:
 * Presentar las métricas de navegación y compra mediante tarjetas.
 *
 * Entrada:
 * - summary: Objeto con los valores calculados para la sesión activa.
 *
 * Salida:
 * - Cuatro tarjetas con sus valores y descripciones.
 */
export default function AnalyticsSummary({ summary }) {
  return (
    <div className="analytics-summary">
      {METRICS.map(({ key, label, description, Icon }) => (
        <article className="analytics-card" key={key}>
          <div className="analytics-card-icon">
            <Icon size={24} aria-hidden="true" />
          </div>

          <h2>{label}</h2>
          <p className="analytics-card-value">
            {summary[key].toLocaleString("es-CR")}
          </p>
          <p className="analytics-card-description">{description}</p>
        </article>
      ))}
    </div>
  );
}
