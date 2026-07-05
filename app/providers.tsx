'use client'

import React from 'react'
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { MQTTProvider } from './context/MQTTContext'
import { NotificationProvider } from './context/NotificationContext'
import { SocketProvider } from './context/SocketContext'
import socketService from './services/socketService'

function RealtimeQueryBridge() {
  const queryClient = useQueryClient()

  React.useEffect(() => {
    // When hardware data reaches the backend, these socket events tell React Query
    // to refetch the affected API data so pages show fresh readings quickly.
    const refreshDashboard = () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['activeAlerts'] })
    }

    const refreshDevices = () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
      refreshDashboard()
    }

    const refreshTransformers = () => {
      queryClient.invalidateQueries({ queryKey: ['transformers'] })
      refreshDashboard()
    }

    const refreshSensors = () => {
      queryClient.invalidateQueries({ queryKey: ['liveReadings'] })
      queryClient.invalidateQueries({ queryKey: ['historicalReadings'] })
      refreshDashboard()
    }

    const refreshAlerts = () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      queryClient.invalidateQueries({ queryKey: ['activeAlerts'] })
      queryClient.invalidateQueries({ queryKey: ['alertHistory'] })
      refreshDashboard()
    }

    socketService.on('dashboard:update', refreshDashboard)
    socketService.on('devices:update', refreshDevices)
    socketService.on('device:update', refreshDevices)
    socketService.on('device:status', refreshDevices)
    socketService.on('transformers:update', refreshTransformers)
    socketService.on('transformer:update', refreshTransformers)
    socketService.on('sensors:update', refreshSensors)
    socketService.on('sensor:update', refreshSensors)
    socketService.on('sensor:reading', refreshSensors)
    socketService.on('alerts:new', refreshAlerts)
    socketService.on('alert:update', refreshAlerts)

    return () => {
      socketService.off('dashboard:update', refreshDashboard)
      socketService.off('devices:update', refreshDevices)
      socketService.off('device:update', refreshDevices)
      socketService.off('device:status', refreshDevices)
      socketService.off('transformers:update', refreshTransformers)
      socketService.off('transformer:update', refreshTransformers)
      socketService.off('sensors:update', refreshSensors)
      socketService.off('sensor:update', refreshSensors)
      socketService.off('sensor:reading', refreshSensors)
      socketService.off('alerts:new', refreshAlerts)
      socketService.off('alert:update', refreshAlerts)
    }
  }, [queryClient])

  return null
}

// Providers component that sets up the React Query client and provides it to the application, allowing for efficient data fetching and caching throughout the app
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <MQTTProvider>
            <NotificationProvider>
              <RealtimeQueryBridge />
              {children}
            </NotificationProvider>
          </MQTTProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
