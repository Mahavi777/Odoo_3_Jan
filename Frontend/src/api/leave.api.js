import api from '../services/api';

// Apply for leave
export const applyForLeave = async (leaveData) => {
  const res = await api.post('/leave', leaveData);
  return res.data;
};

// Get my leaves
export const getMyLeaves = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const res = await api.get(`/leave/me?${queryParams}`);
  return res.data;
};

// Get all leaves (Admin/HR)
export const getAllLeaves = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const res = await api.get(`/leave/all?${queryParams}`);
  return res.data;
};

// Approve leave
export const approveLeave = async (leaveId, comment = '') => {
  const res = await api.put(`/leave/${leaveId}/approve`, { comment });
  return res.data;
};

// Reject leave
export const rejectLeave = async (leaveId, comment) => {
  const res = await api.put(`/leave/${leaveId}/reject`, { comment });
  return res.data;
};

// Cancel leave
export const cancelLeave = async (leaveId) => {
  const res = await api.delete(`/leave/${leaveId}`);
  return res.data;
};

