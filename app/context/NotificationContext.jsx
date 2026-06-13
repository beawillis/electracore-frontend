import React, { createContext, useState, useCallback, useEffect } from 'react'; // Context for managing notifications across the app
import socketService from '../services/socketService'; // Service for handling WebSocket connections and subscriptions

export const NotificationContext = createContext(); // Create a context for notifications

// NotificationProvider component to wrap the app and provide notification state and actions

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    socketService.connect();
    socketService.subscribeToAlerts((alert) => {
      addNotification(alert.message || 'New Alert', 'alert', alert);
    });

    return () => {
      socketService.off('alerts:new', null);
    };
  }, []);

  // Function to add a new notification
  const addNotification = useCallback((message, type = 'info', data = null) => {
    const id = Date.now();
    const notification = {
      id,
      message,
      type,
      data,
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [notification, ...prev].slice(0, 50));
    setUnreadCount((prev) => prev + 1);

    return id;
  }, []);

  // Function to remove a notification
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  // Function to mark a notification as read
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Function to mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Function to clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Value to be provided to consuming components
  const value = {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  };

  // Render the provider with the value and children components
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
