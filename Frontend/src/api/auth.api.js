import api from '../services/api.js';

// Authentication endpoints
export const login = async (credentials) => {
  return api.post('/auth/signin', credentials);
};

export const signup = async (userData) => {
  return api.post('/auth/signup', userData);
};

export const logout = async () => {
  return api.post('/auth/logout');
};

// Profile helpers
export const getProfile = async () => {
  const res = await api.get('/profile/me');
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.put('/profile/me', data);
  return res.data;
};

<<<<<<< HEAD
<<<<<<< HEAD
// AI chat
=======
=======
>>>>>>> fef2fa6dc53e6a4f9fa89866abed50397b505877
export const updatePersonalInfo = async (data) => {
  const res = await api.put('/profile/me/personal', data);
  return res.data;
};

<<<<<<< HEAD
// --- new Gemini API call ---
>>>>>>> 671ca5dd7e29650f2df2e7d4b72449c8de40e9af
=======
// AI chat
>>>>>>> fef2fa6dc53e6a4f9fa89866abed50397b505877
export const sendChatMessage = async (message) => {
  const res = await api.post('/ai/chat', { message });
  return res.data;
};
