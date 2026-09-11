import "../styles/ProductInfo.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ShieldCheck, Truck, BadgePercent, Clock8 } from "lucide-react";
import translations from "../../../locales/es.json";
import Rating from "./Rating";
import StoresStock from "./StoresStock";

export default function ProductInfo({ product }) {
    const [cantidadCarrito, setCantidadCarrito] = useState(1);

    const navigate = useNavigate();

    const tieneDescuento = product?.b2c?.discount_percentage > 0;

    const currency = product?.currency != "CRC" ? "$" : "₡";

    return (
    <div className="pi-page">
        {product ? (
            <>
                <span className="pi-route-product">
                    {product?.categories?.map((category, index) => (
                        <span key={category}>
                            <span
                                className="pi-category-link"
                                onClick={() =>
                                    navigate("/search", { state: { category } })
                                }
                            >
                                {category}
                            </span>
                            {index < product.categories.length - 1 && " > "}
                        </span>
                    ))}
                </span>
                <div className="pi-product-detail-grid">

                    <div className="pi-izq">
                        <img className="pi-product-image" src={product.image_url} alt={product.title} />
                    </div>

                    <div className="pi-der">

                        <p className="pi-product-mod">MOD: {product.model}</p>

                        <p className="pi-product-title">{product.title}</p>

                        <Rating rating={product.rating} />

                        <div className="pi-product-badges">
                            <span className="pi-product-warranty pi-product-badge"><ShieldCheck /> Garantía de {product.b2c.warranty_months} meses</span>
                            <span className="pi-product-estimated-delivery pi-product-badge"><Clock8 /> Tiempo de entrega estimado de {product.b2c.estimated_delivery_days} días</span>
                        </div>

                        <div className="pi-product-info-container-details">
                            <h3>Características del producto:</h3>
                            <ul className="pi-product-details">
                                <li><span className="pi-bold">Categoría:</span> {product.category}</li>
                                <li><span className="pi-bold">Marca:</span> {product.brand}</li>
                                <li><span className="pi-bold">Modelo:</span> {product.model}</li>
                                {Object.entries(product.facets).map(([name, value]) => (
                                    <li key={name}>
                                        <span className="pi-bold">{translations.facets[name]}:</span> {value}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="pi-container-prices">
                            {tieneDescuento ? (
                                <>
                                    <span className="pi-product-price">{currency}{Number(product.b2c.sale_price).toLocaleString("en-US")}</span>
                                    <span className="pi-product-regular-price-discount">{currency}{Number(product.b2c.regular_price).toLocaleString("en-US")}</span>


                                    <span className="pi-product-discount-badge"><BadgePercent /> ¡{product.b2c.discount_percentage}% de descuento!</span>
                                    {product.b2c.free_shipping && <span className="pi-product-discount-badge"><Truck />¡Envío gratis!</span>}
                                </>
                            ) : (
                                <>
                                    <span className="pi-product-price">{currency}{Number(product.b2c.sale_price).toLocaleString("en-US")}</span>
                                    {product.b2c.free_shipping && <span className="pi-product-discount-badge"><Truck />¡Envío gratis!</span>}
                                </>
                            )}
                        </div>
                        
                        {(product.in_stock && product.b2c.enabled) ? (
                            <div className="pi-shipping-container">
                                <div className="pi-shipping-quantity-container">
                                    <button className="pi-shipping-button-del" onClick={() => setCantidadCarrito(cantidadCarrito - 1)} disabled={cantidadCarrito === 1}>-</button>
                                    <span className="pi-shipping-quantity">{cantidadCarrito}</span>
                                    <button className="pi-shipping-button-add" onClick={() => setCantidadCarrito(cantidadCarrito + 1)} disabled={cantidadCarrito >= product.stock_quantity}>+</button>
                                </div>

                                <button className="pi-add-to-cart"><ShoppingCart /> Agregar al carrito</button>
                            </div>
                        ) : (
                            <div className="pi-shipping-container">
                                <span className="pi-without-stock">Producto {!product.b2c.enabled ? "no disponible" : "agotado"}</span>
                            </div>
                        )}
                        
                    </div>

                    


                </div>

                <div className="pi-product-info-container-description">
                    <h3 className="pi-subtitle">Descripción del producto:</h3>
                    <p className="pi-product-description">{product.description}</p>
                </div> 

                <StoresStock branches={product.branches} />

            </>

            
        ) : (
            <p>No se encontraron detalles del producto.</p>
        )}
    </div>
    );
}