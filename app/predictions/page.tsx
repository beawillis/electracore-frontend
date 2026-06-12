'use client'

import React from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Sidebar } from '@/components/layout/Sidebar'

export default function PredictionsPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-card border-b border-border sticky top-0 z-10">
            <div className="px-8 py-6">
              <h1 className="text-3xl font-bold text-foreground">AI Predictions</h1>
              <p className="text-muted-foreground text-sm">Machine learning-based forecasting</p>
            </div>
          </header>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fault Prediction */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Fault Prediction</h2>
                <p className="text-muted-foreground text-sm">
                  Predicts probability of transformer failure based on historical patterns
                </p>
              </div>

              {/* Health Score */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Health Score</h2>
                <p className="text-muted-foreground text-sm">
                  Overall transformer health assessment with trend analysis
                </p>
              </div>

              {/* Failure Forecast */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Failure Forecast</h2>
                <p className="text-muted-foreground text-sm">
                  Estimated remaining useful life for each transformer
                </p>
              </div>

              {/* Recommendations */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Recommendations</h2>
                <p className="text-muted-foreground text-sm">
                  AI-powered maintenance recommendations and actions
                </p>
              </div>
            </div>

            <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
              <p className="text-sm text-foreground">
                AI predictions are computed on the backend. Connect your ML service to enable this feature.
              </p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
