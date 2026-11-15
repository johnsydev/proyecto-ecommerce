
import "../styles/Cart.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import emptyCartImage from "../../../assets/electro_carrito_vacio.png";
import { useCart } from "../../../context/CartContext";
import { useUser } from "../../../context/useUser";
import { validateCart } from "../../../utils/cartValidation";
import BranchSelector from "./BranchSelector";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import PurchaseStepper from "../../../components/PurchaseStepper";


/*
   * Objetivo:
   *   - Mostrar y gestionar el carrito de compras del usuario.
   *   - Permitir la adición, eliminación y actualización de productos en el carrito.
   *   - Proporcionar un resumen de la compra y un botón para volver al inicio de la página.
   * 
   * Entrada:
   *   - Ninguna entrada directa, ya que el componente obtiene el estado del carrito desde el contexto.
   * 
   * Salida:
   *   - Renderizado del carrito de compras con la lista de productos y el resumen de la compra.
   * 
   * Restricciones:
   *   - La cantidad de un producto no puede exceder su stock disponible en la sucursal seleccionada.
   *   - La cantidad de un producto no puede ser negativa.
   *   - No se puede continuar al pago sin sucursal ni con líneas que incumplan inventario o mínimo B2B.
*/

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useUser();
  const {
    cart,
    addUnit,
    removeUnit,
    removeFromCart,
    updateCartQuantity,
    branchId,
    selectBranch,
  } = useCart();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const getProductId = (product) => product.id ?? product.objectID;
  const validation = validateCart(cart, user, branchId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="cart-page">

      {/* Encabezado y pasos */}
      <PurchaseStepper currentStep={1} />

      {/* Contenido del carrito */}
      {cart.length === 0 ? (

        <div className="cart-empty">
          <img
            className="cart-empty-image"
            src={emptyCartImage}
            alt="Carrito vacío"
          />

          <h2>Tu carrito está vacío</h2>

          <p>
            Explora nuestro catálogo para añadir componentes.
          </p>

          <button
            type="button"
            className="cart-continue-button"
            onClick={() => navigate("/search")}
          >
            Ver Catálogo
          </button>
        </div>

      ) : (

        <div className="cart-layout">

          {/* Lista de productos */}
          <section
            className="cart-items-container"
            aria-label="Productos en el carrito"
          >
            <BranchSelector
              cart={cart}
              branchId={branchId}
              onSelect={selectBranch}
            />

            {cart.map((product) => (
              <CartItem
                key={getProductId(product)}
                product={product}
                branchId={branchId}
                issue={validation.lineIssues[getProductId(product)] ?? null}
                onAddUnit={() => {
                  addUnit(getProductId(product));
                }}
                onRemoveUnit={() => {
                  removeUnit(getProductId(product));
                }}
                onRemove={() => {
                  removeFromCart(getProductId(product));
                }}
                onAdjust={(quantity) => {
                  updateCartQuantity(getProductId(product), quantity);
                }}
              />
            ))}
          </section>

          {/* Resumen de compra */}
          <CartSummary cart={cart} validation={validation} branchId={branchId} />

        </div>
      )}

      {/* Botón flotante para volver arriba */}
      {cart.length > 0 && showScrollTop && (
        <button
          type="button"
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Volver al inicio de la página"
          title="Volver arriba"
        >
          <ArrowUp size={22} strokeWidth={2.5} />
        </button>
      )}

    </div>
  );
}