import { axiosWithAuth } from './auth';

const API_URL = 'http://localhost:3000/api';

export const getForms = async () => {
  try {
    const response = await axiosWithAuth.get(`${API_URL}/forms`);
    console.log('Forms API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching forms:', error);
    throw error;
  }
};

export const submitFormData = async (formId, formValues) => {
  try {
    const submissionData = {
      data: Object.entries(formValues)
        .filter(([_, value]) => value !== undefined)
        .map(([id, value]) => ({
          placeholder_id: parseInt(id),
          value: value || ""
        }))
    };
    console.log('Submitting to:', `${API_URL}/forms/${formId}/submissions`);
    console.log('Submission data:', submissionData);
    const response = await axiosWithAuth.post(
      `${API_URL}/forms/${formId}/submissions`,
      submissionData
    );
    return response.data;
  } catch (error) {
    console.error('Form submission error:', error);
    throw error;
  }
};

export const submitWifiRequest = async (formData) => {
  try {
    const response = await axiosWithAuth.post(`${API_URL}/wifi-requests`, formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting wifi request:', error);
    throw error;
  }
};

export const getMyFormSubmissions = async () => {
  try {
    const wifiRequests = await axiosWithAuth.get(`${API_URL}/wifi-requests/my-requests`);
    if (wifiRequests.data) {
      return wifiRequests.data.map(req => ({
        id: req.id,
        formType: 'WIFI_REQUEST',
        formName: 'Wi-Fi Access Request',
        serial_number: req.serial_number,
        status: req.is_verified ? 'Verified' : 'Pending',
        date: req.date,
        // Form specific data
        device_type: [
          req.komputer && 'Computer',
          req.laptop && 'Laptop',
          req.handphone && 'Mobile Phone'
        ].filter(Boolean).join(', '),
        mac_address: req.mac,
        // User data
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
    console.error('Error fetching form submissions:', error);
    throw error;
  }
};