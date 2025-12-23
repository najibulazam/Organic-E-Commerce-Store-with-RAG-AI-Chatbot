import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const handleAddToCart = () => {
    // This will be handled by the parent component
    const event = new CustomEvent('addToCart', { detail: product });
    window.dispatchEvent(event);
  };

  return (
    <div className="col-md-6 col-lg-4 col-xl-3 mb-4">
      <div className="card product-card h-100">
        <div className="position-relative">
          <Link to={`/products/${product.slug}`}>
            <img 
              src={product.image} 
              className="card-img-top product-image" 
              alt={product.name}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250"%3E%3Crect width="300" height="250" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
              }}
            />
          </Link>
          {product.is_on_sale && (
            <span className="badge-sale">Sale!</span>
          )}
        </div>
        
        <div className="card-body d-flex flex-column">
          <p className="text-muted small mb-1">{product.category_name}</p>
          <h5 className="card-title">
            <Link to={`/products/${product.slug}`} className="text-decoration-none text-dark">
              {product.name}
            </Link>
          </h5>
          
          <div className="mb-2">
            {product.is_on_sale ? (
              <>
                <span className="text-danger fw-bold me-2">${product.final_price}</span>
                <span className="text-muted text-decoration-line-through">${product.price}</span>
              </>
            ) : (
              <span className="fw-bold">${product.price}</span>
            )}
          </div>

          {product.rating > 0 && (
            <div className="mb-2">
              <span className="text-warning">★</span>
              <span className="ms-1">{product.rating}/5</span>
            </div>
          )}

          <div className="mt-auto">
            {product.stock > 0 ? (
              <button 
                className="btn btn-primary w-100"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            ) : (
              <button className="btn btn-secondary w-100" disabled>
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
