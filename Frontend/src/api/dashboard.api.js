import api from '../services/api';

export const getDashboard = async () => {
  const res = await api.get('/dashboard');
  return res.data;
};

export const getAttendanceReport = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const res = await api.get(`/dashboard/attendance-report?${queryParams}`);
  return res.data;
};

export const getSalarySlip = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const res = await api.get(`/dashboard/salary-slip?${queryParams}`);
  return res.data;
};