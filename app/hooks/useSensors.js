import { useQuery } from '@tanstack/react-query';
import sensorService from '../services/sensorService';

export const useLiveReadings = (transformerId) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['liveReadings', transformerId],
    () => sensorService.getLiveReadings(transformerId),
    {
      enabled: !!transformerId,
      staleTime: 5000, // 5 seconds for live data
      cacheTime: 1 * 60 * 1000,
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  );

  return {
    readings: data?.data || [],
    loading: isLoading,
    error,
    refetch,
  };
};

export const useHistoricalReadings = (transformerId, startDate, endDate) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['historicalReadings', transformerId, startDate, endDate],
    () => sensorService.getHistoricalReadings(transformerId, startDate, endDate),
    {
      enabled: !!transformerId && !!startDate && !!endDate,
      staleTime: 60000,
      cacheTime: 10 * 60 * 1000,
    }
  );

  return {
    readings: data?.data || [],
    loading: isLoading,
    error,
    refetch,
  };
};

export const useSensorDetails = (sensorId) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['sensorDetails', sensorId],
    () => sensorService.getSensorDetails(sensorId),
    {
      enabled: !!sensorId,
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      refetchInterval: 60000,
    }
  );

  return {
    sensor: data?.data || null,
    loading: isLoading,
    error,
    refetch,
  };
};
