'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { usePredictions } from '../hooks/usePredictions'


const getHealthColor = (score: number) => {
  if (score >= 85) return '#22c55e'
  if (score >= 70) return '#eab308'
  if (score >= 50) return '#f97316'
  return '#ef4444'
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'improving':
      return '↑'
    case 'declining':
      return '↓'
    case 'stable':
      return '→'
    default:
      return '•'
  }
}
// Utility to get color based on trend
const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'improving':
      return '#22c55e'
    case 'declining':
      return '#ef4444'
    case 'stable':
      return '#0ea5e9'
    default:
      return '#6b7280'
  }
}
 // Utility to format time difference in a human-readable way
const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (minutes < 60) {
    return `${minutes}m ago`
  } else {
    return `${hours}h ago`
  }
}
// PredictionsPage component that displays AI predictions for transformers and devices
export default function PredictionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [sortBy, setSortBy] = useState('health')
  const { predictions, loading, error, refetch } = usePredictions()

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

  // Sort predictions based on selected criteria (use only backend predictions)
  const displayedPredictions = predictions || []
  const sortedPredictions = [...displayedPredictions].sort((a: any, b: any) => {
    if (sortBy === 'health') return (b.healthScore || 0) - (a.healthScore || 0)
    if (sortBy === 'risk') return (b.failureProbability || 0) - (a.failureProbability || 0)
    return String(a.device || a.id || '').localeCompare(String(b.device || b.id || ''))
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="lg:ml-64">
        <header className="bg-card border-b border-border pt-4 lg:pt-0">
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Predictions</h1>
              <p className="text-muted-foreground text-sm">Machine learning-based health forecasting</p>
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
              {(error as any)?.response?.data?.message || (error as Error)?.message || 'Unable to load predictions'}
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-muted-foreground text-xs mb-1">Avg Health Score</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.round(displayedPredictions.reduce((sum: number, p: any) => sum + (p.healthScore || 0), 0) / displayedPredictions.length)}%
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-muted-foreground text-xs mb-1">High Risk Devices</p>
              <p className="text-2xl font-bold text-destructive">
                {displayedPredictions.filter((p: any) => (p.failureProbability || 0) > 15).length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-muted-foreground text-xs mb-1">Requiring Action</p>
              <p className="text-2xl font-bold text-primary">
                {displayedPredictions.filter((p: any) => p.trend === 'declining').length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-muted-foreground text-xs mb-1">Total Devices</p>
              <p className="text-2xl font-bold text-foreground">
                {displayedPredictions.length}
              </p>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setSortBy('health')}
              className={`px-4 py-2 rounded transition-colors text-sm font-medium ${
                sortBy === 'health'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-background'
              }`}
            >
              Sort by Health
            </button>
            <button
              onClick={() => setSortBy('risk')}
              className={`px-4 py-2 rounded transition-colors text-sm font-medium ${
                sortBy === 'risk'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-background'
              }`}
            >
              Sort by Risk
            </button>
            <button
              onClick={() => setSortBy('device')}
              className={`px-4 py-2 rounded transition-colors text-sm font-medium ${
                sortBy === 'device'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-background'
              }`}
            >
              Sort by Device
            </button>
          </div>

          {/* Predictions List */}
          <div className="space-y-4">
            {loading ? (
              <div className="bg-card border border-border rounded-lg p-6 text-muted-foreground">Loading predictions...</div>
            ) : sortedPredictions.length > 0 ? (
              <>
                {sortedPredictions.map((pred: any) => (
                  <div key={pred.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{pred.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {pred.type === 'transformer' ? 'Power Transformer' : 'IoT Device'} • Updated {formatTime(pred.lastUpdated)}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-background rounded capitalize">
                        {pred.type}
                      </span>
                    </div>

                    {/* Health Score */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Health Score</p>
                        <p className="text-lg font-bold" style={{ color: getHealthColor(pred.healthScore) }}>
                          {pred.healthScore}%
                        </p>
                      </div>
                      <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${pred.healthScore}%`,
                            backgroundColor: getHealthColor(pred.healthScore),
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Trend */}
                    <div className="flex items-center gap-2 text-sm">
                      <span style={{ color: getTrendColor(pred.trend), fontSize: '16px' }}>
                        {getTrendIcon(pred.trend)}
                      </span>
                      <span className="text-muted-foreground">Trend:</span>
                      <span style={{ color: getTrendColor(pred.trend), fontWeight: 'bold' }} className="capitalize">
                        {pred.trend}
                      </span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    {/* Failure Probability & RUL */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-background rounded p-3">
                        <p className="text-xs text-muted-foreground mb-1">Failure Probability</p>
                        <p className="text-2xl font-bold" style={{ color: getHealthColor(100 - pred.failureProbability) }}>
                          {pred.failureProbability}%
                        </p>
                      </div>
                      <div className="bg-background rounded p-3">
                        <p className="text-xs text-muted-foreground mb-1">Remaining Useful Life</p>
                        <p className="text-lg font-bold text-foreground">{pred.estimatedRUL}</p>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Recommendations</p>
                      <ul className="space-y-1">
                        {(pred.recommendations || []).map((rec: any, idx: number) => (
                          <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
                ))}
              </>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground mb-2">No live data — check backend</p>
                <p className="text-xs text-muted-foreground">Refresh or ensure the predictions endpoint is available.</p>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-primary/10 border border-primary/30 rounded-lg p-4">
            <p className="text-sm text-foreground">
              AI predictions are based on historical data, sensor readings, and machine learning models. Connect your backend to enable real-time predictions.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
