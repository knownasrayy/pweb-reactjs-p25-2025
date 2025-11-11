import axios from 'axios';
import type { BookFormData } from '../utils/validationSchemas';

const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = (data: unknown) => {
  return api.post('/auth/login', data);
};

export const registerUser = (data: unknown) => {
  return api.post('/auth/register', data);
};

export const getBooks = (params: {
  page?: number;
  search?: string;
  condition?: string;
  sortBy?: string;
  orderBy?: string;
}) => {
  return api.get('/books', { params });
};

export const getGenres = () => {
  return api.get('/genre');
};

export const addBook = (data: BookFormData) => {
  return api.post('/books', data);
};

export const getBookById = (id: string) => {
  return api.get(`/books/${id}`);
};

export const deleteBook = (id: string) => {
  return api.delete(`/books/${id}`);
};

export const createTransaction = (data: { items: { bookId: string; quantity: number }[] }) => {
  return api.post('/transactions', data);
};

export const getTransactions = (params: {
  page?: number;
  search?: string;
  sortBy?: string;
  orderBy?: string;
}) => {
  return api.get('/transactions', { params });
};

export const getTransactionById = (id: string) => {
  return api.get(`/transactions/${id}`);
};

export const getStats = () => {
  return api.get('/stats');
};

export const getMe = () => {
  return api.get('/auth/me');
};

export default api;