import { Hits, useInstantSearch } from "react-instantsearch";
import ProductCard from "./ProductCard";
import "../styles/ProductGrid.css";
import noResultsImage from "../../../assets/electroTriste.png";

/*
 * Objetivo:
 * Mostrar la lista de productos obtenidos desde Algolia y presentar
 * un mensaje alternativo cuando la búsqueda no devuelve resultados.
 *
 * Entrada:
 * - Los resultados y el estado de búsqueda obtenidos mediante useInstantSearch.
 * - El componente ProductCard utilizado para mostrar cada producto.
 * - La imagen electroTriste.png utilizada cuando no existen resultados.
 *
 * Salida:
 * - Muestra una cuadrícula con las tarjetas de los productos encontrados.
 * - Muestra el mensaje "No se encontraron productos" junto con una imagen
 *   cuando la búsqueda no devuelve ningún resultado.
 *
 * Restricciones:
 * - El componente debe utilizarse dentro de InstantSearch para acceder
 *   a los resultados de Algolia.
 * - El componente ProductCard debe estar correctamente importado.
 * - La imagen electroTriste.png debe existir en la ruta indicada.
 * - La información obtenida desde Algolia debe tener una estructura compatible
 *   con el componente ProductCard.
 * - El estado de carga se obtiene y se almacena en la variable "cargando",
 *   pero actualmente no se utiliza para mostrar un indicador de carga.
 */

export default function ProductGrid() {
  const { results, status } = useInstantSearch();
  const cargando = status === "loading" || status === "stalled";

  return (
    <div className="product-grid">
      {!results?.__isArtificial && results?.nbHits === 0 ? (
        <>
          <p className="no-results-found">No se encontraron productos.</p>
          <img
            className="no-results-image"
            src={noResultsImage}
            alt="No results"
          />
        </>
      ) : (
        <Hits hitComponent={(props) => <ProductCard {...props} />} />
      )}
    </div>
  );
}
