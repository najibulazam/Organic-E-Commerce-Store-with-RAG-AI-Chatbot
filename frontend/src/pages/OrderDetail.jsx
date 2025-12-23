import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getOrderById } from '../services/api';
import '../styles/invoice.css';

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      console.log('Loading order:', orderId);
      const data = await getOrderById(orderId);
      console.log('Order data received:', data);
      setOrder(data);
      setError(null);
    } catch (err) {
      console.error('Error loading order:', err);
      console.error('Error response:', err.response?.data);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger'
    };
    return colors[status] || 'secondary';
  };

  const getStatusSteps = (status) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, index) => ({
      name: step.charAt(0).toUpperCase() + step.slice(1),
      active: index <= currentIndex,
      completed: index < currentIndex
    }));
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading order details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <button className="btn btn-primary" onClick={() => navigate('/profile')}>
            Back to Profile
          </button>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Order Not Found</h4>
          <p>The order you're looking for doesn't exist.</p>
          <hr />
          <button className="btn btn-primary" onClick={() => navigate('/profile')}>
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps(order.status || 'pending');

  return (
    <div className="container py-5">
      {/* Print-only Invoice Header */}
      <div className="invoice-header print-only">
        <div className="row align-items-center mb-4">
          <div className="col-6">
            <h1 className="text-success mb-0">🌿 Organic Store</h1>
            <p className="mb-0">Fresh & Organic Products</p>
            <small>123 Green Street, Eco City, EC 12345</small><br />
            <small>Phone: (123) 456-7890 | Email: info@organicstore.com</small>
          </div>
          <div className="col-6 text-end">
            <h2 className="text-uppercase mb-2">Invoice</h2>
            <p className="mb-1"><strong>Invoice #:</strong> INV-{String(order.id).padStart(6, '0')}</p>
            <p className="mb-1"><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
            <p className="mb-0"><strong>Status:</strong> <span className="badge bg-success">{order.status.toUpperCase()}</span></p>
          </div>
        </div>
        <hr className="mb-4" />
      </div>

      {/* Screen Navigation */}
      <nav aria-label="breadcrumb" className="mb-4 no-print">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/profile">Profile</Link></li>
          <li className="breadcrumb-item active">Order #{order.id}</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-lg-8">
          {/* Order Status - Hide in print */}
          <div className="card mb-4 no-print">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Order Status</h5>
              <span className={`badge bg-${getStatusColor(order.status)}`}>
                {(order.status || 'Pending').toUpperCase()}
              </span>
            </div>
            <div className="card-body">
              <div className="order-tracker">
                <div className="d-flex justify-content-between position-relative mb-3">
                  {statusSteps.map((step, index) => (
                    <div key={step.name} className="text-center" style={{ flex: 1 }}>
                      <div 
                        className={`tracker-circle ${step.active ? 'active' : ''} ${step.completed ? 'completed' : ''}`}
                      >
                        {step.completed ? '✓' : index + 1}
                      </div>
                      <small className="d-block mt-2">{step.name}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Order Items</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 invoice-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={item.product_image || 'https://via.placeholder.com/60'} 
                              alt={item.product_name}
                              className="img-thumbnail me-3"
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                            />
                            <div>
                              <strong>{item.product_name}</strong>
                              <br />
                              <small className="text-muted">SKU: {item.product_slug}</small>
                            </div>
                          </div>
                        </td>
                        <td>${Number(item.price || 0).toFixed(2)}</td>
                        <td>{item.quantity || 0}</td>
                        <td>${(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Print-only Customer Info */}
          <div className="invoice-customer print-only mb-4">
            <h5 className="mb-3">Bill To:</h5>
            <p className="mb-1"><strong>{order.customer_name}</strong></p>
            <p className="mb-1">{order.customer_email}</p>
            <p className="mb-1">{order.customer_phone}</p>
            <p className="mb-0">{order.shipping_address}</p>
          </div>

          {/* Order Summary */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <strong>Order ID:</strong> #{order.id}
              </div>
              <div className="mb-2">
                <strong>Date:</strong> {new Date(order.created_at).toLocaleString()}
              </div>
              <div className="mb-3">
                <strong>Payment Method:</strong> Cash on Delivery
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${Number(order.total_amount || order.total_price || 0).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong className="text-primary">${Number(order.total_amount || order.total_price || 0).toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {/* Shipping Address - Hide in print */}
          <div className="card mb-4 no-print">
            <div className="card-header">
              <h5 className="mb-0">Shipping Address</h5>
            </div>
            <div className="card-body">
              <p className="mb-1"><strong>{order.customer_name}</strong></p>
              <p className="mb-1">{order.customer_email}</p>
              <p className="mb-1">{order.customer_phone}</p>
              <p className="mb-0">{order.shipping_address}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="d-grid gap-2 no-print">
            <button className="btn btn-success" onClick={() => window.print()}>
              🖨️ Print Invoice
            </button>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/profile')}>
              ← Back to Orders
            </button>
          </div>

          {/* Print Footer */}
          <div className="invoice-footer print-only mt-5">
            <hr />
            <div className="text-center">
              <p className="mb-1"><strong>Thank you for your order!</strong></p>
              <p className="mb-1">For any questions, contact us at support@organicstore.com</p>
              <small className="text-muted">This is a computer-generated invoice. No signature required.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
