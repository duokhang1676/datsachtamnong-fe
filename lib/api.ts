import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'Đã có lỗi xảy ra';
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/admin/login';
        }
      }
      
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('Không thể kết nối đến server'));
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

export default api;
