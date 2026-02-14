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
  timeout: 10000,
  withCredentials: true // Send HttpOnly cookies for refresh tokens
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

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Handle response errors with automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - try to refresh token first
    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorCode = error.response?.data?.code;

      // If session was replaced, don't try to refresh - just logout
      if (errorCode === 'SESSION_REPLACED') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          alert('Your session has ended because you logged in from another device.');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const { data } = await api.post('/auth/refresh');
        const newToken = data.token;

        localStorage.setItem('token', newToken);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Process queued requests
        processQueue(null, newToken);

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - force logout
        processQueue(refreshError, null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
