import { axiosWithAuth } from '../auth';
const API_URL = 'http://localhost:3000/api';

export const submitWifiRequest = async (formData) => {
  try {
    const response = await axiosWithAuth.post(`${API_URL}/wifi-requests`, formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting wifi request:', error);
    throw error;
  }
};

export const getMyWifiRequests = async () => {
  try {
    const response = await axiosWithAuth.get(`${API_URL}/wifi-requests/my-requests`);
    if (response.data) {
      return response.data.map(req => ({
        id: req.id,
        formType: 'WIFI_REQUEST',
        formName: 'Wi-Fi Access Request',
        serial_number: req.serial_number,
        status: req.status,
        date: req.date,
        device_type: [
          req.komputer && 'Computer',
          req.laptop && 'Laptop',
          req.handphone && 'Mobile Phone'
        ].filter(Boolean).join(', '),
        mac_address: req.mac,
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
    console.error('Error fetching wifi requests:', error);
    throw error;
  }
};

export const downloadWifiRequestForm = async (submissionId) => {
  try {
    const response = await axiosWithAuth.get(
      `${API_URL}/form/wifi/${submissionId}`,
      { responseType: 'blob' }
    );

    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
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