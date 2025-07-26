import { axiosWithAuth } from './auth';

const API_URL = 'http://localhost:3000/api/tasks';

// Use axiosWithAuth directly for all task endpoints
export const getAllTasks = async () => {
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

export const getTasksByStatus = async (status) => {
  try {
    const response = await axiosWithAuth.get(`${API_URL}/status/${status}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const getTaskById = async (id) => {
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

export const createTask = async (taskData) => {
  try {
    const response = await axiosWithAuth.post(API_URL, taskData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const response = await axiosWithAuth.put(`${API_URL}/${id}`, taskData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const deleteTask = async (id) => {
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

// Helper method to format task data
export const formatTaskData = (task) => ({
  ...task,
  status: task.status.charAt(0).toUpperCase() + task.status.slice(1),
  dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null,
  assignee: task.assignee ? {
    id: task.assignee.id,
    username: task.assignee.username,
    email: task.assignee.email
  } : null,
  creator: task.creator ? {
    id: task.creator.id,
    username: task.creator.username,
    email: task.creator.email
  } : null
});