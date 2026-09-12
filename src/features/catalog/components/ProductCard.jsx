import "../styles/ProductCard.css";
import { ShoppingCart, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/*
 * Objetivo:
 * Mostrar la información principal de un producto dentro del catálogo,
 * incluyendo su imagen, nombre, modelo, precio, descuento y disponibilidad.
 *
 * Entrada:
 * - Recibe mediante la propiedad hit la información del producto obtenida
 *   desde Algolia.
 * - Utiliza datos como imagen, título, modelo, precios, moneda, descuento,
 *   disponibilidad y estado de venta del producto.
 *
 * Salida:
 * - Muestra una tarjeta con la información principal del producto.
 * - Muestra el precio regular o el precio con descuento cuando corresponde.
 * - Permite acceder al detalle del producto al hacer clic en la imagen o el nombre.
 * - Muestra un botón para agregar al carrito cuando el producto está disponible.
 * - Muestra un mensaje de producto agotado o no disponible cuando no se puede comprar.
 *
 * Restricciones:
 * - El objeto hit debe contener la información necesaria del producto,
 *   incluyendo objectID, title, model, image_url, currency, in_stock y b2c.
 * - Los precios y el porcentaje de descuento deben contener valores numéricos válidos.
 * - El producto solo se considera disponible si tiene existencia y además
 *   está habilitado para venta.
 * - El componente debe ejecutarse dentro de un Router para poder utilizar useNavigate.
 * - El botón "Agregar al carrito" actualmente solo se muestra visualmente
 *   y todavía no tiene una función asociada para agregar productos al carrito.
 */

export default function ProductCard({ hit }) {
  
    const [tieneDescuento, setTieneDescuento] = useState(false);
    const navigate = useNavigate();
    const isAvailable = hit.in_stock && hit.b2c.enabled;
    const notAvailableText = !hit.b2c.enabled ? "Producto no disponible" : "Producto agotado";

    useEffect(() => {
        if (hit.b2c.discount_percentage > 0) {
            setTieneDescuento(true);
        }
    }, []);

    return (
    <div className="product-card">
        <div className="product-img-container">
        <img
            src={hit.image_url}
            alt={hit.title}
            className={hit.in_stock && hit.b2c.enabled ? "product-img" : "product-img product-img-disabled"}
            onClick={() => navigate(`/producto/${hit.objectID}`)}
        />
        </div>

        <div className="product-info">
        <h3 className="product-title" onClick={() => navigate(`/producto/${hit.objectID}`)}>
            {hit.title}
        </h3>

        <p className="product-model">MOD: {hit.model}</p>

        <p className="product-price">
            {tieneDescuento && (
                <>
                    <span className="product-discount">
                        {hit.currency !== "CRC" ? "$" : "₡"}{Number(hit.b2c.sale_price).toLocaleString("en-US")}
                    </span>

                    <span className="product-regular-price-discount">
                        {hit.currency !== "CRC" ? "$" : "₡"}{Number(hit.b2c.regular_price).toLocaleString("en-US")}
                    </span>
                </>
            )}
            {!tieneDescuento && (
                <span className="product-regular-price">
                    {hit.currency !== "CRC" ? "$" : "₡"}{Number(hit.b2c.regular_price).toLocaleString("en-US")}
                </span>
            )}
        </p>

        {(isAvailable) ? (
            <button className="product-button"><ShoppingCart size={22} strokeWidth={2} /> Agregar al carrito</button>
        ) : (
            <button className="pc-without-stock"><XCircle size={22} strokeWidth={2} />{notAvailableText}</button>
        )}
        </div>
    </div>
    );
}