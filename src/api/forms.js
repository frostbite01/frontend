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
        status: req.status,
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

export const downloadFilledDocx = async (submissionId) => {
  try {
    const response = await axiosWithAuth.get(
      `${API_URL}/form/wifi/${submissionId}`,
      { responseType: 'blob' } // 👈 important for binary download
    );

    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `wifi_request_${submissionId}.docx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading DOCX:', error);
    throw error;
  }
};

export const submitCCTVRequest = async (formData) => {
  try {
    const response = await axiosWithAuth.post('/api/cctv-requests', formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitSoftwareRequest = async (formData) => {
  try {
    const response = await axiosWithAuth.post('/api/software-requests', formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};