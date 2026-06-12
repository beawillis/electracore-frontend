import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket = null;

const socketService = {
  connect: () => {
    if (!socket) {
      socket = io(SOCKET_URL, {
        auth: {
          token: localStorage.getItem('authToken'),
        },
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
    }
  },

  on: (event, callback) => {
    if (!socket) socketService.connect();
    socket.on(event, callback);
  },

  off: (event, callback) => {
    if (socket) socket.off(event, callback);
  },

  emit: (event, data) => {
    if (!socket) socketService.connect();
    socket.emit(event, data);
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
