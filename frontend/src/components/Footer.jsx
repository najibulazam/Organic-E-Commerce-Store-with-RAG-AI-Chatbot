function Footer() {
  return (
    <footer className="bg-light mt-5">
      <div className="container py-4">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="text-primary">🌿 Organic Store</h5>
            <p className="text-muted">
              Your trusted source for fresh, organic groceries delivered to your door.
            </p>
          </div>
          
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-muted text-decoration-none">Home</a></li>
              <li><a href="/products" className="text-muted text-decoration-none">Products</a></li>
              <li><a href="/cart" className="text-muted text-decoration-none">Cart</a></li>
            </ul>
          </div>
          
          <div className="col-md-4 mb-3">
            <h5>Contact Us</h5>
            <p className="text-muted">
              Email: azam.mdnajibul@gmail.com<br />
              Phone: +88 0197 826 4938<br />
              Hours: Mon-Sat 8AM-8PM
            </p>
          </div>
        </div>
        
        <hr />
        
        <div className="text-center text-muted">
          <p className="mb-0">© 2026 Organic Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
