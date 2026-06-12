import { useQuery } from '@tanstack/react-query';
import deviceService from '../services/deviceService';

export const useDevices = (filters = {}) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['devices', filters],
    () => deviceService.getAllDevices(filters),
    {
      staleTime: 30000, // 30 seconds
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: 60000, // Refetch every minute
    }
  );

  return {
    devices: data?.data || [],
    loading: isLoading,
    error,
    refetch,
  };
};

export const useDeviceById = (deviceId) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['device', deviceId],
    () => deviceService.getDeviceById(deviceId),
    {
      enabled: !!deviceId,
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      refetchInterval: 60000,
    }
  );

  return {
    device: data?.data || null,
    loading: isLoading,
    error,
    refetch,
  };
};

export const useDeviceStatus = (deviceId) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['deviceStatus', deviceId],
    () => deviceService.getDeviceStatus(deviceId),
    {
      enabled: !!deviceId,
      staleTime: 5000, // 5 seconds for real-time status
      cacheTime: 1 * 60 * 1000,
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  );

  return {
    status: data?.data || null,
    loading: isLoading,
    error,
    refetch,
  };
};

export const useDeviceLogs = (deviceId, limit = 100) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['deviceLogs', deviceId, limit],
    () => deviceService.getDeviceLogs(deviceId, limit),
    {
      enabled: !!deviceId,
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
    }
  );

  return {
    logs: data?.data || [],
    loading: isLoading,
    error,
    refetch,
  };
};
