import SearchBar from "../features/catalog/components/SearchBar";
import "../styles/Header.css";
import robotLogo from "../assets/ElectroLogo.png";
import CartPreview from "../features/cart/components/CartPreview";
import { getCartItemCount } from "../features/cart/services/cartService";
import { useEffect, useState } from "react";

/*
 * Objetivo:
 * Mostrar el encabezado principal de la aplicación con el logo, el nombre
 * de la tienda, la barra de búsqueda y accesos relacionados con la cuenta
 * y el carrito de compras.
 *
 * Entrada:
 * - El componente SearchBar utilizado para realizar búsquedas de productos.
 * - El archivo ElectroLogo.png utilizado como logo de la aplicación.
 * - Los enlaces y textos definidos directamente dentro del componente.
 *
 * Salida:
 * - Muestra el encabezado principal de la aplicación.
 * - Permite acceder a la página de búsqueda mediante el logo y el nombre
 *   de la tienda.
 * - Muestra la barra de búsqueda de productos.
 * - Presenta accesos visuales para inicio de sesión, registro y carrito.
 *
 * Restricciones:
 * - El componente SearchBar debe existir y estar correctamente importado.
 * - El archivo ElectroLogo.png debe encontrarse en la ruta indicada.
 * - El archivo Header.css debe existir para aplicar los estilos del componente.
 * - Los enlaces de acceso y registro no están conectados a rutas funcionales, ya que
 *   no se definieron en el alcance del proyecto.
 * - El contador del carrito refleja la cantidad total de unidades agregadas.
 */

export default function Header() {
  const [cartItemCount, setCartItemCount] = useState(() => getCartItemCount());
  const [previewProduct, setPreviewProduct] = useState(null);
  const [showCartPreview, setShowCartPreview] = useState(false);

  useEffect(() => {
    let timeoutId;

    const handleCartUpdated = (event) => {
      setCartItemCount(getCartItemCount());

      if (event.detail?.product) {
        setPreviewProduct(event.detail.product);
        setShowCartPreview(true);

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
          setShowCartPreview(false);
        }, 4000);
      }
    };

    const handleStorage = () => {
      setCartItemCount(getCartItemCount());
    };

    window.addEventListener("cart-updated", handleCartUpdated);
    window.addEventListener("storage", handleStorage);

    return () => {
      clearTimeout(timeoutId);

      window.removeEventListener("cart-updated", handleCartUpdated);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="header-container">
        <a href="#/search" className="header-brand">
          <img
            src={robotLogo}
            alt="Electro-Commerce CR Logo"
            className="header-logo-img"
          />
          <span className="header-title">Electro-Commerce CR</span>
        </a>

        <div className="header-search-container">
          <SearchBar />
        </div>

        <div className="header-actions">
          <div className="header-account">
            <div className="account-icon-wrapper">
              <svg
                className="account-svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="account-text">
              <span className="account-label">Cuenta</span>
              <div className="account-links">
                <a href="#signin">Acceso</a>
                <span className="separator">/</span>
                <a href="#signup">Registro</a>
              </div>
            </div>
          </div>

          <div className="header-cart-wrapper">
            <a
              href="#/cart"
              className="header-cart-btn"
              aria-label="Ver carrito"
              onClick={() => setShowCartPreview(false)}
            >
            <svg
              className="cart-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="cart-badge">{cartItemCount}</span>
            </a>
            {showCartPreview && previewProduct && (
              <CartPreview
                product={previewProduct}
                cartItemCount={cartItemCount}
                onClose={() => setShowCartPreview(false)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
