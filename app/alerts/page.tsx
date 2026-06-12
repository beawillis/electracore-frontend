'use client'

import React, { useState } from 'react'
import { useAlerts, useActiveAlerts } from '@/hooks/useAlerts'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Sidebar } from '@/components/layout/Sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime, getStatusColor } from '@/utils/formatter'

export default function AlertsPage() {
  const { alerts: activeAlerts, loading: activeLoading } = useActiveAlerts()
  const { alerts: allAlerts, loading: allLoading } = useAlerts()
  const [filter, setFilter] = useState('all')

  const filteredAlerts = filter === 'active' ? activeAlerts : allAlerts

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-card border-b border-border sticky top-0 z-10">
            <div className="px-8 py-6">
              <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
              <p className="text-muted-foreground text-sm">Monitor and manage system alerts</p>
            </div>
          </header>

          <div className="p-8">
            {/* Filter */}
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
