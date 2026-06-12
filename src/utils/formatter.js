// Format temperature
export const formatTemperature = (celsius, unit = 'C') => {
  if (typeof celsius !== 'number') return 'N/A';
  return `${celsius.toFixed(1)}°${unit}`;
};

// Format current
export const formatCurrent = (amperes) => {
  if (typeof amperes !== 'number') return 'N/A';
  return `${amperes.toFixed(2)} A`;
};

// Format voltage
export const formatVoltage = (volts) => {
  if (typeof volts !== 'number') return 'N/A';
  return `${volts.toFixed(0)} V`;
};

// Format percentage
export const formatPercentage = (value) => {
  if (typeof value !== 'number') return 'N/A';
  return `${Math.round(value)}%`;
};

// Format large numbers
export const formatNumber = (num) => {
  if (typeof num !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(num);
};

// Format bytes
export const formatBytes = (bytes) => {
  if (typeof bytes !== 'number') return 'N/A';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

// Format date and time
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};

export const formatTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleTimeString();
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString();
};

// Format relative time
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return formatDate(date);
};

// Format duration
export const formatDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

// Format alert severity with color
export const getSeverityColor = (severity) => {
  const colors = {
    critical: '#dc2626',
    high: '#f97316',
    medium: '#eab308',
    low: '#3b82f6',
    info: '#06b6d4',
  };
  return colors[severity] || '#6b7280';
};

// Format status color
export const getStatusColor = (status) => {
  const colors = {
    healthy: '#22c55e',
    warning: '#eab308',
    critical: '#dc2626',
    offline: '#6b7280',
    connected: '#22c55e',
    disconnected: '#6b7280',
    error: '#dc2626',
  };
  return colors[status] || '#6b7280';
};
