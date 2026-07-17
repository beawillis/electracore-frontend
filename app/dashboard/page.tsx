'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Navbar } from '../components/Navbar'
import dashboardService from '../services/dashboardService'
import { unwrapData } from '../services/response'
import { useDevices } from '../hooks/useDevices'
import { useTransformers } from '../hooks/useTransformers'
import { useLiveReadings } from '../hooks/useSensors'
import { formatLiveValue } from '../utils/liveTelemetry'
import { LiveTelemetryChart } from '../../components/telemetry/LiveTelemetryChart'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedTransformerId, setSelectedTransformerId] = useState('')
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const { transformers } = useTransformers()
  const { devices } = useDevices(selectedTransformerId ? { transformerId: selectedTransformerId } : {})
  const activeTransformerId = selectedTransformerId || transformers[0]?.id || transformers[0]?._id || transformers[0]?.transformerId || ''
  const { readings: liveReadings, loading: liveLoading, historySeries: liveHistorySeries } = useLiveReadings(activeTransformerId)
  const role = String(user?.role || '').toLowerCase()
  const requiresSpecificAsset = role === 'operator' || role === 'engineer'
  const statsFilters = requiresSpecificAsset
    ? {
        transformerId: selectedTransformerId || undefined,
        deviceId: selectedDeviceId || undefined,
      }
    : {}
  const {
    data: statsPayload,
    error,
  } = useQuery({
    queryKey: ['dashboard', 'stats', statsFilters],
    queryFn: () => dashboardService.getStats(statsFilters),
    enabled: !!user && (!requiresSpecificAsset || Boolean(selectedTransformerId || selectedDeviceId)),
    staleTime: 5000,
    refetchInterval: 30000,
  })

  const stats = unwrapData(statsPayload, statsPayload) as Record<string, any> | null
  const displayStat = (...values: any[]) => {
    const value = values.find((item) => item !== undefined && item !== null)
    if (typeof value === 'string' || typeof value === 'number') return value
    return '-'
  }

  const totalTransformers = displayStat(stats?.totalTransformers, stats?.transformers)
  const activeDevices = displayStat(stats?.activeDevices, stats?.devices)
  const systemHealth = displayStat(stats?.systemHealth, stats?.health)
  const criticalAlerts = displayStat(stats?.criticalAlerts, stats?.alerts)
  const statsUnavailable = !error && statsPayload && [totalTransformers, activeDevices, systemHealth, criticalAlerts].every((value) => value === '-')

  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token) {
      router.push('/login')
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [router])

  useEffect(() => {
    if (!user) return

    const storedTransformerId = localStorage.getItem('monitorTransformerId') || ''
    const storedDeviceId = localStorage.getItem('monitorDeviceId') || ''
    if (storedTransformerId) setSelectedTransformerId(storedTransformerId)
    if (storedDeviceId) setSelectedDeviceId(storedDeviceId)
  }, [user])

  useEffect(() => {
    if (!requiresSpecificAsset || selectedTransformerId || transformers.length === 0) return
    const firstTransformer = transformers[0]
    setSelectedTransformerId(String(firstTransformer.id || firstTransformer._id || firstTransformer.transformerId || ''))
  }, [requiresSpecificAsset, selectedTransformerId, transformers])

  useEffect(() => {
    if (!requiresSpecificAsset || selectedDeviceId || devices.length === 0) return
    const firstDevice = devices[0]
    setSelectedDeviceId(String(firstDevice.deviceId || firstDevice.id || firstDevice._id || ''))
  }, [devices, requiresSpecificAsset, selectedDeviceId])

  const handleTransformerSelection = (value: string) => {
    setSelectedTransformerId(value)
    setSelectedDeviceId('')
    localStorage.setItem('monitorTransformerId', value)
    localStorage.removeItem('monitorDeviceId')
  }

  const handleDeviceSelection = (value: string) => {
    setSelectedDeviceId(value)
    localStorage.setItem('monitorDeviceId', value)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="lg:ml-64">
        <header className="bg-card border-b border-border pt-4 lg:pt-0">
          <div className="px-6 py-4">
            <h1 className="flex flex-col text-2xl font-bold text-foreground leading-tight">
              <span>ElectraCore</span>
              <span className="text-sm font-medium text-muted-foreground">Smart Transformer Monitoring System</span>
            </h1>
            <p className="text-muted-foreground text-sm">Welcome, {user?.name || 'User'}</p>
          </div>
        </header>

        <div className="px-6 py-12">
          {Boolean(error) && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {String((error as any)?.response?.data?.message || (error as Error)?.message || 'Unable to load dashboard stats')}
            </div>
          )}

          <div className="mb-8 bg-card border border-border rounded-lg p-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="font-semibold text-foreground">Monitoring Scope</h2>
                <p className="text-sm text-muted-foreground">
                  {role === 'admin'
                    ? 'Admin access is monitoring all registered transformers and devices.'
                    : 'Select the transformer and device you want to monitor right now.'}
                </p>
              </div>

              {requiresSpecificAsset ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:min-w-lg">
                  <select
                    value={selectedTransformerId}
                    onChange={(e) => handleTransformerSelection(e.target.value)}
                    className="px-3 py-2 bg-[#252536] border border-[#3d3d50] rounded text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="">Select transformer</option>
                    {transformers.map((transformer: any) => {
                      const id = String(transformer.id || transformer._id || transformer.transformerId || '')
                      return (
                        <option key={id} value={id}>
                          {transformer.name || id}
                        </option>
                      )
                    })}
                  </select>
                  <select
                    value={selectedDeviceId}
                    onChange={(e) => handleDeviceSelection(e.target.value)}
                    className="px-3 py-2 bg-[#252536] border border-[#3d3d50] rounded text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="">Select device</option>
                    {devices.map((device: any) => {
                      const id = String(device.deviceId || device.id || device._id || '')
                      return (
                        <option key={id} value={id}>
                          {device.name || id}
                        </option>
                      )
                    })}
                  </select>
                </div>
              ) : (
                <div className="text-sm text-primary font-semibold">All devices and transformers</div>
              )}
            </div>
          </div>

          {requiresSpecificAsset && !selectedTransformerId && !selectedDeviceId && (
            <div className="mb-6 p-3 bg-primary/10 border border-primary/20 rounded text-primary text-sm">
              Choose a transformer or device to load scoped monitoring data.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-2">Total Transformers</p>
              <p className="text-3xl font-bold text-foreground">{totalTransformers}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-2">Active Devices</p>
              <p className="text-3xl font-bold text-foreground">{activeDevices}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-2">System Health</p>
              <p className="text-3xl font-bold text-foreground">{systemHealth}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-2">Critical Alerts</p>
              <p className="text-3xl font-bold text-foreground">{criticalAlerts}</p>
            </div>
          </div>
          {statsUnavailable && (
            <>
              <div className="mb-6 p-4 bg-secondary/10 border border-secondary/20 rounded text-secondary text-sm">
                Stats are unavailable from the backend. Confirm <span className="font-mono">/api/dashboard/stats</span> is returning the expected fields.
              </div>
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-6 p-4 bg-card border border-border rounded-lg text-sm text-muted-foreground">
                  <div className="mb-2 font-medium text-foreground">Dashboard stats diagnostics</div>
                  <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-relaxed">
                    {JSON.stringify(statsPayload, null, 2)}
                  </pre>
                </div>
              )}
            </>
          )}

          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Live hardware telemetry</h2>
                <p className="text-sm text-muted-foreground">Showing the latest values forwarded from the backend for the selected transformer.</p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{liveLoading ? 'Refreshing…' : `${liveReadings.length} live signal${liveReadings.length === 1 ? '' : 's'}`}</span>
              </div>
            </div>

            {activeTransformerId ? (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {liveReadings.length > 0 ? (
                  <>
                    {liveReadings.slice(0, 4).map((reading: any, index: number) => (
                      <div key={reading.id || reading._id || `${reading.sensorType}-${index}`} className="bg-background border border-border rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">{reading.sensorType || reading.type || 'Sensor'}</p>
                        <p className="text-2xl font-bold text-foreground mt-2">{formatLiveValue(reading)}</p>
                        <p className="text-xs text-muted-foreground mt-3">{reading.timestamp ? new Date(reading.timestamp).toLocaleString() : 'Awaiting timestamp'}</p>
                      </div>
                    ))}
                    <div className="md:col-span-2 xl:col-span-4 mt-6">
                      <LiveTelemetryChart readings={liveReadings} historySeries={liveHistorySeries} />
                    </div>
                  </>
                ) : (
                  <div className="md:col-span-2 xl:col-span-4 bg-background border border-border rounded-lg p-4 text-sm text-muted-foreground">
                    No live telemetry has arrived from the backend for this transformer yet.
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 p-4 bg-background border border-border rounded-lg text-sm text-muted-foreground">
                Select a transformer to inspect the latest hardware readings.
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <h2 className="flex flex-col items-center text-2xl font-bold text-foreground leading-tight mb-4">
              <span>ElectraCore</span>
              <span className="text-sm font-medium text-muted-foreground">Smart Transformer Monitoring System</span>
            </h2>
          </div>
        </div>
      </main>
    </div>
  )
}
