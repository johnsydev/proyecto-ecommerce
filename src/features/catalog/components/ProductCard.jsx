import "../styles/ProductCard.css";
import { ShoppingCart, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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