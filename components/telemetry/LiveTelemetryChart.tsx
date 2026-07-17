'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface HistoryPoint {
  timestamp: string
  label: string
  value: number
  unit?: string
}

interface HistorySeries {
  sensorType: string
  unit?: string
  data: HistoryPoint[]
}

interface LiveTelemetryChartProps {
  readings: Array<{ sensorType?: string; type?: string; value?: number | string; unit?: string; timestamp?: string }>
  historySeries?: HistorySeries[]
}

export function LiveTelemetryChart({ readings = [], historySeries = [] }: LiveTelemetryChartProps) {
  const hasHistory = Array.isArray(historySeries) && historySeries.length > 0

  if (!readings.length && !hasHistory) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center text-muted-foreground">
        <p className="font-medium text-foreground">Live telemetry chart</p>
        <p className="mt-2 text-sm">No live data available to render chart.</p>
      </div>
    )
  }

  if (!hasHistory) {
    const latestValues = readings.map((reading) => ({
      name: String(reading.sensorType || reading.type || 'Sensor'),
      value: typeof reading.value === 'number' ? reading.value : Number(reading.value) || 0,
      unit: reading.unit || '',
    }))

    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Live telemetry snapshot</h3>
          <span className="text-sm text-muted-foreground">Latest values</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {latestValues.map((item) => (
            <div key={item.name} className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">{item.name}</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{item.value}</p>
              {item.unit && <p className="text-xs text-muted-foreground mt-2">{item.unit}</p>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Live telemetry history</h3>
          <p className="text-sm text-muted-foreground">Each sensor is displayed as an independent time-series.</p>
        </div>
        <span className="text-sm text-muted-foreground">Last {historySeries[0]?.data.length ?? 0} points</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {historySeries.map((series) => (
          <div key={series.sensorType} className="rounded-lg border border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">{series.sensorType}</p>
                {series.unit && <p className="text-xs text-muted-foreground">{series.unit}</p>}
              </div>
              <p className="text-xs text-muted-foreground">{series.data.length} samples</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={series.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis dataKey="label" stroke="#9ca3af" minTickGap={20} />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                  labelStyle={{ color: '#e2e8f0' }}
                  formatter={(value: any) => [value, series.sensorType]}
                />
                <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  )
}
