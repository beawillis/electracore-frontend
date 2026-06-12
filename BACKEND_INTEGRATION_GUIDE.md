# ElectraCore Frontend - Backend Integration Guide

## Overview

The ElectraCore Frontend is now ready with all core services, context providers, and custom hooks. This guide explains how to connect your backend to this frontend infrastructure.

## Project Structure

```
src/
├── services/          # Backend API communication
│   ├── api.js         # Axios instance with interceptors
│   ├── authService.js
│   ├── deviceService.js
│   ├── transformerService.js
│   ├── sensorService.js
│   ├── alertService.js
│   ├── dashboardService.js
│   ├── aiService.js
│   ├── socketService.js
│   └── mqttService.js
├── context/           # Global state management
│   ├── AuthContext.jsx
│   ├── NotificationContext.jsx
│   ├── SocketContext.jsx
│   └── MQTTContext.jsx
├── hooks/             # Custom React hooks
│   ├── useAuth.js
│   ├── useDevices.js
│   ├── useTransformers.js
│   ├── useSensors.js
│   ├── useAlerts.js
│   └── usePredictions.js
└── utils/             # Utilities
    ├── constants.js
    └── formatter.js
```

## Environment Configuration

Create a `.env.local` file in your project root:

```env
# Backend API
REACT_APP_API_URL=http://localhost:5000/api

# Real-time Communication
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_MQTT_URL=ws://localhost:8080

# Optional: API timeouts
REACT_APP_API_TIMEOUT=10000
```

## Backend API Endpoints Required

### Authentication (`/api/auth/`)
- `POST /login` - User login
- `POST /register` - User registration
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /change-password` - Change password
- `POST /verify` - Verify token

### Devices (`/api/devices/`)
- `GET /` - List all devices
- `POST /register` - Register new device
- `GET /:id` - Get device details
- `PUT /:id` - Update device
- `DELETE /:id` - Delete device
- `GET /:id/status` - Get device status
- `GET /:id/logs` - Get device logs

### Transformers (`/api/transformers/`)
- `GET /` - List all transformers
- `GET /:id` - Get transformer details
- `GET /:id/health` - Get transformer health
- `GET /:id/analytics` - Get analytics data
- `GET /:id/location` - Get transformer location
- `GET /:id/sensors` - Get linked sensors
- `PUT /:id/settings` - Update settings

### Sensors (`/api/sensors/`)
- `GET /:id/readings` - Get sensor readings
- `GET /transformer/:id/live` - Get live readings
- `GET /transformer/:id/historical` - Get historical data
- `GET /:id` - Get sensor details
- `POST /ingest` - Ingest new sensor data

### Alerts (`/api/alerts/`)
- `GET /` - List all alerts
- `GET /active` - Get active alerts
- `GET /history` - Get alert history
- `GET /:id` - Get alert details
- `PUT /:id/acknowledge` - Acknowledge alert
- `PUT /:id/resolve` - Resolve alert
- `GET /notifications` - Get notification logs

### Dashboard (`/api/dashboard/`)
- `GET /stats` - Get system statistics
- `GET /alerts` - Get recent alerts
- `GET /health` - Get system health
- `GET /system-status` - Get system status
- `GET /activity` - Get recent activity
- `GET /trends` - Get trend data

### AI/ML (`/api/ml/`)
- `GET /predict` - Get all predictions
- `GET /fault-prediction/:id` - Get fault prediction
- `GET /health-score/:id` - Get health score
- `GET /forecast/:id` - Get failure forecast
- `GET /recommendation/:id` - Get recommendations
- `GET /anomalies/:id` - Get detected anomalies

## Real-Time Communication Setup

### Socket.IO Events Expected

**To Client (Server sends):**
- `dashboard:update` - Dashboard statistics update
- `transformer:update` - Transformer data update
- `transformer:{id}:update` - Specific transformer update
- `alerts:new` - New alert received

**From Client (Frontend sends):**
- `subscribe_transformer:{id}` - Subscribe to transformer updates
- `unsubscribe_transformer:{id}` - Unsubscribe from updates

### MQTT Topics

**Device Status:**
- `devices/{deviceId}/status` - Device online/offline status

**Sensor Data:**
- `transformers/{transformerId}/sensors/temperature` - Temperature readings
- `transformers/{transformerId}/sensors/current` - Current readings
- `transformers/{transformerId}/sensors/voltage` - Voltage readings
- `transformers/{transformerId}/sensors/humidity` - Humidity readings
- `transformers/{transformerId}/sensors/oil_level` - Oil level readings

**Alerts:**
- `alerts/critical` - Critical alerts
- `alerts/high` - High severity alerts
- `alerts/medium` - Medium severity alerts

## Response Data Formats

### User Object
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "User Name",
  "role": "admin|engineer|operator|viewer",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Device Object
```json
{
  "id": "uuid",
  "name": "Device Name",
  "type": "esp32",
  "status": "connected|disconnected|error",
  "transformerId": "uuid",
  "lastSeen": "2024-01-01T00:00:00Z",
  "batteryLevel": 85,
  "firmwareVersion": "1.0.0"
}
```

### Transformer Object
```json
{
  "id": "uuid",
  "name": "Transformer Name",
  "location": "Location Name",
  "status": "healthy|warning|critical|offline",
  "healthScore": 85,
  "coordinates": { "lat": 0, "lng": 0 },
  "devices": ["deviceId1", "deviceId2"],
  "lastUpdated": "2024-01-01T00:00:00Z"
}
```

### Sensor Reading Object
```json
{
  "id": "uuid",
  "sensorType": "temperature|current|voltage|humidity|oil_level",
  "value": 65.5,
  "unit": "°C",
  "timestamp": "2024-01-01T00:00:00Z",
  "transformerId": "uuid"
}
```

### Alert Object
```json
{
  "id": "uuid",
  "title": "High Temperature Alert",
  "message": "Transformer temperature exceeded threshold",
  "severity": "critical|high|medium|low",
  "status": "active|acknowledged|resolved",
  "transformerId": "uuid",
  "createdAt": "2024-01-01T00:00:00Z",
  "acknowledgedAt": null,
  "resolvedAt": null
}
```

## Authentication Flow

1. User submits login form
2. Frontend calls `authService.login(email, password)`
3. Backend returns JWT token + user object
4. Frontend stores token in localStorage
5. All API requests automatically include token in Authorization header
6. On 401 response, frontend clears token and redirects to login

## Next Steps

1. **Build the backend API** following the endpoints listed above
2. **Configure environment variables** in `.env.local`
3. **Test API connectivity** with the frontend services
4. **Implement Socket.IO** for real-time updates
5. **Setup MQTT broker** for sensor data streaming
6. **Create authentication** endpoints first
7. **Build dashboard** with API data integration
8. **Add device and transformer** management pages
9. **Implement sensor monitoring** and alerts
10. **Deploy both frontend and backend** to production

## Testing the Integration

### 1. Test API Connection
```javascript
import apiClient from './src/services/api';

// Test without auth
apiClient.get('/health').then(res => console.log('API OK', res.data));
```

### 2. Test Authentication
```javascript
import authService from './src/services/authService';

authService.login('test@example.com', 'password')
  .then(res => console.log('Login successful', res))
  .catch(err => console.error('Login failed', err));
```

### 3. Test Real-Time Communication
```javascript
import socketService from './src/services/socketService';

socketService.connect();
socketService.subscribeToAlerts((alert) => {
  console.log('New alert:', alert);
});
```

## Common Errors & Solutions

**"Cannot connect to API"**
- Check `REACT_APP_API_URL` environment variable
- Ensure backend is running
- Check CORS configuration on backend

**"Token not found"**
- Login first to get token
- Token stored in localStorage with key `authToken`

**"Socket.IO connection failed"**
- Check `REACT_APP_SOCKET_URL`
- Ensure Socket.IO is enabled on backend
- Check firewall/CORS settings

**"MQTT connection failed"**
- Check `REACT_APP_MQTT_URL`
- Ensure MQTT broker is running
- Verify WebSocket support in MQTT broker

## Support

For issues or questions about the frontend architecture, refer to the component documentation and service implementations in the `src/` directory.
