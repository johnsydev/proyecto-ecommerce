import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSearchBox, ClearRefinements } from "react-instantsearch";
import { Funnel, X } from "lucide-react";

import ProductGrid from "../features/catalog/components/ProductGrid";
import Pagination from "../features/catalog/components/Pagination";
import Filters from "../features/catalog/components/Filters";

import "../styles/CatalogPage.css";

/*
 * Objetivo:
 * Mostrar la página principal del catálogo, incluyendo los productos,
 * la paginación y los filtros disponibles tanto en escritorio como en dispositivos móviles.
 *
 * Entrada:
 * - Una categoría opcional recibida desde el estado de navegación.
 * - Los resultados de búsqueda y filtros manejados por InstantSearch.
 * - La interacción del usuario para abrir o cerrar el panel de filtros en móviles.
 *
 * Salida:
 * - Muestra la lista de productos mediante ProductGrid.
 * - Muestra la paginación mediante Pagination.
 * - Muestra los filtros del catálogo mediante Filters.
 * - Aplica automáticamente una categoría recibida desde otra parte de la aplicación.
 * - Permite abrir y cerrar un panel lateral de filtros en pantallas pequeñas.
 * - Bloquea el desplazamiento de la página mientras el panel móvil de filtros está abierto.
 *
 * Restricciones:
 * - El componente debe ejecutarse dentro de un Router para poder utilizar useLocation.
 * - Debe utilizarse dentro de InstantSearch para poder utilizar useSearchBox.
 * - Los componentes ProductGrid, Pagination y Filters deben estar correctamente importados.
 * - Si no se recibe una categoría, la búsqueda se restablece utilizando una cadena vacía.
 * - El bloqueo del desplazamiento modifica temporalmente el estilo overflow del body
 *   y debe restaurarse cuando se cierran los filtros o se desmonta el componente.
 * - La versión móvil de los filtros depende de las clases definidas en CatalogPage.css.
 */

function CatalogPage() {
  const location = useLocation();
  const category = location.state?.category;

  const { refine } = useSearchBox();

  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    refine(category ?? "");
  }, [category, refine]);

  useEffect(() => {
    if (filtersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [filtersOpen]);

  return (
    <div className="catalog-page">
      <aside className="panel-izq">
        <Filters />
      </aside>

      <main className="panel-der">
        <ProductGrid />
        <Pagination />
      </main>

      {!filtersOpen && (
        <button
          className="filters-floating-btn"
          onClick={() => setFiltersOpen(true)}
          aria-label="Abrir filtros"
          aria-expanded={filtersOpen}
        >
          <Funnel size={28} strokeWidth={2.2} />
        </button>
      )}

      {filtersOpen && (
        <div
          className="filters-overlay"
          onClick={() => setFiltersOpen(false)}
        />
      )}

      <aside className={`mobile-filters ${filtersOpen ? "open" : ""}`}>
        <div className="mobile-filters-header">
          <div className="mobile-filters-title">
            <Funnel size={20} strokeWidth={2.2} />
            <span>Filtros</span>
          </div>

          <div className="mobile-filters-actions">
            <ClearRefinements
              translations={{
                resetButtonText: "Limpiar",
              }}
              classNames={{
                button: "mobile-clear-filters",
                disabledButton:
                  "mobile-clear-filters mobile-clear-filters--disabled",
              }}
            />

            <button
              className="mobile-filters-close"
              onClick={() => setFiltersOpen(false)}
              aria-label="Cerrar filtros"
            >
              <X size={21} />
            </button>
          </div>
        </div>

        <div className="mobile-filters-content">
          <Filters showHeader={false} />
        </div>
      </aside>
    </div>
  );
}

export default CatalogPage;
