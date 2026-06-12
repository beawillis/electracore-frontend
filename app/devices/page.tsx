'use client'

import React, { useState } from 'react'
import { useDevices } from '@/hooks/useDevices'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Sidebar } from '@/components/layout/Sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime, getStatusColor } from '@/utils/formatter'

export default function DevicesPage() {
  const { devices, loading } = useDevices()
  const [selectedId, setSelectedId] = useState(null)

  const selected = devices?.find((d) => d.id === selectedId)

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-card border-b border-border sticky top-0 z-10">
            <div className="px-8 py-6">
              <h1 className="text-3xl font-bold text-foreground">Devices</h1>
              <p className="text-muted-foreground text-sm">Monitor and manage IoT devices</p>
            </div>
          </header>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Devices List */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg">
                  <div className="p-4 border-b border-border">
                    <h2 className="font-semibold text-foreground">Device List</h2>
                  </div>
                  <div className="divide-y divide-border max-h-96 overflow-y-auto">
                    {loading ? (
                      <>
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                      </>
                    ) : devices && devices.length > 0 ? (
                      devices.map((device) => (
                        <button
                          key={device.id}
                          onClick={() => setSelectedId(device.id)}
                          className={`w-full p-4 text-left transition-colors ${
                            selectedId === device.id
                              ? 'bg-primary/10 border-l-2 border-primary'
                              : 'hover:bg-background'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-foreground text-sm">
                                {device.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {device.type}
                              </p>
                            </div>
                            <span
                              className="inline-block w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: getStatusColor(device.status),
                              }}
                            ></span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground text-sm">
                        No devices found
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Device Details */}
              <div className="lg:col-span-2">
                {selected ? (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-foreground mb-6">{selected.name}</h2>

                    <div className="space-y-4">
                      {/* Status */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Status</p>
                          <p className="text-sm font-semibold text-foreground capitalize">
                            {selected.status}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Battery Level</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent"
                                style={{ width: `${selected.batteryLevel || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-foreground">
                              {selected.batteryLevel || 0}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <hr className="border-border" />

                      {/* Device Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Type</p>
                          <p className="text-sm text-foreground">{selected.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Firmware</p>
                          <p className="text-sm text-foreground">
                            {selected.firmwareVersion || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Transformer Link */}
                      {selected.transformerId && (
                        <>
                          <hr className="border-border" />
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Linked Transformer</p>
                            <p className="text-sm text-foreground">{selected.transformerId}</p>
                          </div>
                        </>
                      )}

                      {/* Last Seen */}
                      <hr className="border-border" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Last Seen</p>
                        <p className="text-sm text-foreground">
                          {selected.lastSeen ? formatDateTime(new Date(selected.lastSeen)) : 'Never'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">Select a device to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
