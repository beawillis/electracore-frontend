'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'

export default function AlertsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [filter, setFilter] = useState('all')

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="lg:ml-64">
        <header className="bg-card border-b border-border pt-4 lg:pt-0">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
            <p className="text-muted-foreground text-sm">Monitor and manage system alerts</p>
          </div>
        </header>

        <div className="px-6 py-12">
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-background'
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded transition-colors ${
                filter === 'active'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-background'
              }`}
            >
              Active Only
            </button>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Alerts Module</h2>
            <p className="text-muted-foreground">This page will display active and historical alerts from your system.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
              >
                Active Only
              </button>
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
              {activeLoading || allLoading ? (
                <>
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </>
              ) : filteredAlerts && filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className="bg-card border border-border rounded-lg p-4"
                    style={{
                      borderLeftWidth: '4px',
                      borderLeftColor: getStatusColor(alert.severity),
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{alert.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDateTime(new Date(alert.createdAt))}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded capitalize">
                          {alert.severity}
                        </span>
                        {alert.status && (
                          <span className="text-xs px-2 py-1 bg-background text-foreground rounded capitalize">
                            {alert.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">No alerts found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
