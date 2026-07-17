import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import sensorService from '../services/sensorService';
import { unwrapData, unwrapList } from '../services/response';
import socketService from '../services/socketService';
import { normalizeSensorReadings } from '../utils/liveTelemetry';

// Custom hooks for fetching sensor data and details using React Query
export const useLiveReadings = (transformerId) => {
  const [liveSocketReadings, setLiveSocketReadings] = useState([]);
  const [liveHistory, setLiveHistory] = useState({});
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

  useEffect(() => {
    if (!transformerId) {
      setLiveSocketReadings([]);
      setLiveHistory({});
      return;
    }

    socketService.subscribeToTransformer(transformerId);

    const appendHistory = (reading) => {
      const sensorType = String(reading.sensorType || reading.type || 'sensor');
      const value = typeof reading.value === 'number' ? reading.value : Number(reading.value) || 0;
      const timestamp = reading.timestamp ? new Date(reading.timestamp).toISOString() : new Date().toISOString();
      setLiveHistory((current) => {
        const existing = current[sensorType] || [];
        const next = [...existing, { timestamp, value, unit: reading.unit || '' }];
        return {
          ...current,
          [sensorType]: next.slice(-20),
        };
      });
    };

    const applyPayload = (payload) => {
      if (!payload) return;
      const normalized = normalizeSensorReadings(payload, transformerId);
      if (!normalized.length) return;

      normalized.forEach((reading) => appendHistory(reading));

      setLiveSocketReadings((current) => {
        const next = [...current];
        normalized.forEach((reading) => {
          const index = next.findIndex((item) => (item.sensorType || item.type) === (reading.sensorType || reading.type));
          if (index >= 0) {
            next[index] = { ...next[index], ...reading };
          } else {
            next.push(reading);
          }
        });
        return next;
      });
    };

    const handleSocketPayload = (payload) => {
      if (!payload) return;
      const payloadTransformerId = payload.transformerId || payload.transformer || payload.id || '';
      if (payloadTransformerId && String(payloadTransformerId) !== String(transformerId)) return;
      const extractedPayload = payload.readings || payload.sensorReadings || payload.data || payload.sensors || payload.telemetry || payload;
      if (extractedPayload && typeof extractedPayload === 'object' && 'readings' in extractedPayload) {
        applyPayload(extractedPayload.readings);
        return;
      }
      applyPayload(extractedPayload);
    };

    const handleTransformerPayload = (payload) => {
      if (!payload) return;
      const payloadTransformerId = payload.transformerId || payload.transformer || payload.id || '';
      if (payloadTransformerId && String(payloadTransformerId) !== String(transformerId)) return;
      const extractedPayload = payload.readings || payload.sensorReadings || payload.data || payload.sensors || payload.telemetry || payload;
      if (extractedPayload && typeof extractedPayload === 'object' && 'readings' in extractedPayload) {
        applyPayload(extractedPayload.readings);
        return;
      }
      applyPayload(extractedPayload);
    };

    const handleGenericUpdate = (payload) => {
      if (!payload) return;
      if (payload?.transformerId && String(payload.transformerId) !== String(transformerId)) return;
      if (payload?.transformer && String(payload.transformer) !== String(transformerId)) return;
      if (payload?.data && typeof payload.data === 'object') {
        applyPayload(payload.data);
      } else if (payload && typeof payload === 'object') {
        applyPayload(payload);
      }
    };

    socketService.on('sensor_reading', handleSocketPayload);
    socketService.on('sensor:reading', handleSocketPayload);
    socketService.on('sensors:update', handleSocketPayload);
    socketService.on('sensor:update', handleSocketPayload);
    socketService.on('transformer:update', handleTransformerPayload);
    socketService.on(`transformer:${transformerId}:update`, handleTransformerPayload);
    socketService.on('telemetry:update', handleGenericUpdate);
    socketService.on('live:update', handleGenericUpdate);
    socketService.on('data:update', handleGenericUpdate);

    return () => {
      socketService.unsubscribeFromTransformer(transformerId);
      socketService.off('sensor_reading', handleSocketPayload);
      socketService.off('sensor:reading', handleSocketPayload);
      socketService.off('sensors:update', handleSocketPayload);
      socketService.off('sensor:update', handleSocketPayload);
      socketService.off('transformer:update', handleTransformerPayload);
      socketService.off(`transformer:${transformerId}:update`, handleTransformerPayload);
      socketService.off('telemetry:update', handleGenericUpdate);
      socketService.off('live:update', handleGenericUpdate);
      socketService.off('data:update', handleGenericUpdate);
    };
  }, [transformerId]);

  const queryReadings = useMemo(() => normalizeSensorReadings(data, transformerId), [data, transformerId]);
  const historySeries = useMemo(() => {
    return Object.entries(liveHistory).map(([sensorType, points]) => ({
      sensorType,
      unit: points[0]?.unit || '',
      data: points.map((point) => ({
        ...point,
        label: new Date(point.timestamp).toLocaleTimeString(),
      })),
    }));
  }, [liveHistory]);

  const mergedReadings = useMemo(() => {
    if (!liveSocketReadings.length) return queryReadings;
    const next = [...queryReadings];
    liveSocketReadings.forEach((reading) => {
      const index = next.findIndex((item) => (item.sensorType || item.type) === (reading.sensorType || reading.type));
      if (index >= 0) {
        next[index] = { ...next[index], ...reading };
      } else {
        next.push(reading);
      }
    });
    return next;
  }, [liveSocketReadings, queryReadings]);

  return {
    readings: mergedReadings,
    loading: isLoading,
    error,
    refetch,
    historySeries,
  };
};

// Hook to fetch historical sensor readings for a specific transformer and date range
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
    readings: normalizeSensorReadings(data, transformerId),
    loading: isLoading,
    error,
    refetch,
  };
};

// Hook to fetch sensor details by sensor ID
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
    sensor: unwrapData(data, null),
    loading: isLoading,
    error,
    refetch,
  };
};
