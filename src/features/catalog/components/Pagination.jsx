import {
  Pagination as InstantSearchPagination,
  useInstantSearch,
} from "react-instantsearch";

import "../styles/Pagination.css";

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
