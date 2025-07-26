import { axiosWithAuth } from './auth';

const API_URL = 'http://localhost:3000/api';

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axiosWithAuth.post(`${API_URL}/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to upload image' };
  }
};

export const getImageUrl = (filename) => {
  if (!filename) return null;
  return `${API_URL}/uploads/${filename}z`;
};