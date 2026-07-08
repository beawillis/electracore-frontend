import apiClient from './api';

const transformerService = {
  getAllTransformers: async (filters = {}) => {
    const response = await apiClient.get('/transformers', { params: filters });
    return response.data;
  },

  getTransformerById: async (transformerId) => {
    const response = await apiClient.get(`/transformers/${transformerId}`);
    return response.data;
  },

  registerTransformer: async (transformerData) => {
    const response = await apiClient.post('/transformers/register', transformerData);
    return response.data;
  },

  createTransformer: async (transformerData) => {
    const response = await apiClient.post('/transformers', transformerData);
    return response.data;
  },

  getTransformerHealth: async (transformerId) => {
    const response = await apiClient.get(`/transformers/${transformerId}/health`);
    return response.data;
  },

  getTransformerAnalytics: async (transformerId, dateRange = {}) => {
    const response = await apiClient.get(`/transformers/${transformerId}/analytics`, {
      params: dateRange,
    });
    return response.data;
  },

  getTransformerLocation: async (transformerId) => {
    const response = await apiClient.get(`/transformers/${transformerId}/location`);
    return response.data;
  },

  updateTransformerSettings: async (transformerId, settings) => {
    const response = await apiClient.put(`/transformers/${transformerId}/settings`, settings);
    return response.data;
  },

  getTransformerSensors: async (transformerId) => {
    const response = await apiClient.get(`/transformers/${transformerId}/sensors`);
    return response.data;
  },
};

export default transformerService;
