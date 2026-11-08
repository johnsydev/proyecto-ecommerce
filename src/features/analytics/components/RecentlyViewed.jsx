import { useState } from "react";
import ProductCard from "../../catalog/components/ProductCard";
import { getRecentlyViewed } from "../../../utils/analyticsStorage";
import "../styles/RecentlyViewed.css";

/*
 * Objetivo:
 * Mostrar los productos vistos recientemente durante la sesión activa.
 *
 * Entrada:
 * - Historial de visualizaciones almacenado localmente.
 *
 * Salida:
 * - Sección con hasta cuatro productos distintos.
 *
 * Restricciones:
 * - Utiliza información generada por la navegación del usuario.
 * - No muestra la sección cuando el historial está vacío.
 * - Los productos se ordenan del más reciente al más antiguo.
 */
export default function RecentlyViewed() {
  const [products] = useState(() => getRecentlyViewed(4));

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="recently-viewed"
      aria-labelledby="recently-viewed-title"
    >
      <div className="recently-viewed-header">
        <h2 id="recently-viewed-title">Vistos recientemente</h2>
        <p>Vuelve a consultar los productos que te interesaron.</p>
      </div>

      <div
        className={`recently-viewed-grid${products.length < 4 ? " recently-viewed-grid--centered" : ""}`}
      >
        {products.map((product) => (
          <ProductCard key={product.id ?? product.objectID} hit={product} />
        ))}
      </div>
    </section>
  );
}
