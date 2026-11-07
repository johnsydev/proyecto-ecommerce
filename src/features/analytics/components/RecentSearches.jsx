import { useEffect, useState } from "react";
import { useSearchBox } from "react-instantsearch";
import { Search } from "lucide-react";
import {
  ANALYTICS_EVENTS,
  getRecentSearches,
  recordEvent,
} from "../../../utils/analyticsStorage";
import "../styles/RecentSearches.css";

/*
 * Objetivo:
 * Mostrar las búsquedas recientes de la sesión activa y permitir repetirlas.
 *
 * Entrada:
 * - Historial de búsquedas almacenado localmente.
 *
 * Salida:
 * - Hasta cinco botones con búsquedas recientes sin repetir términos.
 *
 * Restricciones:
 * - Debe ejecutarse dentro de InstantSearch.
 * - No muestra la sección si no existen búsquedas.
 * - Cada búsqueda seleccionada se registra como una nueva interacción.
 */
export default function RecentSearches() {
  const [searches, setSearches] = useState(() => getRecentSearches(5));
  const { refine } = useSearchBox();

  useEffect(() => {
    const handleAnalyticsUpdate = () => {
      setSearches(getRecentSearches(5));
    };

    window.addEventListener("analytics-updated", handleAnalyticsUpdate);

    return () => {
      window.removeEventListener("analytics-updated", handleAnalyticsUpdate);
    };
  }, []);

  /*
   * Objetivo:
   * Repetir una búsqueda seleccionada desde el historial.
   *
   * Entrada:
   * - query: Texto de la búsqueda.
   *
   * Salida:
   * - Actualización del catálogo y registro del evento.
   */
  const handleSearch = (query) => {
    refine(query);

    recordEvent(ANALYTICS_EVENTS.SEARCH, {
      query,
    });
  };

  if (searches.length === 0) {
    return null;
  }

  return (
    <section
      className="recent-searches"
      aria-labelledby="recent-searches-title"
    >
      <h2 id="recent-searches-title">Búsquedas recientes</h2>

      <ul className="recent-searches-list">
        {searches.map((query) => (
          <li key={query}>
            <button
              type="button"
              className="recent-searches-button"
              onClick={() => handleSearch(query)}
            >
              <Search size={16} aria-hidden="true" />
              <span>{query}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
