'use client'

import React from 'react'
import { useLiveReadings } from '@/hooks/useSensors'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Sidebar } from '@/components/layout/Sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime, formatTemperature, formatCurrent, formatVoltage } from '@/utils/formatter'

export default function SensorsPage() {
  const { readings, loading } = useLiveReadings('default')

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-card border-b border-border sticky top-0 z-10">
            <div className="px-8 py-6">
              <h1 className="text-3xl font-bold text-foreground">Sensor Readings</h1>
              <p className="text-muted-foreground text-sm">Real-time sensor data monitoring</p>
            </div>
          </header>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <>
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </>
              ) : readings && readings.length > 0 ? (
                readings.map((reading, idx) => (
                  <div key={idx} className="bg-card border border-border rounded-lg p-6">
                    <h3 className="font-semibold text-foreground mb-3 capitalize">
                      {reading.sensorType?.replace('_', ' ')}
                    </h3>
                    <p className="text-3xl font-bold text-primary mb-2">
                      {reading.sensorType === 'temperature'
                        ? formatTemperature(reading.value)
                        : reading.sensorType === 'current'
                        ? formatCurrent(reading.value)
                        : reading.sensorType === 'voltage'
                        ? formatVoltage(reading.value)
                        : `${reading.value} ${reading.unit}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated: {formatDateTime(new Date(reading.timestamp))}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center p-8">
                  <p className="text-muted-foreground">No sensor readings available</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
