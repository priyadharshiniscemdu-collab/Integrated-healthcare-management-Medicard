import api from './axiosConfig';

export const getFinanceData = async (patientId) => {
  const response = await api.get(`/finance/${patientId}`);
  return response.data;
};

export const updateFinanceData = async (patientId, data) => {
  const response = await api.put(`/finance/${patientId}`, data);
  return response.data;
};
