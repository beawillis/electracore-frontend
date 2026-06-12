'use client'

import React, { useState } from 'react'
import { useTransformers } from '@/hooks/useTransformers'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Sidebar } from '@/components/layout/Sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime, getStatusColor } from '@/utils/formatter'

export default function TransformersPage() {
  const { transformers, loading } = useTransformers()
  const [selectedId, setSelectedId] = useState(null)

  const selected = transformers?.find((t) => t.id === selectedId)

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-card border-b border-border sticky top-0 z-10">
            <div className="px-8 py-6">
              <h1 className="text-3xl font-bold text-foreground">Transformers</h1>
              <p className="text-muted-foreground text-sm">Manage and monitor transformer units</p>
            </div>
          </header>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Transformers List */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg">
                  <div className="p-4 border-b border-border">
                    <h2 className="font-semibold text-foreground">Transformer List</h2>
                  </div>
                  <div className="divide-y divide-border max-h-96 overflow-y-auto">
                    {loading ? (
                      <>
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                      </>
                    ) : transformers && transformers.length > 0 ? (
                      transformers.map((transformer) => (
                        <button
                          key={transformer.id}
                          onClick={() => setSelectedId(transformer.id)}
                          className={`w-full p-4 text-left transition-colors ${
                            selectedId === transformer.id
                              ? 'bg-primary/10 border-l-2 border-primary'
                              : 'hover:bg-background'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-foreground text-sm">
                                {transformer.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {transformer.location}
                              </p>
                            </div>
                            <span
                              className="inline-block w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: getStatusColor(transformer.status),
                              }}
                            ></span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground text-sm">
                        No transformers found
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Transformer Details */}
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
                          <p className="text-xs text-muted-foreground mb-1">Health Score</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent"
                                style={{ width: `${selected.healthScore || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-foreground">
                              {selected.healthScore || 0}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <hr className="border-border" />

                      {/* Location */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Location</p>
                        <p className="text-sm text-foreground">{selected.location}</p>
                      </div>

                      {/* Devices */}
                      {selected.devices && selected.devices.length > 0 && (
                        <>
                          <hr className="border-border" />
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Linked Devices</p>
                            <div className="space-y-1">
                              {selected.devices.map((device, idx) => (
                                <p
                                  key={idx}
                                  className="text-sm px-2 py-1 bg-background rounded text-foreground"
                                >
                                  {device}
                                </p>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Last Updated */}
                      <hr className="border-border" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                        <p className="text-sm text-foreground">
                          {selected.lastUpdated
                            ? formatDateTime(new Date(selected.lastUpdated))
                            : 'Never'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">Select a transformer to view details</p>
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
