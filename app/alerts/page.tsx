'use client' // require client-side rendering

// mock data and utilities for alerts page
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { useAlerts } from '../hooks/useAlerts'
import alertService from '../services/alertService'


// Utility to get color based on severity
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return '#ef4444'
    case 'high':
      return '#f97316'
    case 'medium':
      return '#eab308'
    case 'low':
      return '#22c55e'
    default:
      return '#6b7280'
  }
}

// Utility to format time difference
const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) {
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else {
    return `${days}d ago`
  }
}

// Main Alerts Page Component
export default function AlertsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [filter, setFilter] = useState('all')
  const { alerts: backendAlerts, loading, error, refetch } = useAlerts()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('user')
    
    if (!token) {
      router.push('/login')
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  // Filter alerts based on selected filter (use only backend alerts)
  const displayedAlerts = backendAlerts || []
  const filteredAlerts = filter === 'active' ? displayedAlerts.filter((a: any) => a.status === 'active') : displayedAlerts

  const handleAlertAction = async (alertId: string | number) => {
    try {
      await alertService.resolveAlert(alertId, { resolvedAt: new Date().toISOString() })
      refetch()
      return
    } catch (err) {
      console.warn('Backend alert resolve failed.', err)
      // On failure just refetch to keep UI consistent
      refetch()
      return
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="lg:ml-64">
        <header className="bg-card border-b border-border pt-4 lg:pt-0">
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
              <p className="text-muted-foreground text-sm">Monitor and manage system alerts</p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded text-sm font-medium"
            >
              Refresh
            </button>
          </div>
        </header>

        <div className="px-6 py-8">
          {Boolean(error) && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {(error as any)?.response?.data?.message || (error as Error)?.message || 'Unable to load alerts'}
            </div>
          )}

          {/* Filter Buttons */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded transition-colors text-sm font-medium ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-background'
              }`}
            >
              All Alerts ({displayedAlerts.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded transition-colors text-sm font-medium ${
                filter === 'active'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-background'
              }`}
            >
              Active Only ({displayedAlerts.filter((a: any) => a.status === 'active').length})
            </button>
          </div>

          {/* Severity Legend */}
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Critical', color: '#ef4444' },
              { label: 'High', color: '#f97316' },
              { label: 'Medium', color: '#eab308' },
              { label: 'Low', color: '#22c55e' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {loading ? (
              <div className="bg-card border border-border rounded-lg p-6 text-muted-foreground">Loading alerts...</div>
            ) : filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert: any) => (
                <div
                  key={alert.id}
                  className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                  style={{
                    borderLeftWidth: '4px',
                    borderLeftColor: getSeverityColor(alert.severity),
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{alert.title}</h3>
                        <span
                          className="text-xs px-2 py-1 rounded font-medium uppercase"
                          style={{
                            backgroundColor: getSeverityColor(alert.severity) + '20',
                            color: getSeverityColor(alert.severity),
                          }}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>Device: <span className="text-foreground font-medium">{alert.device}</span></span>
                        <span>{formatTime(alert.createdAt)}</span>
                        <span className={alert.status === 'active' ? 'text-primary' : 'text-muted-foreground'}>
                          {alert.status === 'active' ? 'Active' : 'Resolved'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAlertAction(alert.id)}
                      className="px-3 py-1 text-xs bg-background border border-border rounded hover:bg-background/80 text-foreground transition-colors whitespace-nowrap"
                    >
                      {alert.status === 'active' ? 'Resolve' : 'View'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground mb-2">No live data — check backend</p>
                <p className="text-xs text-muted-foreground">Refresh or check your backend connectivity.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
