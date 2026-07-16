export const normalizeSensorReadings = (payload, transformerId = '') => {
  if (!payload) return [];

  const data = payload?.data ?? payload;

  if (Array.isArray(data)) {
    return data.map((item) => ({
      ...item,
      transformerId: item?.transformerId || transformerId,
      sensorType: item?.sensorType || item?.type || item?.name || 'sensor',
      value: item?.value ?? item?.reading ?? item?.measurement,
      unit: item?.unit || inferUnit(item?.sensorType || item?.type || ''),
      timestamp: item?.timestamp || item?.createdAt || item?.updatedAt || new Date().toISOString(),
    }));
  }

  if (data && typeof data === 'object') {
    const normalizedEntries = Object.entries(data).flatMap(([key, value]) => {
      if (value == null) return [];

      if (typeof value === 'object' && !Array.isArray(value)) {
        const readingValue = value?.value ?? value?.reading ?? value?.measurement;
        if (readingValue == null) return [];
        return [{
          id: `${transformerId}-${key}`,
          transformerId,
          sensorType: key,
          value: readingValue,
          unit: value?.unit || inferUnit(key),
          timestamp: value?.timestamp || value?.createdAt || value?.updatedAt || new Date().toISOString(),
        }];
      }

      if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
        const excludedKeys = new Set(['transformerId', 'transformer', 'id', 'timestamp', 'createdAt', 'updatedAt', 'type', 'name']);
        if (excludedKeys.has(key)) return [];
        return [{
          id: `${transformerId}-${key}`,
          transformerId,
          sensorType: key,
          value,
          unit: inferUnit(key),
          timestamp: payload?.timestamp || payload?.createdAt || payload?.updatedAt || new Date().toISOString(),
        }];
      }

      return [];
    });

    return normalizedEntries;
  }

  return [];
};

export const inferUnit = (sensorType = '') => {
  const normalized = String(sensorType).toLowerCase();
  if (normalized.includes('temp')) return '°C';
  if (normalized.includes('current') || normalized.includes('amp')) return 'A';
  if (normalized.includes('voltag')) return 'V';
  if (normalized.includes('hum') || normalized.includes('humidity')) return '%';
  if (normalized.includes('oil')) return 'L';
  return '';
};

export const formatLiveValue = (reading = {}) => {
  const value = reading?.value ?? reading?.reading ?? reading?.measurement;
  if (value == null || value === '') return '-';
  if (typeof value === 'number') {
    const unit = reading?.unit || inferUnit(reading?.sensorType || reading?.type || '');
    return `${value.toFixed(1)}${unit ? ` ${unit}` : ''}`;
  }
  return String(value);
};
