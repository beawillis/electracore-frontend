import { useQuery } from '@tanstack/react-query';
import transformerService from '../services/transformerService';
import { unwrapData, unwrapList } from '../services/response';

// Custom hooks for fetching transformer data and details using React Query
export const useTransformers = (filters = {}) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['transformers', filters],
    () => transformerService.getAllTransformers(filters),
    {
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      refetchInterval: 60000,
    }
  );

  return {
    transformers: unwrapList(data),
    loading: isLoading,
    error,
    refetch,
  };
};

// Hook to fetch a single transformer by ID
export const useTransformerById = (transformerId) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['transformer', transformerId],
    () => transformerService.getTransformerById(transformerId),
    {
      enabled: !!transformerId,
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      refetchInterval: 60000,
    }
  );

  return {
    transformer: unwrapData(data, null),
    loading: isLoading,
    error,
    refetch,
  };
};

// Hook to fetch transformer health status by ID
export const useTransformerHealth = (transformerId) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['transformerHealth', transformerId],
    () => transformerService.getTransformerHealth(transformerId),
    {
      enabled: !!transformerId,
      staleTime: 10000, // 10 seconds for health updates
      cacheTime: 1 * 60 * 1000,
      refetchInterval: 30000,
    }
  );

  return {
    health: unwrapData(data, null),
    loading: isLoading,
    error,
    refetch,
  };
};

// Hook to fetch transformer analytics for a specific transformer and date range
export const useTransformerAnalytics = (transformerId, dateRange = {}) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['transformerAnalytics', transformerId, dateRange],
    () => transformerService.getTransformerAnalytics(transformerId, dateRange),
    {
      enabled: !!transformerId,
      staleTime: 60000,
      cacheTime: 10 * 60 * 1000,
    }
  );

  return {
    analytics: unwrapData(data, null),
    loading: isLoading,
    error,
    refetch,
  };
};

// Hook to fetch sensors associated with a specific transformer
export const useTransformerSensors = (transformerId) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['transformerSensors', transformerId],
    () => transformerService.getTransformerSensors(transformerId),
    {
      enabled: !!transformerId,
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      refetchInterval: 60000,
    }
  );

  return {
    sensors: unwrapList(data),
    loading: isLoading,
    error,
    refetch,
  };
};
