import apiClient from './api';

const dashboardService = {
  getStats: async (filters = {}) => {
    const response = await apiClient.get('/dashboard/stats', { params: filters });
    return response.data;
  },

  getAlerts: async () => {
    const response = await apiClient.get('/dashboard/alerts');
    return response.data;
  },

  getHealth: async () => {
    const response = await apiClient.get('/dashboard/health');
    return response.data;
  },

  getSystemStatus: async () => {
    const response = await apiClient.get('/dashboard/system-status');
    return response.data;
  },

  getRecentActivity: async (limit = 50) => {
    const response = await apiClient.get('/dashboard/activity', {
      params: { limit },
    });
    return response.data;
  },

  getTrendData: async (period = '7d') => {
    const response = await apiClient.get('/dashboard/trends', {
      params: { period },
    });
    return response.data;
  },
};

export default dashboardService;
