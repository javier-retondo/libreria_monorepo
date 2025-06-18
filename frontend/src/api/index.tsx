import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    const res = response.data;

    if (res.error) {
      return Promise.reject({
        status: res.status,
        message: res.body,
      });
    }
    if (res.pagination) {
      return {
        rows: res.body,
        pagination: res.pagination,
      };
    }
    return res.body;
  },
  (error) => {
    const { response } = error;
    if (!response) {
      return Promise.reject({
        status: 500,
        message: 'Error de conexión con el servidor',
      });
    }

    return Promise.reject({
      status: response.data.status,
      message: response.data.body,
    });
  },
);

export default api;
