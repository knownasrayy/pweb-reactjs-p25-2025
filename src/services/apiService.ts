import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

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
  sort?: string;
}) => {
  return api.get('/books', { params });
};

export const getGenres = () => {
  return api.get('/genres');
};

export default api;