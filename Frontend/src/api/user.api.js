import api from '../services/api.js';

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

export const updateUserProfileByAdmin = async (userId, data) => {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
};
