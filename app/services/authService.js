import apiClient, { clearStoredAuth } from './api';
import { normalizeAuthPayload, unwrapData } from './response';

// Service for handling API calls related to authentication such as login, registration, profile management, and token verification
const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return normalizeAuthPayload(response.data);
  },

  register: async (name, email, password, role = 'viewer') => {
    // Send object payload matching backend: { name, email, password, role }
    const payload = { name, email, password, role };
    if (typeof window !== 'undefined') {
      console.debug('Register payload:', payload);
    }
    const response = await apiClient.post('/auth/register', payload);
    return normalizeAuthPayload(response.data);
  },

  forgotPassword: async (email) => {
    const payload = { email };
    if (typeof window !== 'undefined') {
      console.debug('Forgot password payload:', payload);
    }
    const response = await apiClient.post('/auth/forgot-password', payload);
    return response.data;
  },

  getGoogleSignupUrl: async () => {
    const response = await apiClient.get('/auth/google');

    const authUrl = response.data?.data?.authUrl || response.data?.authUrl;
    if (!authUrl) {
      throw new Error('Backend did not return a Google auth URL')
    }

    const backendOrigin =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
      process.env.REACT_APP_API_URL?.replace(/\/api\/?$/, '') ||
      process.env.REACT_APP_SOCKET_URL ||
      'https://electracore-backend-production.up.railway.app';

    try {
      const url = new URL(authUrl)
      const normalizedBackendOrigin = String(backendOrigin).replace(/\/$/, '')
      const backendUrl = new URL(normalizedBackendOrigin)

      if (url.hostname === 'localhost' || url.origin !== backendUrl.origin) {
        url.protocol = backendUrl.protocol
        url.host = backendUrl.host
        return url.toString()
      }
    } catch {
      // If the authUrl is not absolute, use backend origin as base.
      return `${backendOrigin.replace(/\/$/, '')}/${authUrl.replace(/^\//, '')}`
    }

    return authUrl
  },

  logout: () => {
    clearStoredAuth();
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return unwrapData(response.data, response.data);
  },

  updateProfile: async (data) => {
    const response = await apiClient.put('/auth/profile', data);
    return unwrapData(response.data, response.data);
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await apiClient.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  verifyToken: async (token) => {
    const response = await apiClient.post('/auth/verify', { token });
    return response.data;
  },
};

export default authService;
