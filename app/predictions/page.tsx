'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'

export default function PredictionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

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
            <h1 className="text-2xl font-bold text-foreground">AI Predictions</h1>
            <p className="text-muted-foreground text-sm">Machine learning-based forecasting</p>
          </div>
        </header>

        <div className="px-6 py-12">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Predictions Module</h2>
            <p className="text-muted-foreground">This page will display AI-powered predictions and forecasts for your transformers.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

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
