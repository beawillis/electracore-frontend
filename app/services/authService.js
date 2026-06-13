import apiClient from './api'; // Service for handling authentication-related API calls such as login, registration, profile management, and token verification

// Service for handling API calls related to authentication such as login, registration, profile management, and token verification
const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email, password, name, role = 'viewer') => {
    const response = await apiClient.post('/auth/register', { email, password, name, role });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
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
