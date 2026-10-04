import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CART_KEY = 'cart';

// Cargar estado inicial desde localStorage
const getInitialState = () => {
  const localData = localStorage.getItem(CART_KEY);
  return localData ? JSON.parse(localData) : [];
};

// Auxiliar para obtener ID
const getProductId = (product) => product.id ?? product.objectID;

// Reducer para manejar las acciones
function cartReducer(state, action) {
  let newState;

  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const productId = getProductId(product);
      const existingIndex = state.findIndex((item) => getProductId(item) === productId);

      if (existingIndex >= 0) {
        newState = state.map((item, index) => {
          if (index === existingIndex) {
            const newQty = item.order_quantity + quantity;
            return {
              ...item,
              order_quantity: item.stock_quantity ? Math.min(newQty, item.stock_quantity) : newQty,
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
            order_quantity: product.stock_quantity ? Math.min(quantity, product.stock_quantity) : quantity,
          },
        ];
      }
      break;
    }

    case 'REMOVE_FROM_CART': {
      newState = state.filter((item) => getProductId(item) !== action.payload);
      break;
    }

    case 'ADD_UNIT': {
      newState = state.map((item) => {
        if (getProductId(item) === action.payload) {
          if (!item.stock_quantity || item.order_quantity < item.stock_quantity) {
            return { ...item, order_quantity: item.order_quantity + 1 };
          }
        }
        return item;
      });
      break;
    }

    case 'REMOVE_UNIT': {
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

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        newState = state.filter((item) => getProductId(item) !== productId);
      } else {
        newState = state.map((item) => {
          if (getProductId(item) === productId) {
            const finalQty = item.stock_quantity ? Math.min(quantity, item.stock_quantity) : quantity;
            return { ...item, order_quantity: finalQty };
          }
          return item;
        });
      }
      break;
    }

    case 'CLEAR_CART': {
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
  const [cart, dispatch] = useReducer(cartReducer, [], getInitialState);

  // Sincronizar cambios en localStorage
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // Valores calculados requeridos
  const totalItems = cart.reduce((total, item) => total + Number(item.order_quantity ?? 0), 0);
  
  // Agregar propiedad subtotal a cada elemento
  const cartWithSubtotals = cart.map((item) => ({
    ...item,
    subtotal: (item.price ?? 0) * item.order_quantity,
  }));

  // Métodos expuestos para la aplicación
  const addToCart = (product, quantity) => dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  const removeFromCart = (productId) => dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  const addUnit = (productId) => dispatch({ type: 'ADD_UNIT', payload: productId });
  const removeUnit = (productId) => dispatch({ type: 'REMOVE_UNIT', payload: productId });
  const updateCartQuantity = (productId, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

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
    throw new Error('useCart debe utilizarse dentro de un CartProvider');
  }
  return context;
}