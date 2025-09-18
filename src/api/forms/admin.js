import { axiosWithAuth } from '../auth';
const API_URL = 'http://localhost:3000/api';

export const getAllFormSubmissions = async (formType) => {
  try {
    const response = await axiosWithAuth.get(`${API_URL}/admin/submissions/${formType}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all submissions:', error);
    throw error;
  }
};

export const updateSubmissionStatus = async (submissionId, status) => {
  try {
    const response = await axiosWithAuth.patch(
      `${API_URL}/admin/submissions/${submissionId}/status`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating submission status:', error);
    throw error;
  }
};