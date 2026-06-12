# ElectraCore Frontend - Complete Implementation Guide

## Project Overview

The **ElectraCore Frontend** is a professional-grade React/Next.js application for AI-powered transformer monitoring and protection. It features real-time data visualization, device management, sensor monitoring, alerts, and predictive maintenance powered by machine learning.

---

## Architecture Overview

### Core Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: Tailwind CSS with custom dark theme
- **State Management**: React Query (data), Zustand (app state), Context API (auth)
- **Real-Time**: Socket.IO + MQTT
- **Forms**: React Hook Form + Yup validation
- **Charts**: Recharts
- **API Client**: Axios with automatic token injection

### Project Structure

```
src/
├── services/              # Backend API clients
│   ├── api.js            # Axios instance with auth
│   ├── authService.js
│   ├── deviceService.js
│   ├── transformerService.js
│   ├── sensorService.js
│   ├── alertService.js
│   ├── dashboardService.js
│   ├── aiService.js
│   ├── socketService.js
│   └── mqttService.js
│
├── context/              # Global state (React Context)
│   ├── AuthContext.jsx   # Authentication & user state
│   ├── NotificationContext.jsx
│   ├── SocketContext.jsx
│   └── MQTTContext.jsx
│
├── hooks/                # Custom React hooks
│   ├── useAuth.js
│   ├── useDevices.js
│   ├── useTransformers.js
│   ├── useSensors.js
│   ├── useAlerts.js
│   └── usePredictions.js
│
├── components/
│   ├── auth/             # Authentication components
│   │   └── ProtectedRoute.tsx
│   ├── layout/           # Layout components
│   │   └── Sidebar.tsx
│   ├── dashboard/        # Dashboard components
│   │   ├── DashboardOverview.tsx
│   │   └── DashboardCharts.tsx
│   └── ui/               # Reusable UI components
│       ├── button.tsx
│       └── skeleton.tsx
│
├── utils/
│   ├── constants.js      # App constants & enums
│   ├── formatter.js      # Data formatting utilities
│   └── dateUtils.js
│
└── app/                  # Next.js app routes
    ├── layout.tsx
    ├── providers.tsx     # Context providers wrapper
    ├── page.tsx          # Root redirect
    ├── login/page.tsx
    ├── register/page.tsx
    ├── dashboard/page.tsx
    ├── transformers/page.tsx
    ├── devices/page.tsx
    ├── sensors/page.tsx
    ├── alerts/page.tsx
    ├── predictions/page.tsx
    ├── reports/page.tsx
    └── settings/page.tsx
```

---

## Pages & Features

### 1. **Authentication** (`/login`, `/register`)
- Email/password authentication
- Form validation with error handling
- Automatic token storage in localStorage
- Protected route middleware
- Session persistence

### 2. **Dashboard** (`/dashboard`)
- Real-time system statistics
- Transformer and device monitoring
- Alert summary with severity levels
- Chart visualizations:
  - Temperature trends
  - Load distribution
  - System health score
  - Alert trends over time

### 3. **Transformers** (`/transformers`)
- List all transformers with search
- Individual transformer details
- Health score with progress bar
- Linked devices display
- Last updated timestamps
- Status indicators (healthy, warning, critical)

### 4. **Devices** (`/devices`)
- Device inventory management
- Battery level monitoring
- Device status (connected, disconnected, error)
- Firmware version tracking
- Transformer linking
- Last seen information

### 5. **Sensors** (`/sensors`)
- Real-time sensor readings
- Multi-sensor support:
  - Temperature (°C)
  - Current (Amperes)
  - Voltage (Volts)
  - Humidity (%)
  - Oil level
  - Pressure
- Live data updates

### 6. **Alerts** (`/alerts`)
- Active alert filtering
- Alert severity levels (critical, high, medium, low)
- Alert status tracking (active, acknowledged, resolved)
- Detailed alert information
- Timestamps and context

### 7. **AI Predictions** (`/predictions`)
- Fault prediction analysis
- Health score assessment
- Remaining useful life forecasts
- Maintenance recommendations
- Anomaly detection

### 8. **Reports** (`/reports`)
- System performance reports
- Transformer health analytics
- Alert trend analysis
- Maintenance log tracking
- Predictive maintenance insights

### 9. **Settings** (`/settings`)
- Profile management
- Notification preferences
- API configuration display
- Account security options
- Two-factor authentication

---

## Environment Configuration

Create `.env.local` in the project root:

```env
# Backend API
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_TIMEOUT=10000

# Real-time Communication
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_MQTT_URL=ws://localhost:8080

# Optional: Debug mode
REACT_APP_DEBUG=false
```

---

## Backend API Requirements

### Authentication Endpoints
```
POST   /api/auth/login              → { token, user }
POST   /api/auth/register           → { token, user }
GET    /api/auth/profile            → { user }
PUT    /api/auth/profile            → { user }
POST   /api/auth/change-password    → { success }
POST   /api/auth/verify             → { valid }
```

### Device Management
```
GET    /api/devices                 → { data: Device[] }
POST   /api/devices/register        → { data: Device }
GET    /api/devices/:id             → { data: Device }
PUT    /api/devices/:id             → { data: Device }
DELETE /api/devices/:id             → { success }
GET    /api/devices/:id/status      → { data: Status }
GET    /api/devices/:id/logs        → { data: Log[] }
```

### Transformer Management
```
GET    /api/transformers            → { data: Transformer[] }
GET    /api/transformers/:id        → { data: Transformer }
GET    /api/transformers/:id/health → { data: Health }
GET    /api/transformers/:id/analytics → { data: Analytics }
GET    /api/transformers/:id/sensors → { data: Sensor[] }
PUT    /api/transformers/:id/settings → { data: Transformer }
```

### Sensor Data
```
GET    /api/sensors/:id/readings    → { data: Reading[] }
GET    /api/sensors/transformer/:id/live → { data: Reading[] }
GET    /api/sensors/transformer/:id/historical → { data: Reading[] }
POST   /api/sensors/ingest          → { success }
```

### Alerts & Notifications
```
GET    /api/alerts                  → { data: Alert[] }
GET    /api/alerts/active           → { data: Alert[] }
GET    /api/alerts/history          → { data: Alert[] }
PUT    /api/alerts/:id/acknowledge  → { data: Alert }
PUT    /api/alerts/:id/resolve      → { data: Alert }
GET    /api/alerts/notifications    → { data: Notification[] }
```

### Dashboard & Analytics
```
GET    /api/dashboard/stats         → { data: Stats }
GET    /api/dashboard/alerts        → { data: Alerts }
GET    /api/dashboard/health        → { data: Health }
GET    /api/dashboard/system-status → { data: Status }
GET    /api/dashboard/activity      → { data: Activity[] }
GET    /api/dashboard/trends        → { data: Trends }
```

### AI/ML Predictions
```
GET    /api/ml/predict              → { data: Prediction[] }
GET    /api/ml/fault-prediction/:id → { data: Prediction }
GET    /api/ml/health-score/:id     → { data: Score }
GET    /api/ml/forecast/:id         → { data: Forecast }
GET    /api/ml/recommendation/:id   → { data: Recommendation[] }
GET    /api/ml/anomalies/:id        → { data: Anomaly[] }
```

---

## Real-Time Communication Setup

### Socket.IO Events

**Server → Client:**
```javascript
// Dashboard updates
socket.on('dashboard:update', (data) => {
  // { stats, health, alerts }
})

// Transformer updates
socket.on('transformer:update', (data) => {
  // { id, status, health, readings }
})

// Specific transformer
socket.on('transformer:{id}:update', (data) => {
  // Real-time transformer data
})

// New alerts
socket.on('alerts:new', (alert) => {
  // { id, title, severity, transformer }
})
```

**Client → Server:**
```javascript
// Subscribe to transformer updates
socket.emit('subscribe_transformer:{id}')

// Unsubscribe
socket.emit('unsubscribe_transformer:{id}')
```

### MQTT Topics

```
devices/{deviceId}/status
  └─ Payload: { status, battery, lastSeen }

transformers/{transformerId}/sensors/temperature
  └─ Payload: { value, timestamp, unit }

transformers/{transformerId}/sensors/current
  └─ Payload: { value, timestamp, unit }

transformers/{transformerId}/sensors/voltage
  └─ Payload: { value, timestamp, unit }

transformers/{transformerId}/sensors/humidity
  └─ Payload: { value, timestamp, unit }

alerts/{severity}
  └─ Payload: { id, title, message, transformer }
```

---

## Authentication Flow

1. User submits credentials on login page
2. Frontend calls `authService.login(email, password)`
3. Backend validates credentials, returns JWT token + user object
4. Frontend stores token in `localStorage.authToken`
5. All subsequent API requests include `Authorization: Bearer {token}`
6. Protected routes check for valid token and redirect unauthenticated users to login
7. On 401 response, token is cleared and user redirected to login
8. Session persists across browser refreshes via stored token

---

## Data Flow Patterns

### Fetching Data with useQuery
```javascript
const { devices, loading, error, refetch } = useDevices()

// Auto-refetches every 60 seconds
// Caches data for 5 minutes
// Handles loading and error states
```

### Real-Time Updates with Socket.IO
```javascript
useEffect(() => {
  socketService.subscribeToTransformerUpdates(transformerId, (data) => {
    // Update UI with real-time data
  })
}, [transformerId])
```

### Form Submission with React Hook Form
```javascript
const { register, handleSubmit, errors } = useForm()
const onSubmit = async (data) => {
  try {
    await apiCall(data)
    // Success handling
  } catch (error) {
    // Error handling
  }
}
```

---

## Running the Application

### Development Mode
```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

### Environment Setup Checklist

- [ ] Backend API running on configured URL
- [ ] Socket.IO server enabled and accessible
- [ ] MQTT broker running and accessible
- [ ] `.env.local` file with all required variables
- [ ] Database properly initialized with tables
- [ ] Authentication service working
- [ ] CORS configured on backend

---

## Deployment

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with single click or git push

### Other Platforms

The app can be deployed to any Node.js hosting:
- AWS (Amplify, Elastic Beanstalk)
- Azure (App Service)
- Google Cloud (Cloud Run, App Engine)
- Digital Ocean, Heroku, etc.

Ensure:
- Environment variables are set on the platform
- Backend API is accessible from frontend URL
- CORS headers are properly configured
- WebSocket support is enabled for Socket.IO

---

## Troubleshooting

### "Cannot connect to API"
- Check `REACT_APP_API_URL` is correct
- Verify backend is running
- Check CORS headers on backend
- Look for network errors in browser console

### "Cannot subscribe to Socket.IO"
- Verify `REACT_APP_SOCKET_URL` is accessible
- Check if Socket.IO is enabled on backend
- Verify firewall allows WebSocket connections

### "MQTT connection failed"
- Check `REACT_APP_MQTT_URL` is correct
- Verify MQTT broker is running
- Confirm WebSocket support in MQTT broker
- Check network connectivity

### "Charts not rendering"
- Verify Recharts is installed (`pnpm list recharts`)
- Check if responsive container has height
- Ensure data is in correct format
- Check browser console for errors

### "Authentication not persisting"
- Clear localStorage and try again
- Check if token is being stored: `localStorage.getItem('authToken')`
- Verify backend token validation
- Check browser console for auth errors

---

## Key Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | Framework | 16 |
| React | UI Library | 19.2 |
| Tailwind CSS | Styling | v4 |
| Recharts | Charts | 3.8+ |
| Axios | HTTP Client | 1.17+ |
| Socket.IO Client | Real-time | 4.8+ |
| MQTT.js | IoT Protocol | 5.15+ |
| React Query | Data Fetching | 3.39+ |
| React Hook Form | Form State | 7.78+ |
| Yup | Validation | 1.7+ |

---

## License

ElectraCore Frontend - AI-Powered Transformer Monitoring System
IEEE Region 8 Student Hardware Contest 2026
Team: ElectraCore, IEEE Uganda Section
