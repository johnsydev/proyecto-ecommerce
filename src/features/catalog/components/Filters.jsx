import { RefinementList, ClearRefinements } from "react-instantsearch";
import PriceSlider from "./PriceSlider"; 
import { Funnel } from "lucide-react"; 
import "../styles/Filters.css";

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