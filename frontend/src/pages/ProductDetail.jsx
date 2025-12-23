import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug } from '../services/api';
import { addToCart } from '../utils/cart';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      console.log('Loading product:', slug);
      const data = await getProductBySlug(slug);
      console.log('Product data:', data);
      setProduct(data);
      setError(null);
    } catch (err) {
      console.error('Error loading product:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError(`Failed to load product: ${err.response?.data?.detail || err.message || 'Product not found'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`${quantity} x ${product.name} added to cart!`);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Product not found" />;

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
          <li className="breadcrumb-item active">{product.name}</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="position-relative">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid rounded"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
              }}
            />
            {product.is_on_sale && (
              <span className="badge-sale">Sale!</span>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <span className="badge bg-secondary mb-2">{product.category_name}</span>
          <h1 className="mb-3">{product.name}</h1>
          
          <div className="mb-3">
            {product.is_on_sale ? (
              <>
                <h2 className="text-danger d-inline me-3">${product.final_price}</h2>
                <span className="text-muted text-decoration-line-through fs-4">
                  ${product.price}
                </span>
              </>
            ) : (
              <h2 className="text-primary">${product.price}</h2>
            )}
          </div>

          {product.rating > 0 && (
            <div className="mb-3">
              <span className="text-warning fs-5">★</span>
              <span className="ms-2">{product.rating}/5</span>
            </div>
          )}

          <p className="lead mb-4">{product.description}</p>

          <div className="mb-3">
            <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <>
              <div className="mb-4">
                <label className="form-label fw-bold">Quantity:</label>
                <div className="input-group" style={{ width: '150px' }}>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    className="form-control text-center"
                    value={quantity}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg w-100 mb-3"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </>
          )}

          <Link to="/products" className="btn btn-outline-secondary w-100">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
