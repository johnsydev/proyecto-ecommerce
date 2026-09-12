import { RefinementList, ClearRefinements } from "react-instantsearch";
import PriceSlider from "./PriceSlider"; 
import { Funnel } from "lucide-react"; 
import "../styles/Filters.css";

/*
 * Objetivo:
 * Mostrar los filtros disponibles para que el usuario pueda limitar
 * los productos mostrados en el catálogo según categoría, marca y precio.
 *
 * Entrada:
 * - Los atributos "categories" y "brand" provenientes de los productos
 *   indexados en Algolia.
 * - El atributo "b2c.sale_price" utilizado para filtrar por precio.
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
 * - Los atributos "categories", "brand" y "b2c.sale_price" deben existir
 *   en los productos indexados.
 * - Los atributos utilizados como filtros deben estar configurados correctamente
 *   en Algolia para permitir refinamientos.
 * - El componente PriceSlider debe existir y recibir un atributo numérico válido.
 */

export default function Filters() {
    return (
        <div className="filters-container">
           
            <div className="filters-header">
                <h2 className="filters-title">
                    <Funnel size={20} strokeWidth={2.5} className="filters-icon" />
                    Filtros
                </h2>
                <ClearRefinements 
                    translations={{
                        resetButtonText: 'Limpiar',
                    }}
                    classNames={{
                        button: 'clear-filters-button',
                        disabledButton: 'clear-filters-button--disabled'
                    }}
                />
            </div>

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
              
                <PriceSlider attribute="b2c.sale_price" />
            </div>

        </div>
    );
}