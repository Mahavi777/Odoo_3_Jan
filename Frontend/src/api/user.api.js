import api from '../services/api';

export const getAllUsers = async () => {
  const response = await api.get('/users/all');
  return response.data;
};

export const getUserProfile = async (userId) => {
  const response = await api.get(`/profile/user/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId, data) => {
  const response = await api.put(`/profile/user/${userId}`, data);
  return response.data;
};
