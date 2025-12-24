import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts, getLatestProducts } from '../services/api';
import { addToCart } from '../utils/cart';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
    
    // Listen for add to cart event
    window.addEventListener('addToCart', handleAddToCart);
    return () => window.removeEventListener('addToCart', handleAddToCart);
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('Loading featured and latest products...');
      const [featured, latest] = await Promise.all([
        getFeaturedProducts(),
        getLatestProducts()
      ]);
      console.log('Featured products:', featured);
      console.log('Latest products:', latest);
      
      setFeaturedProducts(Array.isArray(featured) ? featured : []);
      setLatestProducts(Array.isArray(latest) ? latest : []);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError(`Failed to load products: ${err.response?.data?.detail || err.message || 'Please check if the backend is running.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (event) => {
    const product = event.detail;
    addToCart(product);
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show success message (you can use a toast library here)
    alert(`${product.name} added to cart!`);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {/* Backend Cold Start Notice */}
      <div className="alert alert-info mb-0 rounded-0 text-center py-2" role="alert" style={{ 
        background: 'linear-gradient(90deg, #17a2b8 0%, #138496 100%)',
        border: 'none',
        color: 'white',
        overflow: 'hidden'
      }}>
        <marquee behavior="scroll" direction="left" scrollamount="5">
          ⏱️ First load may take up to 50 seconds as our free-tier backend wakes up. Thank you for your patience! 🚀
        </marquee>
      </div>

      {/* Hero Section */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold mb-3">
                Fresh Organic Products
              </h1>
              <p className="lead text-muted mb-4">
                Discover our wide selection of organic fruits, vegetables, and groceries 
                delivered fresh to your doorstep.
              </p>
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Now
              </Link>
            </div>
            <div className="col-md-6">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600" 
                alt="Fresh Produce" 
                className="img-fluid rounded"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-3">
              <div className="p-3">
                <div className="fs-1 text-primary mb-3">🚚</div>
                <h5>Free Delivery</h5>
                <p className="text-muted">Free shipping on orders over $50</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3">
                <div className="fs-1 text-primary mb-3">🌱</div>
                <h5>100% Organic</h5>
                <p className="text-muted">Certified organic products</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3">
                <div className="fs-1 text-primary mb-3">💰</div>
                <h5>Best Prices</h5>
                <p className="text-muted">Competitive pricing guaranteed</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3">
                <div className="fs-1 text-primary mb-3">✅</div>
                <h5>Quality Assured</h5>
                <p className="text-muted">Fresh and high quality</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Featured Products</h2>
            <Link to="/products" className="btn btn-outline-primary">
              View All
            </Link>
          </div>
          
          <div className="row">
            {featuredProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Latest Products</h2>
            <Link to="/products" className="btn btn-outline-primary">
              View All
            </Link>
          </div>
          
          <div className="row">
            {latestProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
