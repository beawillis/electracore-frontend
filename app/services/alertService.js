import apiClient from './api';

// Service for interacting with alert-related endpoints to fetch alerts, acknowledge them, and resolve them
const alertService = {
  getAllAlerts: async (filters = {}) => {
    try {
      const response = await apiClient.get('/alerts', { params: filters });
      return response.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getActiveAlerts: async () => {
    try {
      const response = await apiClient.get('/alerts/active');
      return response.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getAlertHistory: async (limit = 100) => {
    const response = await apiClient.get('/alerts/history', {
      params: { limit },
    });
    return response.data;
  },

  getAlertById: async (alertId) => {
    const response = await apiClient.get(`/alerts/${alertId}`);
    return response.data;
  },

  acknowledgeAlert: async (alertId) => {
    const response = await apiClient.put(`/alerts/${alertId}/acknowledge`);
    return response.data;
  },

  resolveAlert: async (alertId, resolutionData) => {
    const response = await apiClient.put(`/alerts/${alertId}/resolve`, resolutionData);
    return response.data;
  },

  getNotificationLogs: async (limit = 100) => {
    const response = await apiClient.get('/alerts/notifications', {
      params: { limit },
    });
    return response.data;
  },
};

export default alertService;
