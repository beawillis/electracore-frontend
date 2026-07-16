import io from 'socket.io-client';
import { API_ROOT_URL, getStoredToken } from './api';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.REACT_APP_SOCKET_URL ||
  API_ROOT_URL;

let socket = null;
let socketAuthToken = null;

const socketService = {
  connect: () => {
    const token = getStoredToken();
    if (socket && socketAuthToken !== token) {
      socket.disconnect();
      socket = null;
      socketAuthToken = null;
    }

    if (!socket) {
      // The backend receives hardware updates and should forward them over Socket.IO.
      // Keeping one shared socket prevents every page or hook from opening its own connection.
      socketAuthToken = token;
      socket = io(SOCKET_URL, {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }
    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      socketAuthToken = null;
    }
  },

  on: (event, callback) => {
    if (!socket) socketService.connect();
    if (!socket || !callback) return;
    socket.on(event, callback);
  },

  off: (event, callback) => {
    if (!socket) return;
    if (callback) {
      socket.off(event, callback);
    } else {
      socket.off(event);
    }
  },

  emit: (event, data) => {
    if (!socket) socketService.connect();
    if (!socket) return;
    socket.emit(event, data);
  },

  subscribeToTransformer: (transformerId) => {
    if (!transformerId) return;
    const activeSocket = socketService.connect();
    if (!activeSocket) return;
    activeSocket.emit(`subscribe_transformer:${transformerId}`);
  },

  unsubscribeFromTransformer: (transformerId) => {
    if (!transformerId) return;
    const activeSocket = socketService.connect();
    if (!activeSocket) return;
    activeSocket.emit(`unsubscribe_transformer:${transformerId}`);
  },

  subscribeToTransformerUpdates: (transformerId, callback) => {
    socketService.on(`transformer:${transformerId}:update`, callback);
  },

  subscribeToAlerts: (callback) => {
    socketService.on('alerts:new', callback);
  },

  subscribeToDashboard: (callback) => {
    socketService.on('dashboard:update', callback);
  },

  getSocket: () => socket,
};

export default socketService;
