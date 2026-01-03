import api from '../services/api';

export const getDashboard = async () => {
  const res = await api.get('/dashboard');
  return res.data;
};
