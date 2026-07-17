import apiClient from './api';

// Service for interacting with AI/ML endpoints to get predictions, health scores, and recommendations for transformers
const aiService = {
  getPredictions: async () => {
    try {
      const response = await apiClient.get('/ml/predict');
      return response.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getFaultPrediction: async (transformerId) => {
    const response = await apiClient.get(`/ml/fault-prediction/${transformerId}`);
    return response.data;
  },

  getHealthScore: async (transformerId) => {
    const response = await apiClient.get(`/ml/health-score/${transformerId}`);
    return response.data;
  },

  getFailureForecast: async (transformerId) => {
    const response = await apiClient.get(`/ml/forecast/${transformerId}`);
    return response.data;
  },

  getRecommendations: async (transformerId) => {
    const response = await apiClient.get(`/ml/recommendation/${transformerId}`);
    return response.data;
  },

  getAnomalies: async (transformerId, dateRange = {}) => {
    const response = await apiClient.get(`/ml/anomalies/${transformerId}`, {
      params: dateRange,
    });
    return response.data;
  },
};

export default aiService;
