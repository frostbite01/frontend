import { axiosWithAuth } from '../auth';
const API_URL = 'http://localhost:3000/api';

export const submitSoftwareRequest = async (formData) => {
  try {
    const response = await axiosWithAuth.post(`${API_URL}/software-requests`, formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting software request:', error);
    throw error;
  }
};

export const getMySoftwareRequests = async () => {
  try {
    const response = await axiosWithAuth.get(`${API_URL}/software-requests/my-requests`);
    if (response.data) {
      return response.data.map(req => ({
        id: req.id,
        formType: 'SOFTWARE_REQUEST',
        formName: 'Software Installation Request',
        serial_number: req.serial_number,
        status: req.status,
        date: req.date,
        device_type: [
          req.komputer && 'Computer',
          req.laptop && 'Laptop',
          req.handphone && 'Mobile Phone'
        ].filter(Boolean).join(', '),
        brand: req.brand,
        type: req.type,
        mac: req.mac,
        sn: req.sn,
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
    console.error('Error fetching software requests:', error);
    throw error;
  }
};