import apiClient from './api';

const deviceService = {
  getAllDevices: async (filters = {}) => {
    const response = await apiClient.get('/devices', { params: filters });
    return response.data;
  },

  getDeviceById: async (deviceId) => {
    const response = await apiClient.get(`/devices/${deviceId}`);
    return response.data;
  },

  registerDevice: async (deviceData) => {
    const response = await apiClient.post('/devices/register', deviceData);
    return response.data;
  },

  updateDevice: async (deviceId, deviceData) => {
    const response = await apiClient.put(`/devices/${deviceId}`, deviceData);
    return response.data;
  },

  deleteDevice: async (deviceId) => {
    const response = await apiClient.delete(`/devices/${deviceId}`);
    return response.data;
  },

  getDeviceStatus: async (deviceId) => {
    const response = await apiClient.get(`/devices/${deviceId}/status`);
    return response.data;
  },

  getDeviceLogs: async (deviceId, limit = 100) => {
    const response = await apiClient.get(`/devices/${deviceId}/logs`, {
      params: { limit },
    });
    return response.data;
  },
};

export default deviceService;
