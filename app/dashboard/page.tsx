'use client'

import React from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'
import { 
  TemperatureTrendChart, 
  LoadDistributionChart, 
  SystemHealthChart, 
  AlertTrendChart 
} from '@/components/dashboard/DashboardCharts'

export default function DashboardPage() {
  // Sample data for charts
  const temperatureData = [
    { time: '00:00', temperature: 45 },
    { time: '04:00', temperature: 42 },
    { time: '08:00', temperature: 48 },
    { time: '12:00', temperature: 52 },
    { time: '16:00', temperature: 55 },
    { time: '20:00', temperature: 50 },
    { time: '24:00', temperature: 46 },
  ]

  const loadData = [
    { transformer: 'T-001', load: 65 },
    { transformer: 'T-002', load: 72 },
    { transformer: 'T-003', load: 58 },
    { transformer: 'T-004', load: 81 },
    { transformer: 'T-005', load: 54 },
  ]

  const healthData = [
    { date: 'Mon', health: 95 },
    { date: 'Tue', health: 94 },
    { date: 'Wed', health: 92 },
    { date: 'Thu', health: 93 },
    { date: 'Fri', health: 91 },
    { date: 'Sat', health: 89 },
    { date: 'Sun', health: 90 },
  ]

  const alertData = [
    { date: 'Mon', critical: 2, high: 5, medium: 8 },
    { date: 'Tue', critical: 1, high: 4, medium: 6 },
    { date: 'Wed', critical: 3, high: 7, medium: 10 },
    { date: 'Thu', critical: 1, high: 3, medium: 5 },
    { date: 'Fri', critical: 0, high: 2, medium: 4 },
    { date: 'Sat', critical: 1, high: 4, medium: 7 },
    { date: 'Sun', critical: 2, high: 6, medium: 9 },
  ]

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-card border-b border-border sticky top-0 z-10">
            <div className="px-8 py-6">
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground text-sm">Real-time monitoring and analytics</p>
            </div>
          </header>

          {/* Content */}
          <div className="p-8">
            {/* Overview Cards */}
            <DashboardOverview />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <TemperatureTrendChart data={temperatureData} />
              <LoadDistributionChart data={loadData} />
              <SystemHealthChart data={healthData} />
              <AlertTrendChart data={alertData} />
            </div>

            {/* Integration Status */}
            <div className="mt-8 bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Integration Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-background rounded">
                  <p className="text-xs text-muted-foreground mb-1">Backend API</p>
                  <p className="text-sm text-foreground font-semibold">
                    {process.env.REACT_APP_API_URL || 'Not configured'}
                  </p>
                </div>
                <div className="p-4 bg-background rounded">
                  <p className="text-xs text-muted-foreground mb-1">Real-Time (Socket.IO)</p>
                  <p className="text-sm text-foreground font-semibold">
                    {process.env.REACT_APP_SOCKET_URL || 'Not configured'}
                  </p>
                </div>
                <div className="p-4 bg-background rounded">
                  <p className="text-xs text-muted-foreground mb-1">MQTT Broker</p>
                  <p className="text-sm text-foreground font-semibold">
                    {process.env.REACT_APP_MQTT_URL || 'Not configured'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
