import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductInfo from "./ProductInfo";
import searchClient from "../../catalog/services/algolia";

/*
 * Objetivo:
 * Obtener desde Algolia la información completa de un producto específico
 * y enviarla al componente encargado de mostrar sus detalles.
 *
 * Entrada:
 * - El identificador del producto obtenido desde la URL mediante useParams.
 * - El nombre del índice de Algolia definido en VITE_ALGOLIA_INDEX_NAME.
 * - El cliente de Algolia utilizado para consultar el producto.
 *
 * Salida:
 * - Guarda en el estado la información del producto encontrado.
 * - Envía el producto al componente ProductInfo para mostrar sus detalles.
 * - Muestra un mensaje de error si no se puede obtener el producto.
 *
 * Restricciones:
 * - El componente debe ejecutarse dentro de un Router para poder utilizar useParams.
 * - El identificador recibido en la URL debe corresponder a un objectID válido en Algolia.
 * - La variable VITE_ALGOLIA_INDEX_NAME debe estar definida correctamente.
 * - El cliente de Algolia debe estar configurado y tener acceso al índice.
 * - Se necesita conexión a Internet para consultar la información del producto.
 */

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    searchClient
      .getObject({
        indexName: import.meta.env.VITE_ALGOLIA_INDEX_NAME,
        objectID: id,
      })
      .then((product) => {
        setProduct(product);
      })
      .catch((error) => {
        console.error("Error al obtener los detalles del producto:", error);
        setProduct(null);
      });
  }, [id]);

  if (!product) {
    return null;
  }

  return <ProductInfo product={product} />;
}
