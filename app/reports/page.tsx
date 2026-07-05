'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'

// Sample reports data
const SAMPLE_REPORTS = [
  {
    id: 1,
    title: 'System Performance Report',
    description: 'Overall system performance, uptime, and efficiency metrics',
    category: 'Performance',
    generatedDate: new Date(Date.now() - 2 * 24 * 60 * 60000),
    period: 'Last 30 Days',
    stats: {
      uptime: 99.8,
      avgResponseTime: 245,
      totalAlerts: 12,
      resolvedAlerts: 10,
    },
    format: 'PDF',
  },
  {
    id: 2,
    title: 'Transformer Health Report',
    description: 'Individual transformer health assessment and trends',
    category: 'Health',
    generatedDate: new Date(Date.now() - 5 * 60 * 60000),
    period: 'Last 7 Days',
    stats: {
      totalTransformers: 5,
      healthy: 4,
      warning: 1,
      critical: 0,
    },
    format: 'PDF',
  },
  {
    id: 3,
    title: 'Alert Summary Report',
    description: 'Historical alert trends and incident analysis',
    category: 'Alerts',
    generatedDate: new Date(Date.now() - 1 * 24 * 60 * 60000),
    period: 'Last 30 Days',
    stats: {
      totalAlerts: 42,
      critical: 5,
      high: 12,
      medium: 15,
    },
    format: 'PDF',
  },
  {
    id: 4,
    title: 'Device Status Report',
    description: 'IoT devices status, connectivity, and performance',
    category: 'Devices',
    generatedDate: new Date(Date.now() - 3 * 60 * 60000),
    period: 'Current',
    stats: {
      totalDevices: 23,
      online: 22,
      offline: 1,
      failureRate: 4.3,
    },
    format: 'PDF',
  },
  {
    id: 5,
    title: 'Predictive Maintenance Report',
    description: 'AI predictions for maintenance scheduling and recommendations',
    category: 'Maintenance',
    generatedDate: new Date(Date.now() - 1 * 60 * 60000),
    period: 'Next 90 Days',
    stats: {
      scheduledMaintenance: 3,
      estimatedDowntime: 8,
      costSavings: 45000,
      riskReduction: 28,
    },
    format: 'PDF',
  },
  {
    id: 6,
    title: 'Sensor Data Analysis',
    description: 'Temperature, voltage, and current readings analysis',
    category: 'Sensors',
    generatedDate: new Date(Date.now() - 12 * 60 * 60000),
    period: 'Last 24 Hours',
    stats: {
      avgTemperature: 45.8,
      maxTemperature: 62.3,
      avgVoltage: 480.2,
      anomalies: 2,
    },
    format: 'CSV',
  },
]

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Performance: '#0ea5e9',
    Health: '#22c55e',
    Alerts: '#ef4444',
    Devices: '#f97316',
    Maintenance: '#a855f7',
    Sensors: '#ec4899',
  }
  return colors[category] || '#6b7280'
}

// ReportsPage component that displays a list of generated reports with filtering and actions
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Utility to get color based on category
export default function ReportsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [message, setMessage] = useState('')

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

  const categories = ['all', ...new Set(SAMPLE_REPORTS.map(r => r.category))]
  const filteredReports = selectedCategory === 'all' 
    ? SAMPLE_REPORTS 
    : SAMPLE_REPORTS.filter(r => r.category === selectedCategory)

  const handleReportAction = (action: string, title?: string) => {
    setMessage(`${action}${title ? `: ${title}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="lg:ml-64">
        <header className="bg-card border-b border-border pt-4 lg:pt-0">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground text-sm">Generate, view, and download system reports</p>
          </div>
        </header>

        <div className="px-6 py-8">
          {message && (
            <div className="mb-6 p-3 bg-primary/10 border border-primary/20 rounded text-primary text-sm">
              {message}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-muted-foreground text-xs mb-1">Total Reports</p>
              <p className="text-3xl font-bold text-foreground">{SAMPLE_REPORTS.length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-muted-foreground text-xs mb-1">Generated This Month</p>
              <p className="text-3xl font-bold text-foreground">
                {SAMPLE_REPORTS.filter(r => {
                  const now = new Date()
                  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60000)
                  return r.generatedDate > monthAgo
                }).length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-muted-foreground text-xs mb-1">System Uptime</p>
              <p className="text-3xl font-bold text-foreground">99.8%</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-muted-foreground text-xs mb-1">Alerts This Month</p>
              <p className="text-3xl font-bold text-foreground">42</p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded transition-colors text-sm font-medium whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:bg-background'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Reports Grid */}
          <div className="space-y-4">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Report Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-3 h-3 rounded-full mt-1"
                          style={{ backgroundColor: getCategoryColor(report.category) }}
                        ></div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground text-lg">{report.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                        </div>
                      </div>

                      {/* Report Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                        {Object.entries(report.stats).map(([key, value]) => (
                          <div key={key} className="bg-background rounded p-3">
                            <p className="text-xs text-muted-foreground mb-1 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              {typeof value === 'number' && (key.includes('Rate') || key.includes('Uptime') || key.includes('Reduction') || key.includes('Savings'))
                                ? `${value}${key.includes('Savings') ? '' : '%'}`
                                : value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Report Meta */}
                      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                        <span>Period: <span className="text-foreground font-medium">{report.period}</span></span>
                        <span>Generated: <span className="text-foreground font-medium">{formatDate(report.generatedDate)}</span></span>
                        <span>Format: <span className="text-foreground font-medium">{report.format}</span></span>
                      </div>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => handleReportAction('Download requested', report.title)}
                        className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors text-sm font-medium"
                      >
                        Download
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReportAction('Viewing details', report.title)}
                        className="w-full px-4 py-2 bg-background border border-border hover:bg-background/80 text-foreground rounded transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReportAction('Share requested', report.title)}
                        className="w-full px-4 py-2 bg-background border border-border hover:bg-background/80 text-foreground rounded transition-colors text-sm font-medium"
                      >
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground">No reports found in this category</p>
              </div>
            )}
          </div>

          {/* Generate New Report */}
          <div className="mt-8 bg-primary/10 border border-primary/30 rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-2">Generate Custom Report</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a custom report by selecting specific date ranges, metrics, and devices.
            </p>
            <button
              type="button"
              onClick={() => handleReportAction('New custom report flow opened')}
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors text-sm font-medium"
            >
              New Report
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
