import { useQuery } from '@tanstack/react-query'; // Custom hooks for fetching alerts and notification logs using React Query
import alertService from '../services/alertService'; // Service for handling API calls related to alerts and notifications


// Hook to fetch all alerts with optional filters
export const useAlerts = (filters = {}) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['alerts', filters],
    () => alertService.getAllAlerts(filters),
    {
      staleTime: 10000,
      cacheTime: 5 * 60 * 1000,
      refetchInterval: 30000,
    }
  );

  return {
    alerts: data?.data || [],
    loading: isLoading,
    error,
    refetch,
  };
};

// Hook to fetch active alerts with real-time updates
export const useActiveAlerts = () => {
  const { data, isLoading, error, refetch } = useQuery(
    ['activeAlerts'],
    () => alertService.getActiveAlerts(),
    {
      staleTime: 5000,
      cacheTime: 1 * 60 * 1000,
      refetchInterval: 15000, // Refetch every 15 seconds
    }
  );

  return {
    alerts: data?.data || [],
    count: data?.count || 0,
    loading: isLoading,
    error,
    refetch,
  };
};
 
// Hook to fetch alert history with pagination support
export const useAlertHistory = (limit = 100) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['alertHistory', limit],
    () => alertService.getAlertHistory(limit),
    {
      staleTime: 30000,
      cacheTime: 10 * 60 * 1000,
    }
  );

  return {
    history: data?.data || [],
    loading: isLoading,
    error,
    refetch,
  };
};

// Hook to fetch notification logs with pagination support
export const useNotificationLogs = (limit = 100) => {
  const { data, isLoading, error, refetch } = useQuery(
    ['notificationLogs', limit],
    () => alertService.getNotificationLogs(limit),
    {
      staleTime: 30000,
      cacheTime: 10 * 60 * 1000,
    }
  );

  return {
    logs: data?.data || [],
    loading: isLoading,
    error,
    refetch,
  };
};
