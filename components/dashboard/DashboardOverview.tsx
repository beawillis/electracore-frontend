'use client'

import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import dashboardService from '@/services/dashboardService'
import { formatNumber, formatDateTime, getStatusColor } from '@/utils/formatter'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardOverview() {
  const { data: stats, isLoading: statsLoading } = useQuery(
    ['dashboardStats'],
    () => dashboardService.getStats(),
    { refetchInterval: 60000 }
  )

  const { data: health, isLoading: healthLoading } = useQuery(
    ['dashboardHealth'],
    () => dashboardService.getHealth(),
    { refetchInterval: 30000 }
  )

  const { data: alerts, isLoading: alertsLoading } = useQuery(
    ['dashboardAlerts'],
    () => dashboardService.getAlerts(),
    { refetchInterval: 15000 }
  )

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Transformers',
            value: stats?.data?.totalTransformers ?? 0,
            icon: '⚡',
          },
          {
            label: 'Active Devices',
            value: stats?.data?.activeDevices ?? 0,
            icon: '🔌',
          },
          {
            label: 'System Health',
            value: `${health?.data?.overallHealth ?? 0}%`,
            icon: '❤️',
          },
          {
            label: 'Critical Alerts',
            value: alerts?.data?.critical ?? 0,
            icon: '⚠️',
          },
        ].map((stat, idx) => (
          <div key={idx} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">
                  {statsLoading || healthLoading || alertsLoading ? (
                    <Skeleton className="h-10 w-20" />
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div className="text-4xl opacity-50">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* System Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">System Status</h2>
        <div className="space-y-3">
          {statsLoading ? (
            <>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between p-3 bg-background rounded">
                <span className="text-foreground">API Connection</span>
                <span className="text-green-400 font-semibold">Connected</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded">
                <span className="text-foreground">Data Sync</span>
                <span className="text-green-400 font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded">
                <span className="text-foreground">Last Update</span>
                <span className="text-muted-foreground text-sm">
                  {formatDateTime(new Date())}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Alerts */}
      {alerts?.data?.recentAlerts && alerts.data.recentAlerts.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Alerts</h2>
          <div className="space-y-2">
            {alerts.data.recentAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-background rounded border-l-4"
                style={{
                  borderColor: getStatusColor(alert.severity),
                }}
              >
                <div className="flex-1">
                  <p className="text-foreground font-semibold text-sm">{alert.title}</p>
                  <p className="text-muted-foreground text-xs">{alert.transformer}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardOverview
