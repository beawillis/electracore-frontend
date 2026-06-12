import React, { createContext, useEffect, useState } from 'react';
import socketService from '../services/socketService';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [realtimeData, setRealtimeData] = useState({});

  useEffect(() => {
    const socket = socketService.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    socket.on('dashboard:update', (data) => {
      setRealtimeData((prev) => ({
        ...prev,
        dashboard: data,
      }));
    });

    socket.on('transformer:update', (data) => {
      setRealtimeData((prev) => ({
        ...prev,
        transformers: {
          ...prev.transformers,
          [data.id]: data,
        },
      }));
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('dashboard:update');
      socket.off('transformer:update');
    };
  }, []);

  const subscribeToTransformer = (transformerId, callback) => {
    socketService.subscribeToTransformerUpdates(transformerId, callback);
  };

  const value = {
    isConnected,
    realtimeData,
    subscribeToTransformer,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
