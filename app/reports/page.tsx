'use client'

import React from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Sidebar } from '@/components/layout/Sidebar'

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-card border-b border-border sticky top-0 z-10">
            <div className="px-8 py-6">
              <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
              <p className="text-muted-foreground text-sm">Generate and view system reports</p>
            </div>
          </header>

          <div className="p-8">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Available Reports</h2>

              <div className="space-y-3">
                <div className="p-4 bg-background rounded cursor-pointer hover:bg-background/80 transition-colors">
                  <h3 className="font-semibold text-foreground">System Performance Report</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Overall system performance, uptime, and efficiency metrics
                  </p>
                </div>

                <div className="p-4 bg-background rounded cursor-pointer hover:bg-background/80 transition-colors">
                  <h3 className="font-semibold text-foreground">Transformer Health Report</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Individual transformer health assessment and trends
                  </p>
                </div>

                <div className="p-4 bg-background rounded cursor-pointer hover:bg-background/80 transition-colors">
                  <h3 className="font-semibold text-foreground">Alert Summary Report</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Historical alert trends and incident analysis
                  </p>
                </div>

                <div className="p-4 bg-background rounded cursor-pointer hover:bg-background/80 transition-colors">
                  <h3 className="font-semibold text-foreground">Maintenance Log Report</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Maintenance activities and work order history
                  </p>
                </div>

                <div className="p-4 bg-background rounded cursor-pointer hover:bg-background/80 transition-colors">
                  <h3 className="font-semibold text-foreground">Predictive Maintenance Report</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI predictions for maintenance scheduling
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
