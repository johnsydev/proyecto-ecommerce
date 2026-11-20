import { useState } from "react";
import { Pencil, RotateCcw, Search } from "lucide-react";
import { useAdminProducts } from "../hooks/useAdminProducts";
import { useStockOverrides } from "../hooks/useStockOverrides";
import AdminPagination from "./AdminPagination";
import StockEditForm from "./StockEditForm";
import { BRANCHES, getBranchStock, getTotalBranchStock } from "../../../utils/inventory";

const PAGE_SIZE = 15;

/* Unidades que trae Algolia para una sucursal, sin los cambios del administrador. */
function getOriginalStock(product, branchId) {
  const branch = product.branches?.find((item) => item.branch_id === branchId);

  return Math.max(0, Number(branch?.stock_quantity) || 0);
}

/*
 * Objetivo:
 * Mostrar la disponibilidad de cada producto en las sucursales y permitir
 * modificarla de forma simulada.
 *
 * Salida:
 * - Tabla con una columna por sucursal y el total de unidades por producto.
 * - Las sucursales sin unidades se marcan como "Sin stock".
 * - Buscador por nombre, SKU o marca, con paginación.
 * - Operación simulada: modificar las unidades de un producto en una sucursal.
 *   La celda modificada muestra el valor anterior ("Antes").
 * - Botón para restablecer el inventario original.
 *
 * Restricciones:
 * - Los cambios se guardan en localStorage y se reflejan en el catálogo, el
 *   detalle, el carrito y el checkout; no modifican Algolia.
 * - El inventario se lee con getBranchStock, igual que en el resto de la tienda.
 * - Si no se puede consultar Algolia se informa al administrador.
 */
export default function AdminInventory() {
  const { products, loading, error } = useAdminProducts();
  const { overrides, saveOverride, resetOverrides } = useStockOverrides();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [confirmingReset, setConfirmingReset] = useState(false);

  const modifiedCount = Object.values(overrides).reduce(
    (total, branches) => total + Object.keys(branches ?? {}).length,
    0,
  );

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

  const handleReset = () => {
    

    setConfirmingReset(false);
    try {
      resetOverrides();
      setEditingId(null);
      setResetError("");
      setMessage("Inventario restablecido a los valores originales.");
    } catch (resetFailure) {
      setResetError(resetFailure.message);
    }
  };

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
      

      {message && (
        <p className="admin-notice admin-notice--success" role="status">
          {message}
        </p>
      )}

      {resetError && (
        <p className="admin-notice admin-notice--error" role="alert">
          {resetError}
        </p>
      )}

      {confirmingReset && (
        <div className="admin-notice admin-confirm" role="alert">
          <span>
            ¿Restablecer el inventario original? Se eliminarán todos los cambios
            hechos desde este panel.
          </span>
          <div className="admin-confirm-actions">
            <button type="button" className="admin-btn admin-btn--primary" onClick={handleReset}>
              Sí, restablecer
            </button>
            <button type="button" className="admin-btn" onClick={() => setConfirmingReset(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

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
        {modifiedCount > 0 && !confirmingReset && (
          <button
            type="button"
            className="admin-btn"
            onClick={() => {
              setConfirmingReset(true);
              setMessage("");
            }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Restablecer inventario original ({modifiedCount})
          </button>
        )}
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
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {pageProducts.map((product) => [
                  <tr key={product.objectID}>
                    <td>
                      <strong>{product.title}</strong>
                      <small className="admin-subtext">
                        {product.objectID} · {product.sku}
                      </small>
                    </td>
                    {BRANCHES.map((branch) => {
                      const stock = getBranchStock(product, branch.branch_id);
                      const original = getOriginalStock(product, branch.branch_id);

                      return (
                        <td key={branch.branch_id}>
                          {stock > 0 ? (
                            stock
                          ) : (
                            <span className="admin-pill admin-pill--out">Sin stock</span>
                          )}
                          {stock !== original && (
                            <small className="admin-changed">Antes: {original}</small>
                          )}
                        </td>
                      );
                    })}
                    <td><strong>{getTotalBranchStock(product)}</strong></td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn--small"
                        onClick={() => {
                          setEditingId(product.objectID);
                          setMessage("");
                          setResetError("");
                          setConfirmingReset(false);
                        }}
                      >
                        <Pencil size={14} aria-hidden="true" />
                        Editar stock
                      </button>
                    </td>
                  </tr>,
                  editingId === product.objectID && (
                    <tr key={`${product.objectID}-edit`} className="admin-edit-row">
                      <td colSpan={BRANCHES.length + 3}>
                        <StockEditForm
                          product={product}
                          saveOverride={saveOverride}
                          onSaved={(savedMessage) => {
                            setMessage(savedMessage);
                            setEditingId(null);
                          }}
                          onCancel={() => setEditingId(null)}
                        />
                      </td>
                    </tr>
                  ),
                ])}
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