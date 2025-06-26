import axios from 'axios'
import apiConfig from '../api/config'

const API_URL = apiConfig.API_URL

// 请求拦截器，添加 token 到所有请求
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器，处理 token 过期等情况
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token过期或无效，清除用户信息并重定向到登录页
      authService.logout()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

/**
 * Auth Service
 * Handles user authentication and token management
 */
const authService = {
  /**
   * Login user
   * @param {Object} credentials - User credentials (phone, password)
   * @returns {Promise} - API response
   */
  login(credentials) {
    console.log('🔐 Auth Request: Login', { phone: credentials.phone });
    return axios.post(`${API_URL}/users/login`, credentials)
      .then(response => {
        if (response.data.success) {
          // Store token and user data
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
          
          // Set Authorization header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        return response.data;
      });
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - API response
   */
  register(userData) {
    console.log('🔐 Auth Request: Register', { phone: userData.phone, name: userData.name });
    return axios.post(`${API_URL}/users/register`, userData)
      .then(response => {
        if (response.data.success) {
          // Store token and user data
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
          
          // Set Authorization header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        return response.data;
      });
  },

  /**
   * Logout user
   */
  logout() {
    // Remove token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove Authorization header
    delete axios.defaults.headers.common['Authorization'];
  },

  /**
   * Check if user is authenticated
   * @returns {Boolean} - Authentication status
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  },

  /**
   * Get current user from local storage
   * @returns {Object|null} - Current user data or null
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data', error);
      return null;
    }
  },

  /**
   * Set current user to local storage
   * @param {Object} userData - User data to store
   */
  setCurrentUser(userData) {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data', error);
    }
  },

  /**
   * Fetch current user from API
   * @returns {Promise} - API response with user data
   */
  fetchCurrentUser() {
    return axios.get(`${API_URL}/users/profile`)
      .then(response => {
        if (response.data.success) {
          // Update stored user data
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
      })
      .catch(error => {
        console.error('Error fetching user profile', error);
        return { success: false, message: 'Failed to fetch user profile' };
      });
  },

  /**
   * Get current token
   * @returns {String|null} - JWT token or null
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Setup auth header for axios
   */
  setupAuthHeader() {
    const token = this.getToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
}

// Setup auth header on service initialization
authService.setupAuthHeader();

export default authService