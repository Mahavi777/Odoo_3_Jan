import api from '../services/api.js';

export const createSalaryStructure = async (data) => {
  const response = await api.post('/salary', data);
  return response.data;
};

export const updateSalaryStructure = async (userId, data) => {
  const response = await api.put(`/salary/${userId}`, data);
  return response.data;
};

export const getSalaryStructure = async (userId) => {
  const response = await api.get(`/salary/${userId}`);
  return response.data;
};
