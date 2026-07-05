import React, { createContext, useEffect, useState } from 'react';// Context for managing WebSocket connection and real-time data across the app
import socketService from '../services/socketService';// Service for handling WebSocket connections and subscriptions

export const SocketContext = createContext(); // Create a context for WebSocket

// SocketProvider component to wrap the app and provide WebSocket connection status and real-time data

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [realtimeData, setRealtimeData] = useState({});

  useEffect(() => {
    const socket = socketService.connect();
    if (!socket) return;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    // Dashboard summaries are pushed when backend aggregate data changes.
    socket.on('dashboard:update', (data) => {
      setRealtimeData((prev) => ({
        ...prev,
        dashboard: data,
      }));
    });

    // Transformer updates carry the latest hardware-backed state for one transformer.
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

  // Function to subscribe to specific transformer updates
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
