import { axiosWithAuth } from './auth';

const API_URL = 'http://localhost:3000/api/documents';

// Template APIs
export const getTemplates = async () => {
  try {
    const response = await axiosWithAuth.get(`${API_URL}/templates`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const uploadTemplate = async (formData) => {
  try {
    const response = await axiosWithAuth.post(`${API_URL}/templates/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTemplateFields = async (templateId) => {
  try {
    console.log('Fetching fields for template ID:', templateId);
    console.log('API URL:', `${API_URL}/templates/${templateId}/fields`);
    const response = await axiosWithAuth.get(`${API_URL}/templates/${templateId}/fields`);
    console.log('Fields API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching template fields:', error);
    throw error;
  }
};

export const fillTemplate = async (templateId, formData) => {
  try {
    console.log('Filling template ID:', templateId, 'with data:', formData);
    const response = await axiosWithAuth.post(
      `${API_URL}/templates/${templateId}/fill`,
      formData,
      { responseType: 'blob' }
    );
    console.log('Fill template response:', response);
    return response.data;
  } catch (error) {
    console.error('Error filling template:', error);
    throw error;
  }
};

export const downloadTemplate = async (templateId) => {
  try {
    const response = await axiosWithAuth.get(`${API_URL}/templates/${templateId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTemplate = async (templateId) => {
  try {
    const response = await axiosWithAuth.delete(`${API_URL}/templates/${templateId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Signed Document APIs
export const uploadSignedDocument = async (file) => {
  try {
    const formData = new FormData();
    formData.append('signedDocument', file);

    const response = await axiosWithAuth.post(`${API_URL}/signed/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserSignedDocuments = async () => {
  try {
    const response = await axiosWithAuth.get(`${API_URL}/signed/user`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const downloadSignedDocument = async (id) => {
  try {
    const response = await axiosWithAuth.get(`${API_URL}/signed/${id}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};