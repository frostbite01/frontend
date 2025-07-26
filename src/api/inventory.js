import axios from 'axios';
import { axiosWithAuth } from './auth';

const API_URL = 'http://localhost:3000/api/inventory';
const REQUEST_TIMEOUT = 10000; // 10 seconds timeout

// Custom error class for API errors
class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// Helper function for API requests
const apiRequest = async (method, endpoint, data = null, params = null) => {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      timeout: REQUEST_TIMEOUT
    };

    if (data) config.data = data;
    if (params) config.params = params;

    const response = await axiosWithAuth(config);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Use APIError for consistent error handling
    throw new APIError(
      error.response?.data?.message || error.message,
      error.response?.status,
      error.response?.data
    );
  }
};

const categoryEndpoints = {
  switches: '/switches',
  printers: '/printers',
  laptops: '/laptops',
  pcs: '/pcs',
  peripherals: '/peripherals',
  software: '/software',
  'cctv-nvr': '/cctv-nvr',
  routers: '/routers',
  'wireless-devices': '/wireless-devices',
  'access-points': '/access-points'
};

// Get all items
export const getItems = async (category) => {
  try {
    const response = await axiosWithAuth.get(`${API_URL}/${category}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error.response?.data || error;
  }
};

// Get single item
export const getItemById = async (id, category) => {
  try {
    const response = await axiosWithAuth.get(`${API_URL}/${category}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error.response?.data || error;
  }
};

// Create item
export const createItem = async (data, category) => {
  try {
    const response = await axiosWithAuth.post(`${API_URL}/${category}`, data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;  // Make sure to throw the error
  }
};

// Update item
export const updateItem = async (id, data, category) => {
  try {
    const response = await axiosWithAuth.put(`${API_URL}/${category}/${id}`, data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error.response?.data || error;
  }
};

// Delete item
export const deleteItem = async (id, category) => {
  try {
    const response = await axiosWithAuth.delete(`${API_URL}/${category}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error.response?.data || error;
  }
};

// Get items by status
export const getItemsByStatus = async (status, category) => {
  const endpoint = categoryEndpoints[category];
  if (!endpoint) {
    throw new APIError(`Category ${category} not supported`, 400);
  }
  
  try {
    const response = await axiosWithAuth.get(`${API_URL}${endpoint}/status/${status}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new APIError(
      error.response?.data?.message || error.message,
      error.response?.status,
      error.response?.data
    );
  }
};

// Get items by assigned user
export const getItemsByAssignedUser = async (username, category) => {
  const endpoint = categoryEndpoints[category];
  if (!endpoint) {
    throw new APIError(`Category ${category} not supported`, 400);
  }
  return apiRequest('GET', `${endpoint}/assigned/${username}`);
};

// Special routes
export const getSwitchesByVlanSupport = async (supported) => {
  return apiRequest('GET', `/switches/vlan/${supported}`);
};

export const getPrintersByNetworkEnabled = async (enabled) => {
  return apiRequest('GET', `/printers/network/${enabled}`);
};

export const getPeripheralsByType = async (type) => {
  return apiRequest('GET', `/peripherals/type/${type}`);
};

// Get all categories
export const getCategories = async () => {
  return Object.keys(categoryEndpoints);
};

// Get items with full details
export const getItemsWithDetails = async (category) => {
  try {
    const response = await axiosWithAuth.get(`${API_URL}/${category}`);
    const items = response.data;
    
    // Fetch detailed data for each item
    const itemsWithDetails = await Promise.all(
      items.map(async (item) => {
        const detailedItem = await getItemById(item.id, category);
        return detailedItem;
      })
    );
    
    return itemsWithDetails;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};

// Use axios for public endpoints (add this function)
export const getPublicInventoryStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/public/stats`);
    return response.data;
  } catch (error) {
    throw new APIError(
      error.response?.data?.message || error.message,
      error.response?.status,
      error.response?.data
    );
  }
};