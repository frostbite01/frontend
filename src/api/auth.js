import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

// You already have axiosWithAuth for authenticated requests
export const axiosWithAuth = axios.create();

axiosWithAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { 
      username, 
      password 
    });
    
    if (response.data?.token && response.data?.user) {
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Configure axios default headers
      axiosWithAuth.defaults.headers.common['Authorization'] = response.data.token;
      
      return {
        success: true,
        user: response.data.user,
        token: response.data.token
      };
    }
    throw new Error('Invalid response format');
  } catch (error) {
    // Clear any stale data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw error.response?.data || error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

export const getCurrentUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user || null;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getUsers = async () => {
  try {
    const response = await axiosWithAuth.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch users' };
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axiosWithAuth.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user' };
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axiosWithAuth.put(`${API_URL}/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update user' };
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axiosWithAuth.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete user' };
  }
};