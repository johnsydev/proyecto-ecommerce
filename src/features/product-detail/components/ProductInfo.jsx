import "../styles/ProductInfo.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ShieldCheck,
  Truck,
  BadgePercent,
  Clock8,
  XCircle
} from "lucide-react";
import { useCart } from "../../../context/CartContext";
import translations from "../../../locales/es.json";
import Rating from "./Rating";
import StoresStock from "./StoresStock";

/*
 * Objetivo:
 * Mostrar toda la información detallada de un producto, incluyendo categorías,
 * imagen, características, precio, descuento, disponibilidad, cantidad a comprar,
 * descripción y existencias por sucursal.
 *
 * Entrada:
 * - Recibe mediante la propiedad product el objeto con la información completa
 *   del producto.
 * - Utiliza datos como categorías, imagen, modelo, marca, precio, descuento,
 *   garantía, tiempo de entrega, características, disponibilidad y stock.
 * - Utiliza el archivo de traducciones para mostrar los nombres de las
 *   características del producto.
 *
 * Salida:
 * - Muestra la información completa del producto seleccionado.
 * - Permite navegar al catálogo utilizando una categoría del producto.
 * - Muestra la calificación mediante el componente Rating.
 * - Muestra el precio normal o el precio con descuento cuando corresponde.
 * - Indica si el producto tiene envío gratis.
 * - Permite aumentar o disminuir la cantidad que se desea comprar.
 * - Muestra si el producto está agotado o no disponible.
 * - Muestra la descripción y las existencias por sucursal mediante StoresStock.
 *
 * Restricciones:
 * - El objeto product debe contener la información necesaria para mostrar
 *   correctamente los detalles del producto.
 * - El componente debe ejecutarse dentro de un Router para utilizar useNavigate.
 * - La cantidad seleccionada no puede ser menor que 1.
 * - La cantidad seleccionada no puede superar el stock disponible del producto.
 * - El producto solo permite seleccionar cantidad si tiene existencias y está
 *   habilitado para la venta.
 * - El objeto facets debe contener datos válidos y sus nombres deben existir
 *   en el archivo de traducciones.
 * - Los componentes Rating y StoresStock deben estar correctamente importados.
 * - Mientras product no tenga información, se muestra un mensaje indicando
 *   que no se encontraron detalles del producto.
 * - El botón "Agregar al carrito" actualmente es visual y todavía no tiene
 *   una función asociada para guardar el producto en un carrito.
 */

export default function ProductInfo({ product }) {
  const [cantidadCarrito, setCantidadCarrito] = useState(1);
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  const tieneDescuento = product?.b2c?.discount_percentage > 0;
  const currency = product?.currency !== "CRC" ? "$" : "₡";

  // Identificador único
  const productId = product?.objectID || product?.id;

  // Stock total disponible
  const stockTotal = product?.stock_quantity ?? (product?.in_stock ? 999 : 0);

  // Buscar cuántas unidades de este producto ya están en el carrito
  const productoEnCarrito = cart.find(
    (item) => (item.id ?? item.objectID) === productId
  );
  const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.order_quantity : 0;

  // Unidades restantes que se pueden agregar
  const stockDisponibleParaAgregar = stockTotal - cantidadEnCarrito;

  const handleAddToCart = () => {
    if (!product || stockDisponibleParaAgregar <= 0) return;

    const precioFinal = tieneDescuento
      ? Number(product.b2c.sale_price)
      : Number(product.b2c.regular_price);

    const productoAEnviar = {
      ...product,
      id: productId,
      name: product.title || product.name,
      price: precioFinal,
      image: product.image_url || product.image,
      stock_quantity: stockTotal,
    };

    addToCart(productoAEnviar, cantidadCarrito);
    setCantidadCarrito(1);
  };

  return (
    <div className="pi-page">
      {product ? (
        <>
          <span className="pi-route-product">
            {product?.categories?.map((category, index) => (
              <span key={category}>
                <span
                  className="pi-category-link"
                  onClick={() => navigate("/search", { state: { category } })}
                >
                  {category}
                </span>
                {index < product.categories.length - 1 && " > "}
              </span>
            ))}
          </span>
          <div className="pi-product-detail-grid">
            <div className="pi-izq">
              <img
                className="pi-product-image"
                src={product.image_url}
                alt={product.title}
              />
            </div>

            <div className="pi-der">
              <p className="pi-product-mod">MOD: {product.model}</p>

              <p className="pi-product-title">{product.title}</p>

              <Rating rating={product.rating} />

              <div className="pi-product-badges">
                <span className="pi-product-warranty pi-product-badge">
                  <ShieldCheck /> Garantía de {product.b2c?.warranty_months}{" "}
                  meses
                </span>
                <span className="pi-product-estimated-delivery pi-product-badge">
                  <Clock8 /> Tiempo de entrega estimado de{" "}
                  {product.b2c?.estimated_delivery_days} días
                </span>
              </div>

              <div className="pi-product-info-container-details">
                <h3>Características del producto:</h3>
                <ul className="pi-product-details">
                  <li>
                    <span className="pi-bold">Categoría:</span>{" "}
                    {product.category}
                  </li>
                  <li>
                    <span className="pi-bold">Marca:</span> {product.brand}
                  </li>
                  <li>
                    <span className="pi-bold">Modelo:</span> {product.model}
                  </li>
                  {product.facets &&
                    Object.entries(product.facets).map(([name, value]) => (
                      <li key={name}>
                        <span className="pi-bold">
                          {translations.facets?.[name] || name}:
                        </span>{" "}
                        {value}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="pi-container-prices">
                {tieneDescuento ? (
                  <>
                    <span className="pi-product-price">
                      {currency}
                      {Number(product.b2c.sale_price).toLocaleString("en-US")}
                    </span>
                    <span className="pi-product-regular-price-discount">
                      {currency}
                      {Number(product.b2c.regular_price).toLocaleString(
                        "en-US"
                      )}
                    </span>

                    <span className="pi-product-discount-badge">
                      <BadgePercent /> ¡{product.b2c.discount_percentage}% de
                      descuento!
                    </span>
                    {product.b2c.free_shipping && (
                      <span className="pi-product-discount-badge">
                        <Truck />
                        ¡Envío gratis!
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="pi-product-price">
                      {currency}
                      {Number(
                        product.b2c?.sale_price || product.b2c?.regular_price
                      ).toLocaleString("en-US")}
                    </span>
                    {product.b2c?.free_shipping && (
                      <span className="pi-product-discount-badge">
                        <Truck />
                        ¡Envío gratis!
                      </span>
                    )}
                  </>
                )}
              </div>

              {product.in_stock && product.b2c?.enabled ? (
                <div className="pi-shipping-container">
                  {stockDisponibleParaAgregar <= 0 ? (
                    <button
                      className="pi-without-stock"
                      title={`Ya alcanzaste el límite disponible para este producto (${stockTotal} unidades en carrito).`}
                    >
                      <XCircle size={22} strokeWidth={2} /> Límite alcanzado
                    </button>
                  ) : (
                    <>
                      <div className="pi-shipping-quantity-container">
                        <button
                          className="pi-shipping-button-del"
                          onClick={() => setCantidadCarrito(cantidadCarrito - 1)}
                          disabled={cantidadCarrito === 1}
                        >
                          -
                        </button>
                        <span className="pi-shipping-quantity">
                          {cantidadCarrito}
                        </span>
                        <button
                          className="pi-shipping-button-add"
                          onClick={() => setCantidadCarrito(cantidadCarrito + 1)}
                          disabled={cantidadCarrito >= stockDisponibleParaAgregar}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="pi-add-to-cart"
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart /> Agregar al carrito
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="pi-shipping-container">
                  <span className="pi-without-stock">
                    <XCircle size={22} strokeWidth={2} /> Producto{" "}
                    {!product.b2c?.enabled ? "no disponible" : "agotado"}
                  </span>
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