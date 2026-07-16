export const DEFAULT_BACKEND_URL = 'https://electracore-backend-13oa.onrender.com';

export const getBackendBaseUrl = () =>
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_ROOT_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  process.env.REACT_APP_SOCKET_URL ||
  DEFAULT_BACKEND_URL;

export const getApiBaseUrl = () => {
  const baseUrl = getBackendBaseUrl();
  return process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || `${baseUrl.replace(/\/$/, '')}/api`;
};
