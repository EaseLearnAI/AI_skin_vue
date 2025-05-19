import axios from 'axios';
import apiConfig from './config';

// API URLs
const API_URL = apiConfig.API_URL;

/**
 * Product API Service
 * Handles all product-related API requests
 */
const productApi = {
  /**
   * Create a new product
   * @param {Object} productData - Product data (name, description)
   * @returns {Promise} - API response
   */
  createProduct(productData) {
    console.log('📡 API Request: Create Product', productData);
    return axios.post(`${API_URL}/products`, productData)
      .then(response => {
        console.log('📡 API Response: Create Product', response.data);
        return response.data;
      });
  },

  /**
   * Upload product image
   * @param {String} productId - Product ID
   * @param {FormData} formData - Form data with image file
   * @returns {Promise} - API response
   */
  uploadProductImage(productId, formData) {
    console.log('📡 API Request: Upload Product Image', { productId });
    return axios.post(
      `${API_URL}/products/${productId}/upload-image`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    ).then(response => {
      console.log('📡 API Response: Upload Product Image', response.data);
      return response.data;
    });
  },

  /**
   * Extract product ingredients and name from image
   * @param {String} productId - Product ID
   * @returns {Promise} - API response
   */
  extractProductInfo(productId) {
    console.log('📡 API Request: Extract Product Info', { productId });
    return axios.post(`${API_URL}/products/${productId}/extract-ingredients`)
      .then(response => {
        console.log('📡 API Response: Extract Product Info', response.data);
        return response.data;
      });
  },

  /**
   * Analyze product ingredients
   * @param {String} productId - Product ID
   * @returns {Promise} - API response
   */
  analyzeIngredients(productId) {
    console.log('📡 API Request: Analyze Ingredients', { productId });
    return axios.post(`${API_URL}/products/${productId}/analyze-ingredients`)
      .then(response => {
        console.log('📡 API Response: Analyze Ingredients', response.data);
        return response.data;
      });
  },

  /**
   * Get product details
   * @param {String} productId - Product ID
   * @returns {Promise} - API response
   */
  getProduct(productId) {
    console.log('📡 API Request: Get Product', { productId });
    return axios.get(`${API_URL}/products/${productId}`)
      .then(response => {
        console.log('📡 API Response: Get Product', response.data);
        return response.data;
      });
  },

  /**
   * Get ingredient analysis for a product
   * @param {String} productId - Product ID
   * @returns {Promise} - API response
   */
  getIngredientAnalysis(productId) {
    console.log('📡 API Request: Get Ingredient Analysis', { productId });
    return axios.get(`${API_URL}/products/${productId}/ingredient-analysis`)
      .then(response => {
        console.log('📡 API Response: Get Ingredient Analysis', response.data);
        return response.data;
      });
  },

  /**
   * Get all products
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @returns {Promise} - API response
   */
  getProducts(page = 1, limit = 10) {
    console.log('📡 API Request: Get Products', { page, limit });
    return axios.get(`${API_URL}/products?page=${page}&limit=${limit}`)
      .then(response => {
        console.log('📡 API Response: Get Products', response.data);
        return response.data;
      });
  },

  /**
   * Get products for a specific user
   * @param {String} userId - User ID
   * @returns {Promise} - API response
   */
  getUserProducts(userId) {
    console.log('📡 API Request: Get User Products', { userId });
    return axios.get(`${API_URL}/products/user/${userId}`)
      .then(response => {
        console.log('📡 API Response: Get User Products', response.data);
        return response.data;
      });
  },

  /**
   * Get products for a specific user filtered by label
   * @param {String} userId - User ID
   * @param {String} label - Product label/category
   * @returns {Promise} - API response
   */
  getUserProductsByLabel(userId, label) {
    console.log('📡 API Request: Get User Products By Label', { userId, label });
    return axios.get(`${API_URL}/products/user/${userId}/label/${label}`)
      .then(response => {
        console.log('📡 API Response: Get User Products By Label', response.data);
        return response.data;
      });
  },

  /**
   * Delete a product
   * @param {String} productId - Product ID
   * @returns {Promise} - API response
   */
  deleteProduct(productId) {
    console.log('📡 API Request: Delete Product', { productId });
    return axios.delete(`${API_URL}/products/${productId}`)
      .then(response => {
        console.log('📡 API Response: Delete Product', response.data);
        return response.data;
      });
  },

  /**
   * Update product tags
   * @param {String} productId - Product ID
   * @param {Object} updateData - Update data (label)
   * @returns {Promise} - API response
   */
  updateProductTags(productId, updateData) {
    console.log('📡 API Request: Update Product Tags', { productId, updateData });
    return axios.put(`${API_URL}/products/${productId}`, updateData)
      .then(response => {
        console.log('📡 API Response: Update Product Tags', response.data);
        return response.data;
      });
  }
};

export default productApi; 