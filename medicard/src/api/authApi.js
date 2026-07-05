import api from './axiosConfig';

export const scanCard = async (cardId) => {
  const response = await api.post('/auth/scan-card', { cardId });
  return response.data;
};

export const loginFingerprint = async (cardId, fingerprintTemplate) => {
  const response = await api.post('/auth/fingerprint', { cardId, fingerprintTemplate });
  return response.data;
};

export const loginPIN = async (cardId, pin) => {
  const response = await api.post('/auth/pin', { cardId, pin });
  return response.data;
};

export const emergencyAccess = async (cardId) => {
  // Uses a different base URL since emergency is not strictly an auth endpoint in the API
  const response = await api.get(`/emergency/${cardId}`);
  return response.data;
};
