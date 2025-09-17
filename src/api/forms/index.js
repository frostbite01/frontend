export * from './wifiRequests';
export * from './cctvRequests';
export * from './softwareRequests';

// Keep generic form functions if needed
export const getForms = async () => {
  try {
    const response = await axiosWithAuth.get(`${API_URL}/forms`);
    return response.data;
  } catch (error) {
    console.error('Error fetching forms:', error);
    throw error;
  }
};