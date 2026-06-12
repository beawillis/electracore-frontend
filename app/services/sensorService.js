import apiClient from './api';

const sensorService = {
  getSensorReadings: async (sensorId, options = {}) => {
    const response = await apiClient.get(`/sensors/${sensorId}/readings`, {
      params: options,
    });
    return response.data;
  },

  getLiveReadings: async (transformerId) => {
    const response = await apiClient.get(`/sensors/transformer/${transformerId}/live`);
    return response.data;
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
