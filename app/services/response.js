// Some backend endpoints return plain objects while others wrap the value in { data }.
// This helper gives the UI one predictable way to read either shape.
export const unwrapData = (payload, fallback = null) => {
  if (payload == null) return fallback;
  if (Object.prototype.hasOwnProperty.call(payload, 'data')) return payload.data ?? fallback;
  return payload;
};

// Lists can arrive directly or inside common pagination keys such as items/results/docs.
// Hooks use this so pages do not break when an endpoint adds pagination later.
export const unwrapList = (payload) => {
  const data = unwrapData(payload, payload);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.docs)) return data.docs;
  if (Array.isArray(data?.reports)) return data.reports;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.docs)) return payload.docs;
  if (Array.isArray(payload?.reports)) return payload.reports;
  return [];
};

// Prefer an explicit backend count, but fall back to the list length for simple arrays.
export const getCount = (payload, list = []) =>
  payload?.count ?? payload?.total ?? payload?.data?.count ?? payload?.data?.total ?? list.length;

// Auth responses vary by backend framework, so normalize token/user naming once here.
export const normalizeAuthPayload = (payload) => {
  const data = unwrapData(payload, payload) || {};
  const token =
    data.token ||
    data.accessToken ||
    data.access_token ||
    payload?.token ||
    payload?.accessToken ||
    payload?.access_token;
  const user = data.user || data.profile || payload?.user || payload?.profile || data;

  return { ...payload, ...data, token, user };
};
