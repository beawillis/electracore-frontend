import apiClient from './api';

const sensorService = {
  getSensorReadings: async (sensorId, options = {}) => {
    const response = await apiClient.get(`/sensors/${sensorId}/readings`, {
      params: options,
    });
    return response.data;
  },

  getLiveReadings: async (transformerId) => {
    try {
      const response = await apiClient.get(`/sensors/transformer/${transformerId}/live`);
      return response.data;
    } catch (error) {
      // If backend doesn't provide a live endpoint or transformer has no live data,
      // return an empty array instead of letting a 404 bubble up to the UI.
      if (error?.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getHistoricalReadings: async (transformerId, startDate, endDate) => {
    const response = await apiClient.get(
      `/sensors/transformer/${transformerId}/historical`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data;
  },

  getSensorDetails: async (sensorId) => {
    const response = await apiClient.get(`/sensors/${sensorId}`);
    return response.data;
  },

  ingestSensorData: async (sensorData) => {
    const response = await apiClient.post('/sensors/ingest', sensorData);
    return response.data;
  },
};

export default sensorService;
