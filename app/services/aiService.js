import apiClient from './api';

const aiService = {
  getPredictions: async () => {
    const response = await apiClient.get('/ml/predict');
    return response.data;
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
