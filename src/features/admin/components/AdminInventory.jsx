import { useState } from "react";
import { Search } from "lucide-react";
import { useAdminProducts } from "../hooks/useAdminProducts";
import AdminPagination from "./AdminPagination";
import { BRANCHES, getBranchStock, getTotalBranchStock } from "../../../utils/inventory";

const PAGE_SIZE = 15;

/*
 * Objetivo:
 * Mostrar la disponibilidad de cada producto en las sucursales.
 *
 * Salida:
 * - Tabla con una columna por sucursal y el total de unidades por producto.
 * - Las sucursales sin unidades se marcan como "Sin stock".
 * - Buscador por nombre, SKU o marca, con paginación.
 *
 * Restricciones:
 * - El inventario se lee con getBranchStock, igual que en el detalle del producto.
 * - Si no se puede consultar Algolia se informa al administrador.
 */
export default function AdminInventory() {
  const { products, loading, error } = useAdminProducts();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const text = search.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const data = [product.title, product.sku, product.objectID, product.brand]
      .join(" ")
      .toLowerCase();

    return data.includes(text);
  });

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageProducts = visibleProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  if (loading) {
    return <p className="admin-loading" role="status">Cargando inventario...</p>;
  }

  if (error) {
    return (
      <p className="admin-notice admin-notice--error" role="alert">
        No pudimos cargar el inventario. Revisá tu conexión e intentá nuevamente.
      </p>
    );
  }

  if (products.length === 0) {
    return <p className="admin-empty">No hay productos registrados en el catálogo.</p>;
  }

  return (
    <div>
      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nombre, SKU o marca"
            aria-label="Buscar en el inventario"
          />
        </label>
        <span className="admin-count">
          Mostrando {visibleProducts.length} de {products.length} productos
        </span>
      </div>

      {visibleProducts.length === 0 ? (
        <p className="admin-empty">Ningún producto coincide con tu búsqueda.</p>
      ) : (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  {BRANCHES.map((branch) => (
                    <th key={branch.branch_id}>{branch.name}</th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {pageProducts.map((product) => (
                  <tr key={product.objectID}>
                    <td>
                      <strong>{product.title}</strong>
                      <small className="admin-subtext">
                        {product.objectID} · {product.sku}
                      </small>
                    </td>
                    {BRANCHES.map((branch) => {
                      const stock = getBranchStock(product, branch.branch_id);

                      return (
                        <td key={branch.branch_id}>
                          {stock > 0 ? (
                            stock
                          ) : (
                            <span className="admin-pill admin-pill--out">Sin stock</span>
                          )}
                        </td>
                      );
                    })}
                    <td><strong>{getTotalBranchStock(product)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <AdminPagination
            page={currentPage}
            totalPages={totalPages}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}