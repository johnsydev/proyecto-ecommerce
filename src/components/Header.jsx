import SearchBar from "../features/catalog/components/SearchBar";
import "../styles/Header.css";
import robotLogo from "../assets/ElectroLogo.png";
import CartPreview from "../features/cart/components/CartPreview";
import { useCart } from "../context/CartContext";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

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
  const { cart, totalItems } = useCart();
  const [previewProduct, setPreviewProduct] = useState(null);
  const [showCartPreview, setShowCartPreview] = useState(false);
  
  // Nuevo estado para controlar qué vista mostrar (burbuja o menú lateral)
  const [previewMode, setPreviewMode] = useState("single"); 
  
  const location = useLocation();
  const previousTotalItems = useRef(totalItems);

  // 1. Animación al agregar un producto 
  useEffect(() => {
    let timeoutId;
    const isCartPage = location.pathname.includes("/cart") || window.location.hash.includes("/cart");

    if (totalItems > previousTotalItems.current && !isCartPage) {
      const ultimoProducto = cart[cart.length - 1];
      
      if (ultimoProducto) {
        setPreviewProduct(ultimoProducto);
        setPreviewMode("single");
        setShowCartPreview(true);

        timeoutId = setTimeout(() => {
          setShowCartPreview(false);
        }, 2000);
      }
    }

    previousTotalItems.current = totalItems;
    return () => clearTimeout(timeoutId);
  }, [totalItems, cart, location]);

  // 2. Al darle al botón del carrito 
  const handleCartClick = (e) => {
    e.preventDefault();
    const isCartPage = location.pathname.includes("/cart") || window.location.hash.includes("/cart");
    if (isCartPage) return; // Si ya estamos en el carrito, no lo abre

    if (cart.length > 0) {
      setPreviewMode("drawer");
      setShowCartPreview(true);
    } else {
      window.location.hash = "/cart"; // Si está vacío, te manda directo a la página
    }
  };

  // Bloquear el scroll de fondo cuando el menú lateral está abierto
  useEffect(() => {
    if (showCartPreview && previewMode === "drawer") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showCartPreview, previewMode]);

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
              <svg className="account-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              onClick={handleCartClick}
            >
              <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="cart-badge">{totalItems}</span>
            </a>
            
            {showCartPreview && (
              <CartPreview
                mode={previewMode}
                product={previewProduct}
                cart={cart}
                cartItemCount={totalItems}
                onClose={() => setShowCartPreview(false)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}