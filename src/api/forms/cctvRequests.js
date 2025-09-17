import { axiosWithAuth } from '../auth';
const API_URL = 'http://localhost:3000/api';

export const submitCCTVRequest = async (formData) => {
  try {
    const response = await axiosWithAuth.post(`${API_URL}/cctv-requests`, formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting CCTV request:', error);
    throw error;
  }
};

export const getMyCCTVRequests = async () => {
  try {
    const response = await axiosWithAuth.get(`${API_URL}/cctv-requests/my-requests`);
    if (response.data) {
      return response.data.map(req => ({
        id: req.id,
        formType: 'CCTV_REQUEST',
        formName: 'CCTV Access Request',
        serial_number: req.serial_number,
        status: req.status,
        date: req.date,
        device_type: [
          req.komputer && 'Computer',
          req.laptop && 'Laptop',
          req.handphone && 'Mobile Phone'
        ].filter(Boolean).join(', '),
        submitter: {
          name: req.submitter?.name,
          email: req.submitter?.email,
          role: req.submitter?.role,
          employeeId: req.submitter?.employeeId,
          department: req.submitter?.department,
          position: req.submitter?.position
        }
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching CCTV requests:', error);
    throw error;
  }
};