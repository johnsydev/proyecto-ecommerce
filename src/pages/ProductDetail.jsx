import React from 'react';
import ProductDetails from '../features/product-detail/components/ProductDetails';

/*
 * Objetivo:
 * Mostrar la vista de detalle de un producto utilizando el componente
 * ProductDetails.
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

function ProductDetail() {
    return (
        <ProductDetails /> 
    );
}

export default ProductDetail;