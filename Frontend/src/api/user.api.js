import api from '../services/api.js';

export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};
