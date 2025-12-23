import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout, updateUserProfile } from '../services/auth';
import { getOrders } from '../services/api';

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);
      setEditFormData({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || ''
      });

      // Load orders
      const ordersData = await getOrders();
      const ordersList = ordersData.results || ordersData;
      setOrders(Array.isArray(ordersList) ? ordersList : []);
    } catch (error) {
      console.error('Error loading user data:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      // Store the actual file for upload
      setProfileImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const updatedData = {
        ...editFormData
      };
      
      // Add image file if changed
      if (profileImageFile) {
        updatedData.profile_image = profileImageFile;
      }
      
      const updatedUser = await updateUserProfile(updatedData);
      setUser(updatedUser);
      setEditMode(false);
      setProfileImage(null);
      setProfileImageFile(null);
      
      // Clear file input
      const fileInput = document.getElementById('settingsImageInput');
      if (fileInput) fileInput.value = '';
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || ''
    });
    setProfileImage(null);
    setProfileImageFile(null);
  };

  const getOrderStatusBadge = (status) => {
    const badges = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger'
    };
    return badges[status] || 'secondary';
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container my-5">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-body text-center">
              <div className="position-relative d-inline-block mb-3">
                <div
                  className="avatar-circle"
                  style={{
                    backgroundImage: `url(${profileImage || user.profile_image || 'https://via.placeholder.com/150'})`
                  }}
                />
                {editMode && (
                  <label
                    htmlFor="profileImageInput"
                    className="btn btn-sm btn-primary position-absolute"
                    style={{ bottom: 0, right: 0, borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
                  >
                    📷
                    <input
                      type="file"
                      id="profileImageInput"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
              <h5 className="mb-0">{user.first_name} {user.last_name}</h5>
              <p className="text-muted mb-3">{user.email}</p>
              <button
                className="btn btn-outline-danger btn-sm w-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>

          <div className="list-group">
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 My Profile
            </button>
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📦 My Orders
            </button>
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Personal Information</h5>
                {!editMode ? (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setEditMode(true)}
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <div>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : '💾 Save'}
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={handleCancelEdit}
                      disabled={saving}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                )}
              </div>
              <div className="card-body">
                {!editMode ? (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <strong>First Name:</strong>
                      <p>{user.first_name}</p>
                    </div>
                    <div className="col-md-6">
                      <strong>Last Name:</strong>
                      <p>{user.last_name}</p>
                    </div>
                    <div className="col-md-6">
                      <strong>Email:</strong>
                      <p>{user.email}</p>
                    </div>
                    <div className="col-md-6">
                      <strong>Phone:</strong>
                      <p>{user.phone || 'Not provided'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        value={editFormData.first_name}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        value={editFormData.last_name}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">My Orders ({orders.length})</h5>
              </div>
              <div className="card-body">
                {orders.length === 0 ? (
                  <div className="text-center py-5">
                    <div style={{ fontSize: '64px', opacity: 0.3 }}>📦</div>
                    <h5 className="mt-3 text-muted">No orders yet</h5>
                    <p className="text-muted">Start shopping to see your orders here</p>
                    <Link to="/products" className="btn btn-primary mt-3">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="row g-3">
                      {(showAllOrders ? orders : orders.slice(0, 3)).map(order => (
                        <div key={order.id} className="col-12">
                          <div className="card">
                            <div className="card-body">
                              <div className="row align-items-center">
                                <div className="col-md-3">
                                  <h6 className="mb-1">Order #{order.id}</h6>
                                  <small className="text-muted">
                                    {new Date(order.created_at).toLocaleDateString()}
                                  </small>
                                </div>
                                <div className="col-md-3">
                                  <strong>Total:</strong> ${parseFloat(order.total_amount).toFixed(2)}
                                </div>
                                <div className="col-md-3">
                                  <span className={`badge bg-${getOrderStatusBadge(order.status)}`}>
                                    {order.status.toUpperCase()}
                                  </span>
                                </div>
                                <div className="col-md-3 text-end">
                                  <Link
                                    to={`/orders/${order.id}`}
                                    className="btn btn-sm btn-outline-primary"
                                  >
                                    View Details
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {orders.length > 3 && (
                      <div className="text-center mt-3">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => setShowAllOrders(!showAllOrders)}
                        >
                          {showAllOrders ? 'Show Less' : `Show All Orders (${orders.length})`}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Account Settings</h5>
              </div>
              <div className="card-body">
                {/* Profile Picture Section */}
                <div className="mb-4">
                  <h6>Profile Picture</h6>
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <img 
                        src={profileImage || user.profile_image || 'https://via.placeholder.com/100'} 
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col">
                      <input
                        type="file"
                        id="settingsImageInput"
                        accept="image/*"
                        className="form-control mb-2"
                        onChange={handleImageChange}
                      />
                      <small className="text-muted">
                        Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                      </small>
                      {profileImageFile && (
                        <div className="mt-2">
                          <button 
                            className="btn btn-sm btn-success me-2"
                            onClick={handleSaveProfile}
                            disabled={saving}
                          >
                            {saving ? 'Uploading...' : 'Upload Image'}
                          </button>
                          <button 
                            className="btn btn-sm btn-secondary"
                            onClick={() => {
                              setProfileImage(null);
                              setProfileImageFile(null);
                              document.getElementById('settingsImageInput').value = '';
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <hr />

                <div className="mb-4">
                  <h6>Change Password</h6>
                  <form onSubmit={(e) => { e.preventDefault(); alert('Password change feature coming soon!'); }}>
                    <div className="mb-3">
                      <label className="form-label">Current Password</label>
                      <input type="password" className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <input type="password" className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirm New Password</label>
                      <input type="password" className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-primary">Update Password</button>
                  </form>
                </div>

                <hr />

                <div>
                  <h6 className="text-danger">Danger Zone</h6>
                  <p className="text-muted">Once you delete your account, there is no going back.</p>
                  <button className="btn btn-danger" onClick={() => alert('Delete account feature coming soon!')}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
