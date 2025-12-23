import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getCart, 
  updateCartItemQuantity, 
  removeFromCart, 
  getCartTotal,
  clearCart 
} from '../utils/cart';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const items = getCart();
    setCartItems(items);
    setTotal(getCartTotal());
  };

  const handleQuantityChange = (productId, newQuantity) => {
    updateCartItemQuantity(productId, newQuantity);
    loadCart();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRemoveItem = (productId) => {
    if (window.confirm('Remove this item from cart?')) {
      removeFromCart(productId);
      loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Clear all items from cart?')) {
      clearCart();
      loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2 className="mb-4">Your Cart is Empty</h2>
          <p className="text-muted mb-4">Add some products to get started!</p>
          <Link to="/products" className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Shopping Cart</h1>
        <button 
          className="btn btn-outline-danger"
          onClick={handleClearCart}
        >
          Clear Cart
        </button>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item row align-items-center">
                  <div className="col-md-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-fluid rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                      }}
                    />
                  </div>
                  
                  <div className="col-md-4">
                    <h5>
                      <Link 
                        to={`/products/${item.slug}`}
                        className="text-decoration-none text-dark"
                      >
                        {item.name}
                      </Link>
                    </h5>
                    <p className="text-muted mb-0">${item.price}</p>
                  </div>
                  
                  <div className="col-md-3">
                    <div className="input-group">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="form-control text-center"
                        value={item.quantity}
                        readOnly
                        style={{ maxWidth: '60px' }}
                      />
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-md-2 text-end">
                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                  
                  <div className="col-md-1 text-end">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">Order Summary</h5>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span className="text-muted">
                  {total >= 50 ? 'Free' : '$5.00'}
                </span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong className="text-primary">
                  ${(total + (total >= 50 ? 0 : 5)).toFixed(2)}
                </strong>
              </div>
              
              {total < 50 && (
                <p className="text-muted small">
                  Add ${(50 - total).toFixed(2)} more for free shipping!
                </p>
              )}
              
              <button 
                className="btn btn-primary w-100 mb-2"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              
              <Link to="/products" className="btn btn-outline-secondary w-100">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
