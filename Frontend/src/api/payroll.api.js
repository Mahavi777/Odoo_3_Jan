import api from '../services/api';

// Get my payroll (read-only for employees)
export const getMyPayroll = async () => {
  const res = await api.get('/payroll/me');
  return res.data;
};

// Get all payrolls (Admin/HR)
export const getAllPayrolls = async () => {
  const res = await api.get('/payroll/all');
  return res.data;
};

// Get user payroll (Admin/HR)
export const getUserPayroll = async (userId) => {
  const res = await api.get(`/payroll/user/${userId}`);
  return res.data;
};

// Create payroll (Admin/HR)
export const createPayroll = async (payrollData) => {
  const res = await api.post('/payroll', payrollData);
  return res.data;
};

// Update payroll (Admin/HR)
export const updatePayroll = async (payrollId, payrollData) => {
  const res = await api.put(`/payroll/${payrollId}`, payrollData);
  return res.data;
};

// Update payroll by user ID (Admin/HR)
export const updatePayrollByUserId = async (userId, payrollData) => {
  const res = await api.put(`/payroll/user/${userId}`, payrollData);
  return res.data;
};

