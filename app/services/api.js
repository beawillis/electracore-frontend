import axios from 'axios';

export const API_ROOT_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_ROOT_URL ||
  process.env.REACT_APP_SOCKET_URL ||
  'https://electracore-backend-13oa.onrender.com';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.REACT_APP_API_URL ||
  `${API_ROOT_URL.replace(/\/$/, '')}/api`;

if (typeof window !== 'undefined') {
  console.log('Resolved API_BASE_URL:', API_BASE_URL);
}

export const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken') || localStorage.getItem('token');
};

export const clearStoredAuth = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Create an Axios instance with default configuration for API requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT || process.env.REACT_APP_API_TIMEOUT || 15000),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (typeof window !== 'undefined') {
    try {
      // Log outgoing requests for debugging payload/URL issues
      console.debug('API Request:', {
        method: config.method,
        baseURL: config.baseURL,
        url: config.url,
        data: config.data,
        params: config.params,
      });
    } catch (e) {
      // ignore logging errors
    }
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      clearStoredAuth();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
