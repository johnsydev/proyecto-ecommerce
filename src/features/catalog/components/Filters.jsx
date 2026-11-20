import { RefinementList, ClearRefinements } from "react-instantsearch";
import PriceSlider from "./PriceSlider";
import { Funnel } from "lucide-react";
import { useUser } from "../../../context/useUser";
import { getPriceList, PRICE_LISTS } from "../../../utils/pricing";
import "../styles/Filters.css";

/*
 * Objetivo:
 * Mostrar los filtros disponibles para que el usuario pueda limitar
 * los productos mostrados en el catálogo según categoría, marca y precio.
 *
 * Entrada:
 * - Los atributos "categories" y "brand" provenientes de los productos
 *   indexados en Algolia.
 * - El atributo de precio de la lista del usuario: "b2c.sale_price" para
 *   B2C y visitantes, o "b2b.price" para clientes B2B.
 * - El componente PriceSlider para seleccionar un rango de precios.
 *
 * Salida:
 * - Muestra una lista de categorías disponibles para filtrar.
 * - Muestra una lista de marcas disponibles para filtrar.
 * - Muestra un control para filtrar productos según su precio.
 * - Permite limpiar todos los filtros aplicados mediante el botón "Limpiar".
 *
 * Restricciones:
 * - El componente debe utilizarse dentro de InstantSearch para que los filtros
 *   puedan comunicarse con Algolia.
 * - Los atributos "categories", "brand" y el atributo de precio deben existir
 *   en los productos indexados.
 * - Los atributos utilizados como filtros deben estar configurados correctamente
 *   en Algolia para permitir refinamientos.
 * - El componente PriceSlider debe existir y recibir un atributo numérico válido.
 */

export default function Filters({ showHeader = true }) {
  const { user } = useUser();
  const priceAttribute =
    getPriceList(user) === PRICE_LISTS.B2B ? "b2b.price" : "b2c.sale_price";

  return (
    <div className="filters-container">
      {showHeader && (
        <div className="filters-header">
          <h2 className="filters-title">
            <Funnel size={20} strokeWidth={2.5} className="filters-icon" />
            Filtros
          </h2>

          <ClearRefinements
            translations={{
              resetButtonText: "Limpiar",
            }}
            classNames={{
              button: "clear-filters-button",
              disabledButton: "clear-filters-button--disabled",
            }}
          />
        </div>
      )}

      <div className="filter-section">
        <h3 className="filter-subtitle">Categoría</h3>

        <RefinementList
          attribute="categories"
          searchable={true}
          searchablePlaceholder="Buscar categoría..."
          limit={50}
        />
      </div>

      <div className="filter-section">
        <h3 className="filter-subtitle">Marca</h3>

        <RefinementList
          attribute="brand"
          searchable={true}
          searchablePlaceholder="Buscar marca..."
          limit={50}
        />
      </div>

      <div className="filter-section">
        <h3 className="filter-subtitle">Precio (₡)</h3>

        <PriceSlider attribute={priceAttribute} />
      </div>
    </div>
  );
}
