'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from '@/context/AuthContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { SocketProvider } from '@/context/SocketContext'
import { MQTTProvider } from '@/context/MQTTContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <SocketProvider>
            <MQTTProvider>
              {children}
            </MQTTProvider>
          </SocketProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
