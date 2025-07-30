import api from './api';

export const fetchTransactions = async () => {
  const res = await api.get('/transactions');
  return res.data;
};

export const createTransaction = async (payload) => {
  const res = await api.post('/transactions', payload);
  return res.data;
};

export const updateTransaction = async (id, payload) => {
  const res = await api.put(`/transactions/${id}`, payload);
  return res.data;
};

export const deleteTransaction = async (id) => {
  const res = await api.delete(`/transactions/${id}`);
  return res.data;
};

export const fetchMonthlySummary = async () => {
  const res = await api.get('/transactions/monthly-summary');
  return res.data;
};

