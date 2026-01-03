import api from '../services/api';

// Authentication endpoints
export const login = async (credentials) => {
  const res = await api.post('/auth/signin', credentials);
  return res;
};

export const signup = async (userData) => {
  const res = await api.post('/auth/signup', userData);
  return res;
};

export const logout = async () => {
  const res = await api.post('/auth/logout');
  return res;
};

// --- existing functions (keep them as they are) ---
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a169e695cae2a4fdb9862d856b7d055369dfae52
export const getProfile = async () => {
  const res = await api.get('/profile/me');
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.put('/profile/me', data);
<<<<<<< HEAD
=======
export const getProfile = async (userId) => {
  const res = await api.get(`/profile/me`);
  return res.data;
};

export const updateProfile = async (userId, data) => {
  const res = await api.put(`/profile/me`, data);
>>>>>>> 15d7ad76538169606f6e8fd4280fd6bd0db3eebe
=======
>>>>>>> a169e695cae2a4fdb9862d856b7d055369dfae52
  return res.data;
};

// --- new Gemini API call ---
export const sendChatMessage = async (message) => {
  const res = await api.post("/ai/chat", { message });
  return res.data;
};
