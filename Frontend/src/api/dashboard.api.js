import api from '../services/api.js';

export const getDashboard = async () => {
  const res = await api.get('/dashboard');
  return res.data;
};
