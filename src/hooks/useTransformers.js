import { useQuery } from 'react-query';
import transformerService from '../services/transformerService';

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
    transformers: data?.data || [],
    loading: isLoading,
    error,
    refetch,
  };
};

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
    transformer: data?.data || null,
    loading: isLoading,
    error,
    refetch,
  };
};

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
    health: data?.data || null,
    loading: isLoading,
    error,
    refetch,
  };
};

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
    analytics: data?.data || null,
    loading: isLoading,
    error,
    refetch,
  };
};

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
    sensors: data?.data || [],
    loading: isLoading,
    error,
    refetch,
  };
};
