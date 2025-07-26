import { axiosWithAuth } from './auth';

const API_URL = 'http://localhost:3000/api/users';

export const getAllUsers = async () => {
  try {
    const response = await axiosWithAuth.get(API_URL);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axiosWithAuth.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axiosWithAuth.post(API_URL, userData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axiosWithAuth.put(`${API_URL}/${id}`, userData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axiosWithAuth.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};