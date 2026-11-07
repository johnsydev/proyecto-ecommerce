import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getAnalyticsSummary } from "../../../utils/analyticsStorage";
import AnalyticsSummary from "./AnalyticsSummary";
import "../styles/Analytics.css";

/*
 * Objetivo:
 * Mostrar las métricas de interacción de la sesión activa.
 *
 * Entrada:
 * - Eventos de navegación y compra almacenados localmente.
 *
 * Salida:
 * - Página con el resumen de actividad de la sesión.
 *
 * Restricciones:
 * - Las métricas corresponden únicamente a la sesión activa.
 * - Los valores se calculan a partir de eventos reales registrados.
 */
export default function Analytics() {
  const [summary, setSummary] = useState(getAnalyticsSummary);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleAnalyticsUpdate = () => {
      setSummary(getAnalyticsSummary());
    };

    window.addEventListener("analytics-updated", handleAnalyticsUpdate);

    return () => {
      window.removeEventListener("analytics-updated", handleAnalyticsUpdate);
    };
  }, []);

  return (
    <div className="analytics-page">
      <Link to="/search" className="analytics-back">
        <ArrowLeft size={18} aria-hidden="true" />
        Volver al catálogo
      </Link>

      <header className="analytics-header">
        <span className="analytics-session-label">Sesión actual</span>
        <h1>Analytics</h1>
        <p>Consulta el resumen de tu actividad en la tienda.</p>
      </header>

      <AnalyticsSummary summary={summary} />
    </div>
  );
}
