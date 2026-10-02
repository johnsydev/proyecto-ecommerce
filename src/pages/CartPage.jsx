import React from "react";
import ProductDetails from "../features/product-detail/components/ProductDetails";

/*
 * Objetivo:
 * Mostrar los detalles del producto en la página del carrito utilizando el componente
 *
 * Entrada:
 * - No recibe datos directamente.
 * - Utiliza el componente ProductDetails, que se encarga de obtener
 *   y mostrar la información del producto.
 *
 * Salida:
 * - Renderiza el componente ProductDetails dentro de la página.
 *
 * Restricciones:
 * - El componente ProductDetails debe estar correctamente importado.
 * - La ruta que utiliza esta página debe proporcionar el identificador
 *   del producto para que ProductDetails pueda realizar la consulta.
 */

function CartPage() {
  return <ProductDetails />;
}

export default CartPage;
