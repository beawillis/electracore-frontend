import { useQuery } from '@tanstack/react-query';
import aiService from '../services/aiService';
import { unwrapData, unwrapList } from '../services/response';

// Custom hooks for fetching AI predictions and recommendations using React Query
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
    predictions: unwrapList(data),
    loading: isLoading,
    error,
    refetch,
  };
};

// Hook to fetch fault prediction for a specific transformer
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
    prediction: unwrapData(data, null),
    loading: isLoading,
    error,
    refetch,
  };
};

// Hook to fetch maintenance recommendations for a specific transformer
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
    score: unwrapData(data, null),
    loading: isLoading,
    error,
    refetch,
  };
};

// Hook to fetch failure forecast for a specific transformer
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
    forecast: unwrapData(data, null),
    loading: isLoading,
    error,
    refetch,
  };
};

// Hook to fetch maintenance recommendations for a specific transformer
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
    recommendations: unwrapList(data),
    loading: isLoading,
    error,
    refetch,
  };
};
