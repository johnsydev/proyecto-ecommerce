/*
 * Objetivo:
 * Mostrar los botones para recorrer las páginas de una tabla.
 *
 * Entrada:
 * - page: Página actual (desde 1).
 * - totalPages: Cantidad total de páginas.
 * - onChange: Función que recibe la página elegida.
 *
 * Restricciones:
 * - No se muestra si solo existe una página.
 */
export default function AdminPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="admin-pagination" aria-label="Paginación de la tabla">
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>
        Anterior
      </button>
      <span>
        Página {page} de {totalPages}
      </span>
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Siguiente
      </button>
    </nav>
  );
}