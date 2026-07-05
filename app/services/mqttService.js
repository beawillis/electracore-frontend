import mqtt from 'mqtt';

const MQTT_URL =
  process.env.NEXT_PUBLIC_MQTT_URL ||
  process.env.REACT_APP_MQTT_URL ||
  '';

let client = null;

const mqttService = {
  connect: (options = {}) => {
    if (!MQTT_URL) {
      console.warn('MQTT URL is not configured. Set NEXT_PUBLIC_MQTT_URL to enable MQTT.');
      return null;
    }

    if (!client) {
      client = mqtt.connect(MQTT_URL, {
        clientId: `web-client-${Date.now()}`,
        reconnectPeriod: 1000,
        keepalive: 60,
        ...options,
      });

      client.on('connect', () => {
        console.log('MQTT connected');
      });

      client.on('error', (error) => {
        console.error('MQTT error:', error);
      });

      client.on('disconnect', () => {
        console.log('MQTT disconnected');
      });
    }
    return client;
  },

  disconnect: () => {
    if (client) {
      client.end();
      client = null;
    }
  },

  publish: (topic, message) => {
    if (!client) mqttService.connect();
    if (!client) return;
    client.publish(topic, JSON.stringify(message), { qos: 1 });
  },

  subscribe: (topic, callback) => {
    if (!client) mqttService.connect();
    if (!client) return;
    client.subscribe(topic, { qos: 1 });
    client.on('message', (receivedTopic, message) => {
      if (receivedTopic === topic) {
        try {
          const data = JSON.parse(message.toString());
          callback(data);
        } catch (error) {
          callback(message.toString());
        }
      }
    });
  },

  unsubscribe: (topic) => {
    if (client) {
      client.unsubscribe(topic);
    }
  },

  subscribeToDeviceStatus: (deviceId, callback) => {
    mqttService.subscribe(`devices/${deviceId}/status`, callback);
  },

  subscribeToSensorData: (transformerId, callback) => {
    mqttService.subscribe(`transformers/${transformerId}/sensors/+`, callback);
  },

  subscribeToAlerts: (callback) => {
    mqttService.subscribe(`alerts/+`, callback);
  },

  getClient: () => client,
};

export default mqttService;
