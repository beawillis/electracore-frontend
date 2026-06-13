import React, { createContext, useEffect, useState } from 'react'; // Context for managing MQTT connection and data across the app
import mqttService from '../services/mqttService'; // Service for handling MQTT connections and subscriptions

export const MQTTContext = createContext(); // Create a context for MQTT

// MQTTProvider component to wrap the app and provide MQTT connection status and data
export const MQTTProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState({});
  const [sensorData, setSensorData] = useState({});

  useEffect(() => {
    const client = mqttService.connect();

    const handleConnect = () => {
      setIsConnected(true);
      console.log('MQTT connected');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('MQTT disconnected');
    };

    // Listen to connection events
    client.on('connect', handleConnect);
    client.on('disconnect', handleDisconnect);

    return () => {
      client.off('connect', handleConnect);
      client.off('disconnect', handleDisconnect);
    };
  }, []);

  // Function to subscribe to device status updates
  const subscribeToDeviceStatus = (deviceId, callback) => {
    mqttService.subscribeToDeviceStatus(deviceId, (data) => {
      setDeviceStatus((prev) => ({
        ...prev,
        [deviceId]: data,
      }));
      if (callback) callback(data);
    });
  };

  // Function to subscribe to sensor data updates
  const subscribeToSensorData = (transformerId, callback) => {
    mqttService.subscribeToSensorData(transformerId, (data) => {
      setSensorData((prev) => ({
        ...prev,
        [transformerId]: data,
      }));
      if (callback) callback(data);
    });
  };

  const value = {
    isConnected,
    deviceStatus,
    sensorData,
    subscribeToDeviceStatus,
    subscribeToSensorData,
  };

  return (
    <MQTTContext.Provider value={value}>
      {children}
    </MQTTContext.Provider>
  );
};
