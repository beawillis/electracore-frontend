// Role-based constants
export const USER_ROLES = {
  ADMIN: 'admin',
  ENGINEER: 'engineer',
  OPERATOR: 'operator',
  VIEWER: 'viewer',
};

// Alert severity levels
export const ALERT_SEVERITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info',
};

// Transformer status
export const TRANSFORMER_STATUS = {
  HEALTHY: 'healthy',
  WARNING: 'warning',
  CRITICAL: 'critical',
  OFFLINE: 'offline',
  MAINTENANCE: 'maintenance',
};

// Device status
export const DEVICE_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
  MAINTENANCE: 'maintenance',
};

// Sensor types
export const SENSOR_TYPES = {
  TEMPERATURE: 'temperature',
  CURRENT: 'current',
  VOLTAGE: 'voltage',
  HUMIDITY: 'humidity',
  OIL_LEVEL: 'oil_level',
  PRESSURE: 'pressure',
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth',
  DEVICES: '/devices',
  TRANSFORMERS: '/transformers',
  SENSORS: '/sensors',
  ALERTS: '/alerts',
  DASHBOARD: '/dashboard',
  AI: '/ml',
};

// Date formats
export const DATE_FORMATS = {
  FULL_DATE: 'MMM DD, YYYY',
  FULL_DATE_TIME: 'MMM DD, YYYY HH:mm:ss',
  SHORT_DATE: 'MM/DD/YY',
  TIME_ONLY: 'HH:mm:ss',
  ISO_DATE: 'YYYY-MM-DD',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_LIMIT: 100,
  MAX_LIMIT: 1000,
};

// Cache durations (in milliseconds)
export const CACHE_DURATION = {
  SHORT: 5 * 1000, // 5 seconds
  MEDIUM: 30 * 1000, // 30 seconds
  LONG: 5 * 60 * 1000, // 5 minutes
  VERY_LONG: 10 * 60 * 1000, // 10 minutes
};

// Refresh intervals
export const REFRESH_INTERVALS = {
  REAL_TIME: 5000, // 5 seconds
  FREQUENT: 10000, // 10 seconds
  NORMAL: 30000, // 30 seconds
  INFREQUENT: 60000, // 1 minute
  VERY_INFREQUENT: 120000, // 2 minutes
};
