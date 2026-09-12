import {
  Pagination as InstantSearchPagination,
  useInstantSearch,
} from "react-instantsearch";

import "../styles/Pagination.css";

/*
 * Objetivo:
 * Mostrar y controlar la paginación de los resultados del catálogo,
 * permitiendo al usuario moverse entre las diferentes páginas de productos.
 *
 * Entrada:
 * - Los resultados actuales de búsqueda obtenidos mediante useInstantSearch.
 * - Los clics realizados por el usuario sobre los controles de paginación.
 * - La posición del catálogo y la altura del encabezado para calcular
 *   el desplazamiento de la página.
 *
 * Salida:
 * - Muestra los controles para ir a la primera, anterior, siguiente,
 *   última o a una página específica de resultados.
 * - Desplaza suavemente la pantalla hacia la parte superior del catálogo
 *   después de cambiar de página.
 * - No muestra la paginación cuando existe una sola página de resultados
 *   o cuando los resultados todavía no son válidos para mostrarla.
 *
 * Restricciones:
 * - El componente debe utilizarse dentro de InstantSearch para acceder
 *   a los resultados de búsqueda.
 * - Debe existir un elemento con la clase "catalog-page" para realizar
 *   correctamente el desplazamiento.
 * - Si no existe un encabezado con la clase "site-header", se utiliza
 *   un valor fijo como separación para calcular el desplazamiento.
 * - Los enlaces deshabilitados no ejecutan el desplazamiento.
 * - La paginación solo se muestra cuando existen más de una página
 *   de resultados.
 */

export default function Pagination() {
  const { results } = useInstantSearch();

  const handlePaginationClick = (event) => {
    const link = event.target.closest("a");

    if (!link || link.getAttribute("aria-disabled") === "true") {
      return;
    }

    const catalog = document.querySelector(".catalog-page");

    if (!catalog) {
      return;
    }

    const header = document.querySelector(".site-header");
    const headerOffset = header ? header.offsetHeight + 12 : 92;

    const catalogTop = catalog.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: Math.max(0, catalogTop - headerOffset),
      behavior: "smooth",
    });
  };

  if (results?.__isArtificial || !results?.nbPages || results.nbPages <= 1) {
    return null;
  }

  return (
    <div className="catalog-pagination" onClick={handlePaginationClick}>
      <InstantSearchPagination
        padding={2}
        showFirst
        showLast
        translations={{
          firstPageItemText: "Primera",
          previousPageItemText: "Anterior",
          nextPageItemText: "Siguiente",
          lastPageItemText: "Última",
          pageItemText: ({ currentPage }) => `${currentPage}`,
          firstPageItemAriaLabel: "Ir a la primera página",
          previousPageItemAriaLabel: "Ir a la página anterior",
          nextPageItemAriaLabel: "Ir a la página siguiente",
          lastPageItemAriaLabel: "Ir a la última página",
          pageItemAriaLabel: ({ currentPage }) =>
            `Ir a la página ${currentPage}`,
        }}
      />
    </div>
  );
}
