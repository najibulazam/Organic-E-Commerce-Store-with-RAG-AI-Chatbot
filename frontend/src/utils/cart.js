// Get cart from localStorage
export const getCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

// Save cart to localStorage
export const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Add item to cart
export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.final_price,
      image: product.image,
      quantity: quantity,
      stock: product.stock
    });
  }
  
  saveCart(cart);
  return cart;
};

// Remove item from cart
export const removeFromCart = (productId) => {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  return cart;
};

// Update item quantity
export const updateCartItemQuantity = (productId, quantity) => {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      return removeFromCart(productId);
    }
  }
  
  saveCart(cart);
  return cart;
};

// Clear cart
export const clearCart = () => {
  localStorage.removeItem('cart');
  return [];
};

// Get cart total
export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Get cart items count
export const getCartItemsCount = () => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};
