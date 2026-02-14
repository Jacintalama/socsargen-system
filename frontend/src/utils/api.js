import axios from 'axios';

// Create axios instance with base config
// Use current hostname for LAN access
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const hostname = window.location.hostname;
  const port = window.location.port;
  // If served from same origin (production/ngrok), use relative URL
  if (port !== '5173' && port !== '5174') {
    return '/api';
  }
  return `http://${hostname}:5000/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
  timeout: 10000
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.code;
      const errorMessage = error.response?.data?.error;

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        // Show alert for session replaced
        if (errorCode === 'SESSION_REPLACED') {
          alert('Your session has ended because you logged in from another device.');
        }
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
