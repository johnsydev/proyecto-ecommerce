import { useState } from "react";
import { Search } from "lucide-react";
import { useAdminProducts } from "../hooks/useAdminProducts";
import AdminPagination from "./AdminPagination";
import { formatOrderMoney } from "../../orders/services/ordersService";
import { getTotalBranchStock } from "../../../utils/inventory";
import { ROLES } from "../../../utils/permissions";
import { getMinQuantity, getPriceInfo } from "../../../utils/pricing";

const PAGE_SIZE = 15;
const B2B_USER = { role: ROLES.B2B };

/*
 * Objetivo:
 * Mostrar el precio de un producto para una lista de precios.
 *
 * Restricciones:
 * - Si la información comercial es inválida se muestra "Precio inválido".
 */
function PriceValue({ product, user, showRegular }) {
  const info = getPriceInfo(product, user);

  if (!info.isValid) {
    return <span className="admin-invalid">Precio inválido</span>;
  }

  return (
    <>
      <strong>{formatOrderMoney(product, info.unitPrice)}</strong>
      {showRegular && info.hasDiscount && (
        <small className="admin-subtext">
          <s>{formatOrderMoney(product, info.regularPrice)}</s>
        </small>
      )}
    </>
  );
}

/*
 * Objetivo:
 * Mostrar la información comercial de los productos para el administrador.
 *
 * Salida:
 * - Tabla con producto, categoría, precio B2C, precio B2B, cantidad mínima
 *   B2B, stock total y disponibilidad.
 * - Buscador por nombre, SKU o marca, con paginación.
 *
 * Restricciones:
 * - Los precios se calculan con getPriceInfo, igual que en el catálogo.
 * - Si no se puede consultar Algolia se informa al administrador.
 */
export default function AdminProducts() {
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
    return <p className="admin-loading" role="status">Cargando productos...</p>;
  }

  if (error) {
    return (
      <p className="admin-notice admin-notice--error" role="alert">
        No pudimos cargar los productos. Revisá tu conexión e intentá nuevamente.
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
            aria-label="Buscar productos"
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
                  <th>Categoría</th>
                  <th>Precio B2C</th>
                  <th>Precio B2B</th>
                  <th>Mín. B2B</th>
                  <th>Stock total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pageProducts.map((product) => {
                  const totalStock = getTotalBranchStock(product);

                  return (
                    <tr key={product.objectID}>
                      <td>
                        <div className="admin-product">
                          <img src={product.image_url} alt="" loading="lazy" />
                          <div>
                            <strong>{product.title}</strong>
                            <small className="admin-subtext">
                              {product.objectID} · {product.sku}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>{product.category ?? "—"}</td>
                      <td>
                        <PriceValue product={product} user={null} showRegular />
                      </td>
                      <td>
                        <PriceValue product={product} user={B2B_USER} />
                      </td>
                      <td>{getMinQuantity(product, B2B_USER)}</td>
                      <td>{totalStock}</td>
                      <td>
                        <span
                          className={
                            totalStock > 0
                              ? "admin-pill admin-pill--ok"
                              : "admin-pill admin-pill--out"
                          }
                        >
                          {totalStock > 0 ? "Disponible" : "Sin stock"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
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