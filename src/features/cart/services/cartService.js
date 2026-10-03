const CART_KEY = "cart";

export function getCart() {
  const cart = localStorage.getItem(CART_KEY);

  return cart ? JSON.parse(cart) : [];
}

export function getProductCartQuantity(productId) {
  const cart = getCart();

  const producto = cart.find(
    (item) => item.id === productId,
  );

  return producto ? producto.order_quantity : 0;
}

export function addToCart(product, quantity) {
  const cart = getCart();

  const productoExistente = cart.find(
    (item) => item.id === product.id,
  );

  if (productoExistente) {
    productoExistente.order_quantity += quantity;

    if (productoExistente.order_quantity > productoExistente.stock_quantity) {
      productoExistente.order_quantity = productoExistente.stock_quantity;
    }
  } else {
    cart.push({
      ...product,
      order_quantity: quantity,
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function removeFromCart(productId) {
  const cart = getCart();

  const nuevoCart = cart.filter(
    (item) => item.id !== productId,
  );

  localStorage.setItem(CART_KEY, JSON.stringify(nuevoCart));
}

export function addUnit(productId) {
  const cart = getCart();

  const producto = cart.find(
    (item) => item.id === productId,
  );

  if (!producto) {
    return;
  }


  if (producto.order_quantity < producto.stock_quantity) {
    producto.order_quantity += 1;
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function removeUnit(productId) {
  const cart = getCart();

  const producto = cart.find(
    (item) => item.id === productId,
  );

  if (!producto) {
    return;
  }

  if (producto.order_quantity > 1) {
    producto.order_quantity -= 1;
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function updateCartQuantity(productId, quantity) {
  const cart = getCart();

  const producto = cart.find(
    (item) => item.id === productId,
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

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

export default {
  getCart,
  getProductCartQuantity,
  addToCart,
  removeFromCart,
  addUnit,
  removeUnit,
  updateCartQuantity,
  clearCart,
};