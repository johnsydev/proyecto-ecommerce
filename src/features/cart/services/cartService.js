const CART_KEY = "cart";
const CART_UPDATED_EVENT = "cart-updated";

function getProductId(product) {
  return product.id ?? product.objectID;
}

export function getCart() {
  const cart = localStorage.getItem(CART_KEY);

  return cart ? JSON.parse(cart) : [];
}

export function getCartItemCount() {
  return getCart().reduce(
    (total, product) => total + Number(product.order_quantity ?? 0),
    0,
  );
}

function saveCart(cart, addedProduct = null) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(
    new CustomEvent(CART_UPDATED_EVENT, {
      detail: addedProduct ? { product: addedProduct } : undefined,
    }),
  );
}

export function getProductCartQuantity(productId) {
  const cart = getCart();

  const producto = cart.find(
    (item) => getProductId(item) === productId,
  );

  return producto ? producto.order_quantity : 0;
}

export function addToCart(product, quantity) {
  const cart = getCart();
  const productId = getProductId(product);

  const productoExistente = cart.find(
    (item) => getProductId(item) === productId,
  );

  if (productoExistente) {
    productoExistente.order_quantity += quantity;

    if (productoExistente.order_quantity > productoExistente.stock_quantity) {
      productoExistente.order_quantity = productoExistente.stock_quantity;
    }
  } else {
    cart.push({
      ...product,
      id: productId,
      order_quantity: quantity,
    });
  }

  const addedProduct = cart.find((item) => getProductId(item) === productId);
  saveCart(cart, addedProduct);
}

export function removeFromCart(productId) {
  const cart = getCart();

  const nuevoCart = cart.filter(
    (item) => getProductId(item) !== productId,
  );

  saveCart(nuevoCart);
}

export function addUnit(productId) {
  const cart = getCart();

  const producto = cart.find(
    (item) => getProductId(item) === productId,
  );

  if (!producto) {
    return;
  }


  if (producto.order_quantity < producto.stock_quantity) {
    producto.order_quantity += 1;
  }

  saveCart(cart);
}

export function removeUnit(productId) {
  const cart = getCart();

  const producto = cart.find(
    (item) => getProductId(item) === productId,
  );

  if (!producto) {
    return;
  }

  if (producto.order_quantity > 1) {
    producto.order_quantity -= 1;
  }

  saveCart(cart);
}

export function updateCartQuantity(productId, quantity) {
  const cart = getCart();

  const producto = cart.find(
    (item) => getProductId(item) === productId,
  );

  if (!producto) {
    return;
  }

  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  if (quantity > producto.stock_quantity) {
    quantity = producto.stock_quantity;
  }

  producto.order_quantity = quantity;

  saveCart(cart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export default {
  getCart,
  getCartItemCount,
  getProductCartQuantity,
  addToCart,
  removeFromCart,
  addUnit,
  removeUnit,
  updateCartQuantity,
  clearCart,
};