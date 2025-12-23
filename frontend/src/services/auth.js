import axios from 'axios';

const AUTH_API_URL = 'http://localhost:8000/api/auth';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Configure axios to include token in all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const register = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/register/`, {
      username: userData.email.split('@')[0], // Use email prefix as username
      email: userData.email,
      password: userData.password,
      password_confirm: userData.password_confirm,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: userData.phone || ''
    });
    
    localStorage.setItem(TOKEN_KEY, response.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    
    // Trigger login event
    window.dispatchEvent(new Event('userLoggedIn'));
    
    return response.data.user;
  } catch (error) {
    console.error('Registration error:', error.response?.data);
    throw error.response?.data || error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/login/`, { 
      email, 
      password 
    });
    
    localStorage.setItem(TOKEN_KEY, response.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    
    // Trigger login event
    window.dispatchEvent(new Event('userLoggedIn'));
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data);
    throw error.response?.data || error;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      await axios.post(`${AUTH_API_URL}/logout/`);
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event('userLoggedOut'));
  }
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => {
  return localStorage.getItem(TOKEN_KEY) !== null;
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const updateUserProfile = async (userData) => {
  try {
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined && userData[key] !== '') {
        formData.append(key, userData[key]);
      }
    });
    
    const response = await axios.patch(
      `${AUTH_API_URL}/users/update_profile/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    localStorage.setItem(USER_KEY, JSON.stringify(response.data));
    
    // Trigger event to update navbar
    window.dispatchEvent(new Event('userLoggedIn'));
    
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error.response?.data);
    throw error.response?.data || error;
  }
};
