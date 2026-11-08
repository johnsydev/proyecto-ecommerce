import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
import { ANALYTICS_EVENTS, recordEvent } from "../utils/analyticsStorage.js";
import { useUser } from "./useUser";
import {
  getPurchaseOwnerKey,
  readCart,
  writeCart,
} from "../utils/purchaseStorage";

/*
 * Contexto y lógica del carrito de compras.
 * Proporciona un estado global para manejar los productos en el carrito,
 * incluyendo la adición, eliminación, actualización de cantidades y limpieza del carrito.
 * Conserva un carrito independiente por usuario y otro para el visitante.
 * Sincroniza el estado con localStorage para persistencia entre sesiones.
 */

/**
 * Obtiene el ID de un producto, utilizando `id` o `objectID` como fallback.
 */
const getProductId = (product) => product.id ?? product.objectID;

/**
 * Objetivo:
 * Manejar las acciones relacionadas con el carrito de compras, actualizando el estado según la acción recibida.
 *
 * Entrada:
 *   - state: Array de productos actualmente en el carrito.
 *   - action: Objeto que describe la acción a realizar (tipo y payload).
 *
 * Salida:
 *   - newState: Nuevo estado del carrito después de aplicar la acción.
 *
 * Restricciones:
 *   - La cantidad de un producto no puede exceder su stock disponible.
 *   - La cantidad de un producto no puede ser negativa.
 *
 */
function cartReducer(state, action) {
  let newState;

  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, quantity } = action.payload;
      const productId = getProductId(product);
      const existingIndex = state.findIndex(
        (item) => getProductId(item) === productId,
      );

      if (existingIndex >= 0) {
        newState = state.map((item, index) => {
          if (index === existingIndex) {
            const newQty = item.order_quantity + quantity;
            return {
              ...item,
              order_quantity: item.stock_quantity
                ? Math.min(newQty, item.stock_quantity)
                : newQty,
            };
          }
          return item;
        });
      } else {
        newState = [
          ...state,
          {
            ...product,
            id: productId,
            order_quantity: product.stock_quantity
              ? Math.min(quantity, product.stock_quantity)
              : quantity,
          },
        ];
      }
      break;
    }

    case "REMOVE_FROM_CART": {
      newState = state.filter((item) => getProductId(item) !== action.payload);
      break;
    }

    case "ADD_UNIT": {
      newState = state.map((item) => {
        if (getProductId(item) === action.payload) {
          if (
            !item.stock_quantity ||
            item.order_quantity < item.stock_quantity
          ) {
            return { ...item, order_quantity: item.order_quantity + 1 };
          }
        }
        return item;
      });
      break;
    }

    case "REMOVE_UNIT": {
      newState = state
        .map((item) => {
          if (getProductId(item) === action.payload) {
            return { ...item, order_quantity: item.order_quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.order_quantity > 0);
      break;
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        newState = state.filter((item) => getProductId(item) !== productId);
      } else {
        newState = state.map((item) => {
          if (getProductId(item) === productId) {
            const finalQty = item.stock_quantity
              ? Math.min(quantity, item.stock_quantity)
              : quantity;
            return { ...item, order_quantity: finalQty };
          }
          return item;
        });
      }
      break;
    }

    case "CLEAR_CART": {
      newState = [];
      break;
    }

    default:
      return state;
  }

  return newState;
}

// Crear el Contexto
const CartContext = createContext();

// Provider del Contexto
export function CartProvider({ children }) {
  const { user } = useUser();
  const ownerKey = getPurchaseOwnerKey(user?.id ?? null);

  return (
    <UserCartProvider key={ownerKey} ownerKey={ownerKey}>
      {children}
    </UserCartProvider>
  );
}

// Reiniciar el estado al cambiar de cuenta evita mezclar carritos y métricas.
function UserCartProvider({ children, ownerKey }) {
  const [cart, dispatch] = useReducer(cartReducer, ownerKey, readCart);
  const previousCart = useRef(cart);
  // Sincronizar cambios en localStorage
  useEffect(() => {
    writeCart(cart, ownerKey);
  }, [cart, ownerKey]);

  /*
   * Objetivo:
   * Registrar las unidades que se agregan al carrito.
   *
   * Entrada:
   * - Estado actual y anterior del carrito.
   *
   * Salida:
   * - Un evento por cada producto cuya cantidad aumenta.
   *
   * Restricciones:
   * - Solo registra incrementos efectivos de cantidad.
   * - No registra productos recuperados al iniciar la aplicación.
   * - No registra disminuciones ni eliminaciones.
   */
  useEffect(() => {
    const previous = previousCart.current;
    previousCart.current = cart;

    if (getPurchaseOwnerKey() !== ownerKey) return;

    cart.forEach((product) => {
      const productId = getProductId(product);
      const previousProduct = previous.find(
        (item) => getProductId(item) === productId,
      );

      const previousQuantity = Number(previousProduct?.order_quantity ?? 0);
      const currentQuantity = Number(product.order_quantity ?? 0);
      const addedQuantity = currentQuantity - previousQuantity;

      if (addedQuantity > 0) {
        recordEvent(ANALYTICS_EVENTS.ADD_TO_CART, {
          productId,
          title: product.title,
          quantity: addedQuantity,
        });
      }
    });
  }, [cart, ownerKey]);

  // Valores calculados requeridos
  const totalItems = cart.reduce(
    (total, item) => total + Number(item.order_quantity ?? 0),
    0,
  );

  // Agregar propiedad subtotal a cada elemento
  const cartWithSubtotals = cart.map((item) => ({
    ...item,
    subtotal: (item.price ?? 0) * item.order_quantity,
  }));

  // Métodos expuestos para la aplicación
  const addToCart = (product, quantity) =>
    dispatch({ type: "ADD_TO_CART", payload: { product, quantity } });
  const removeFromCart = (productId) =>
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  const addUnit = (productId) =>
    dispatch({ type: "ADD_UNIT", payload: productId });
  const removeUnit = (productId) =>
    dispatch({ type: "REMOVE_UNIT", payload: productId });
  const updateCartQuantity = (productId, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{
        cart: cartWithSubtotals,
        totalItems,
        addToCart,
        removeFromCart,
        addUnit,
        removeUnit,
        updateCartQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado para consumir el carrito fácilmente
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe utilizarse dentro de un CartProvider");
  }
  return context;
}
