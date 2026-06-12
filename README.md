# ElectraCore - Smart Transformer Monitoring & Protection System
### Frontend Application

![ElectraCore](https://img.shields.io/badge/ElectraCore-v1.0.0-blue)
![License](https://img.shields.io/badge/License-IEEE%20Project-green)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

## Overview

**ElectraCore** is an AI-powered smart transformer monitoring and protection system frontend built with Next.js, React, and Tailwind CSS. It provides real-time monitoring, predictive maintenance, and automated protection for electrical transformers with enterprise-grade features and security.

The system integrates with IoT devices (ESP32), cloud services, ML models, and real-time communication protocols to deliver a comprehensive monitoring solution for the energy sector.

---

## Key Features

### 🎯 Core Functionality
- **Real-Time Monitoring**: Live sensor data with Socket.IO and MQTT integration
- **Device Management**: Register and monitor multiple IoT devices
- **Transformer Health**: Track transformer status, health scores, and conditions
- **Alert System**: Multi-severity alerts with acknowledgment and resolution tracking
- **Predictive Maintenance**: AI-powered failure prediction and RUL forecasting
- **Analytics Dashboard**: Interactive charts and comprehensive reporting

### 🔐 Security & Authentication
- JWT-based authentication
- Protected routes and role-based access control
- Automatic token refresh
- Secure password handling
- Session persistence

### 📊 Data Visualization
- Temperature trends
- Load distribution charts
- System health scoring
- Alert trend analysis
- Real-time metrics

### 🚀 Performance
- Client-side caching with React Query
- Optimized data fetching
- Responsive design
- Fast load times
- Efficient real-time updates

---

## Tech Stack

```
Frontend Framework:  Next.js 16 (App Router)
UI Library:         React 19.2
Styling:            Tailwind CSS v4
State Management:   React Context API + Zustand
Data Fetching:      React Query + Axios
Real-Time:          Socket.IO + MQTT.js
Charts:             Recharts
Forms:              React Hook Form + Yup
HTTP Client:        Axios with interceptors
```

---

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- A running ElectraCore backend API

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd electracore-frontend

# Install dependencies
npm install
```

### Configuration

Create a `.env.local` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_MQTT_URL=ws://localhost:8080
```

### Running Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

### Production Build

```bash
npm build
npm start
```

---

## Project Structure

```
src/
├── app/                    # Next.js routes
│   ├── login/              # Authentication
│   ├── dashboard/          # Main dashboard
│   ├── transformers/       # Transformer management
│   ├── devices/            # Device management
│   ├── sensors/            # Sensor monitoring
│   ├── alerts/             # Alert management
│   ├── predictions/        # AI predictions
│   ├── reports/            # Reports & analytics
│   └── settings/           # User settings
│
├── components/             # React components
│   ├── auth/               # Authentication UI
│   ├── layout/             # Layout components
│   ├── dashboard/          # Dashboard components
│   └── ui/                 # Reusable UI
│
├── services/               # API clients
│   ├── api.js              # Axios configuration
│   ├── authService.js
│   ├── deviceService.js
│   ├── transformerService.js
│   └── ...
│
├── context/                # React Context
│   ├── AuthContext.jsx
│   ├── NotificationContext.jsx
│   ├── SocketContext.jsx
│   └── MQTTContext.jsx
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.js
│   ├── useDevices.js
│   ├── useTransformers.js
│   └── ...
│
└── utils/                  # Utilities
    ├── constants.js
    ├── formatter.js
    └── dateUtils.js
```

---

## API Integration

### Backend Requirements

The frontend expects a RESTful backend API with these endpoint groups:

- `/api/auth/*` - Authentication (login, register, profile)
- `/api/devices/*` - Device management
- `/api/transformers/*` - Transformer management
- `/api/sensors/*` - Sensor data
- `/api/alerts/*` - Alert management
- `/api/dashboard/*` - Dashboard data
- `/api/ml/*` - ML predictions

See [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md) for complete API specifications.

### Real-Time Communication

- **Socket.IO**: Dashboard updates, transformer monitoring
- **MQTT**: Device status, sensor data streaming

---

## Key Pages

| Page | Route | Purpose |
|------|-------|---------|
| Login | `/login` | User authentication |
| Register | `/register` | Account creation |
| Dashboard | `/dashboard` | System overview & metrics |
| Transformers | `/transformers` | Manage transformer units |
| Devices | `/devices` | IoT device management |
| Sensors | `/sensors` | Real-time sensor readings |
| Alerts | `/alerts` | Alert management |
| Predictions | `/predictions` | AI-powered forecasting |
| Reports | `/reports` | Analytics & reporting |
| Settings | `/settings` | User preferences |

---

## Authentication Flow

1. User accesses `/login` or `/register`
2. Credentials submitted to backend
3. JWT token received and stored in `localStorage`
4. All requests include token in Authorization header
5. Protected routes check for valid token
6. Invalid/expired tokens trigger redirect to login
7. Logout clears token and redirects to login

---

## Deployment

### Vercel Deployment

```bash
# Verify login
vercel login

# Deploy
vercel deploy

# Set environment variables in Vercel dashboard
```

### Other Platforms

The app can be deployed to any Node.js hosting provider. Ensure:
- Environment variables are configured
- Backend API is accessible
- CORS headers allow frontend domain
- WebSocket support is enabled

---

## Troubleshooting

### Connection Issues
- Verify backend is running
- Check environment variables
- Ensure CORS is enabled
- Look for network errors in browser console

### Authentication Problems
- Clear localStorage and cookies
- Verify token is being stored
- Check backend auth service
- Review browser console for errors

### Real-Time Updates Not Working
- Verify Socket.IO/MQTT URLs
- Check network connectivity
- Confirm server supports WebSockets
- Review server connection logs

### Charts Not Rendering
- Verify data format is correct
- Check responsive container has height
- Ensure Recharts is installed
- Check browser console for errors

---

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use TypeScript where applicable
- Keep components focused and reusable

### State Management
- Use React Query for server state
- Use React Context for auth/UI state
- Keep component state local when possible
- Avoid prop drilling with context

### Performance
- Memoize expensive computations
- Use React Query for caching
- Lazy load routes with dynamic imports
- Optimize re-renders with useMemo/useCallback

### Security
- Never store sensitive data in localStorage
- Always use HTTPS in production
- Validate input on both client and server
- Sanitize displayed user data

---

## Environment Variables

```env
# Required
REACT_APP_API_URL=              # Backend API base URL
REACT_APP_SOCKET_URL=           # Socket.IO server URL
REACT_APP_MQTT_URL=             # MQTT broker URL

# Optional
REACT_APP_API_TIMEOUT=          # API request timeout (ms)
REACT_APP_DEBUG=                # Enable debug logging
NODE_ENV=                        # development/production
```

---

## Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 2.5s
- **Lighthouse Score**: 90+
- **Bundle Size**: ~500KB (gzipped)

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Contributing

To contribute to ElectraCore:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## Team

**ElectraCore** is developed by:
- IEEE Uganda Section
- IEEE Makerere University Student Branch

Members:
- Elisha Alvin Bifandhuba
- Linet Kyokusiima
- Divine Mukose

---

## License

This project is part of the IEEE Region 8 Student Hardware Contest 2026.

---

## Support

For issues, questions, or suggestions:
- Check the [Troubleshooting Guide](./FRONTEND_COMPLETE_GUIDE.md#troubleshooting)
- Review [Backend Integration Guide](./BACKEND_INTEGRATION_GUIDE.md)
- Check component documentation in source code

---

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Custom report builder
- [ ] Integration with utility management systems
- [ ] Machine learning model improvements
- [ ] API v2 with GraphQL support
- [ ] Enhanced security features
- [ ] Multi-language support

---

**Ready to monitor your transformers?** [Get Started](#quick-start)

---

*ElectraCore Frontend - Building a smarter energy future* ⚡
