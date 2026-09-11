import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSearchBox } from "react-instantsearch";
import { Funnel, X } from "lucide-react";

import ProductGrid from "../features/catalog/components/ProductGrid";
import Pagination from "../features/catalog/components/Pagination";
import Filters from "../features/catalog/components/Filters";

import "../styles/CatalogPage.css";

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
          <Funnel size={23} strokeWidth={2.2} />
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

          <button
            className="mobile-filters-close"
            onClick={() => setFiltersOpen(false)}
            aria-label="Cerrar filtros"
          >
            <X size={21} />
          </button>
        </div>

        <div className="mobile-filters-content">
          <Filters />
        </div>
      </aside>
    </div>
  );
}

export default CatalogPage;