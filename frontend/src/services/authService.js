import api from './api';

export const register = async ({ name, email, password }) => {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
};

export const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const sendResetLink = async (email) => {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
};
