import "../styles/ProductCard.css";
import { ShoppingCart, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useUser } from "../../../context/useUser";
import { PERMISSIONS } from "../../../utils/permissions";
import {
  getMinQuantity,
  getPriceInfo,
  isProductEnabled,
  PRICE_LISTS,
} from "../../../utils/pricing";

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
 * - El botón "Agregar al carrito" guarda una unidad del producto en el carrito.
 */

export default function ProductCard({ hit }) {
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const { user, can } = useUser();
  const canAddToCart = can(PERMISSIONS.ADD_TO_CART);

  const price = getPriceInfo(hit, user);
  const minQuantity = getMinQuantity(hit, user);
  const isB2B = price.priceList === PRICE_LISTS.B2B;
  const symbol = hit.currency !== "CRC" ? "$" : "₡";

  const isEnabled = isProductEnabled(hit, user);
  const isAvailable = hit.in_stock && isEnabled && price.isValid;
  const notAvailableText = !isEnabled
    ? "Producto no disponible"
    : !price.isValid
      ? "Precio no disponible"
      : "Producto agotado";

  const productId = hit.objectID || hit.id;
  const stockTotal = hit.stock_quantity ?? (hit.in_stock ? 999 : 0);

  const productoEnCarrito = cart.find(
    (item) => (item.id ?? item.objectID) === productId
  );
  const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.order_quantity : 0;
  const stockDisponibleParaAgregar = stockTotal - cantidadEnCarrito;

  // Un cliente B2B completa primero su cantidad mínima y luego agrega de a una unidad.
  const cantidadAAgregar = Math.max(1, minQuantity - cantidadEnCarrito);
  const alcanzaMinimo = stockDisponibleParaAgregar >= cantidadAAgregar;

  const handleAddToCart = () => {
    if (!alcanzaMinimo) return;

    const productoAEnviar = {
      ...hit,
      id: productId,
      name: hit.title || hit.name,
      image: hit.image_url || hit.image,
      stock_quantity: stockTotal,
    };

    addToCart(productoAEnviar, cantidadAAgregar);
  };

  return (
    <div className="product-card">
      <div className="product-img-container">
        <img
          src={hit.image_url}
          alt={hit.title}
          className={
            isAvailable
              ? "product-img"
              : "product-img product-img-disabled"
          }
          onClick={() => navigate(`/producto/${hit.objectID}`)}
        />
      </div>

      <div className="product-info">
        <h3
          className="product-title"
          onClick={() => navigate(`/producto/${hit.objectID}`)}
        >
          {hit.title}
        </h3>

        <p className="product-model">MOD: {hit.model}</p>

        {isB2B && (
          <p className="product-b2b-note">
            Mínimo {minQuantity} unidades
          </p>
        )}

        <p className="product-price">
          {!price.isValid && (
            <span className="product-price-invalid">Precio no disponible</span>
          )}
          {price.hasDiscount && (
            <>
              <span className="product-discount">
                {symbol}
                {price.unitPrice.toLocaleString("en-US")}
              </span>

              <span className="product-regular-price-discount">
                {symbol}
                {price.regularPrice.toLocaleString("en-US")}
              </span>
            </>
          )}
          {price.isValid && !price.hasDiscount && (
            <span className="product-regular-price">
              {symbol}
              {price.unitPrice.toLocaleString("en-US")}
            </span>
          )}
        </p>

        {!canAddToCart ? null : isAvailable ? (
          stockDisponibleParaAgregar <= 0 ? (
            <button
              type="button"
              className="pc-without-stock"
              title={`Ya alcanzaste el límite disponible para este producto (${stockTotal} unidades en carrito).`}
            >
              <XCircle size={22} strokeWidth={2} />
              Límite alcanzado
            </button>
          ) : !alcanzaMinimo ? (
            <button
              type="button"
              className="pc-without-stock"
              title={`Solo hay ${stockTotal} unidades y la compra mínima B2B es de ${minQuantity}.`}
            >
              <XCircle size={22} strokeWidth={2} />
              Stock menor al mínimo
            </button>
          ) : (
            <button
              type="button"
              className="product-button"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={22} strokeWidth={2} /> Agregar al carrito
            </button>
          )
        ) : (
          <button className="pc-without-stock">
            <XCircle size={22} strokeWidth={2} />
            {notAvailableText}
          </button>
        )}
      </div>
    </div>
  );
}