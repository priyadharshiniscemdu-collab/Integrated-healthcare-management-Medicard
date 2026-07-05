import api from './axiosConfig';

export const getMedicalData = async (patientId) => {
  const response = await api.get(`/medical/${patientId}`);
  return response.data;
};

export const updateMedicalData = async (patientId, data) => {
  const response = await api.put(`/medical/${patientId}`, data);
  return response.data;
};
