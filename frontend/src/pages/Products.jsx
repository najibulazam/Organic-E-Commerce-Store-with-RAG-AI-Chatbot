import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../services/api';
import { addToCart } from '../utils/cart';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadCategories();
    loadProducts();
    
    // Listen for add to cart event
    window.addEventListener('addToCart', handleAddToCart);
    return () => window.removeEventListener('addToCart', handleAddToCart);
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
    loadProducts(1);
  }, [selectedCategory, searchQuery]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      console.log('Categories data:', data);
      // Handle both paginated and non-paginated responses
      const categoriesList = data.results || data;
      setCategories(Array.isArray(categoriesList) ? categoriesList : []);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setCategories([]);
    }
  };

  const loadProducts = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page };
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      
      console.log('Loading products with params:', params);
      const data = await getProducts(params);
      console.log('Products data received:', data);
      
      // Handle both paginated and non-paginated responses
      if (data.results) {
        // Paginated response
        setProducts(data.results);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / 12)); // 12 is PAGE_SIZE from backend
        setCurrentPage(page);
      } else {
        // Non-paginated response
        const productsList = Array.isArray(data) ? data : [];
        setProducts(productsList);
        setTotalCount(productsList.length);
        setTotalPages(1);
        setCurrentPage(1);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError(`Failed to load products: ${err.response?.data?.detail || err.message || 'Please check if the backend is running.'}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (event) => {
    const product = event.detail;
    addToCart(product);
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${product.name} added to cart!`);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadProducts(1);
  };

  const handlePageChange = (page) => {
    loadProducts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Our Products</h1>
      
      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </div>
          </form>
        </div>
        
        <div className="col-md-6 mb-3">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : products.length === 0 ? (
        <div className="alert alert-info">
          No products found. Try adjusting your filters.
        </div>
      ) : (
        <>
          <div className="row">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Products pagination" className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  // Show up to 10 page buttons, or all if less than 10
                  if (totalPages <= 10) {
                    // Show all pages if 10 or fewer
                    return (
                      <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    );
                  } else {
                    // Show first 5, last 5, with ellipsis in between
                    if (page <= 5 || page > totalPages - 5) {
                      return (
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      );
                    } else if (page === 6 || page === totalPages - 5) {
                      return <li key={page} className="page-item disabled"><span className="page-link">...</span></li>;
                    }
                    return null;
                  }
                })}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
              <p className="text-center text-muted">
                Showing page {currentPage} of {totalPages} ({totalCount} total products)
              </p>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

export default Products;
