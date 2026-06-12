import { useQuery } from 'react-query';
import aiService from '../services/aiService';

export const usePredictions = () => {
  const { data, isLoading, error, refetch } = useQuery(
    ['predictions'],
    () => aiService.getPredictions(),
    {
      staleTime: 60000,
      cacheTime: 10 * 60 * 1000,
      refetchInterval: 120000, // Refetch every 2 minutes
    }
  );

  return {
    predictions: data?.data || [],
    loading: isLoading,
    error,
    refetch,
  };
};

export const useFaultPrediction = (transformerId) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['faultPrediction', transformerId],
    () => aiService.getFaultPrediction(transformerId),
    {
      enabled: !!transformerId,
      staleTime: 60000,
      cacheTime: 10 * 60 * 1000,
      refetchInterval: 120000,
    }
  );

  return {
    prediction: data?.data || null,
    loading: isLoading,
    error,
    refetch,
  };
};

export const useHealthScore = (transformerId) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['healthScore', transformerId],
    () => aiService.getHealthScore(transformerId),
    {
      enabled: !!transformerId,
      staleTime: 60000,
      cacheTime: 10 * 60 * 1000,
      refetchInterval: 120000,
    }
  );

  return {
    score: data?.data || null,
    loading: isLoading,
    error,
    refetch,
  };
};

export const useFailureForecast = (transformerId) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['failureForecast', transformerId],
    () => aiService.getFailureForecast(transformerId),
    {
      enabled: !!transformerId,
      staleTime: 60000,
      cacheTime: 10 * 60 * 1000,
      refetchInterval: 120000,
    }
  );

  return {
    forecast: data?.data || null,
    loading: isLoading,
    error,
    refetch,
  };
};

export const useRecommendations = (transformerId) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['recommendations', transformerId],
    () => aiService.getRecommendations(transformerId),
    {
      enabled: !!transformerId,
      staleTime: 60000,
      cacheTime: 10 * 60 * 1000,
      refetchInterval: 120000,
    }
  );

  return {
    recommendations: data?.data || [],
    loading: isLoading,
    error,
    refetch,
  };
};
