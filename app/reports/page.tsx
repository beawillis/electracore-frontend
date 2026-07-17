'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { useReports } from '../hooks/useReports'
import ReportTimeseries from '../../components/reports/ReportTimeseries'


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
const formatDate = (date?: string | Date | null) => {
  if (!date) return 'N/A'
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

const labelFromKey = (key: string) => key.replace(/([A-Z])/g, ' $1').trim()

const pdfSafe = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/[^\x20-\x7E]/g, '')

const buildReportPdf = (report: any) => {
  const lines = [
    report.title,
    report.description,
    `Category: ${report.category}`,
    `Period: ${report.period}`,
    `Generated: ${formatDate(report.generatedDate)}`,
    `Format: ${report.format || 'pdf'}`,
    '',
    'Metrics',
    ...Object.entries(report.stats || {}).map(([key, value]) => `${labelFromKey(key)}: ${value}`),
  ]

  const textCommands = lines
    .slice(0, 34)
    .map((line, index) => `BT /F1 12 Tf 50 ${760 - index * 20} Td (${pdfSafe(String(line))}) Tj ET`)
    .join('\n')
  const content = `${textCommands}\n`
  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
    '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
    `5 0 obj << /Length ${content.length} >> stream\n${content}endstream endobj`,
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((object) => {
    offsets.push(pdf.length)
    pdf += `${object}\n`
  })
  const xrefStart = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  })
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`

  return new Blob([pdf], { type: 'application/pdf' })
}

const getReportShareText = (report: any) =>
  `${report.title}\n${report.description}\nPeriod: ${report.period || 'N/A'}\nGenerated: ${formatDate(report.generatedDate)}`

// Utility to get color based on category
export default function ReportsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [message, setMessage] = useState('')
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [shareReport, setShareReport] = useState<any>(null)

  const { reports, count, loading: reportsLoading, error: reportsError, refetch: refetchReports } = useReports()

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
  const categories = ['all']
  const filteredReports = reports || []

  const handleDownload = (report: any) => {
    const blob = buildReportPdf(report)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${report.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setMessage(`Downloaded PDF: ${report.title}`)
  }

  const handleNativeShare = async (report: any) => {
    const shareData = {
      title: report.title,
      text: getReportShareText(report),
      url: window.location.href,
    }

    if (navigator.share) {
      await navigator.share(shareData)
      setMessage(`Shared: ${report.title}`)
      return
    }

    await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
    setMessage('Report summary copied to clipboard')
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

          {Boolean(reportsError) && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                <p className="font-semibold">Unable to load reports</p>
                <p>{(reportsError as any)?.response?.data?.message || (reportsError as any)?.message || 'An unexpected error occurred.'}</p>
              </div>
          )}

          {reportsLoading && (
            <div className="mb-6 p-6 bg-card border border-border rounded-lg text-center text-muted-foreground">
              Loading reports...
            </div>
          )}

          {!reportsLoading && (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-xs mb-1">Total Reports</p>
                  <p className="text-3xl font-bold text-foreground">{count}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-xs mb-1">Generated This Month</p>
                  <p className="text-3xl font-bold text-foreground">0</p>
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
            </>
          )}

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
              filteredReports.map((report: any) => {
                const reportKey = report.id || report._id || report.reportId || `${report.title || 'report'}-${report.period}`
                return (
                  <div
                    key={reportKey}
                    className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                          {Object.entries(report.stats || {}).map(([key, value]) => (
                            <div key={key} className="bg-background rounded p-3">
                              <p className="text-xs text-muted-foreground mb-1 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {typeof value === 'number' && (key.includes('Rate') || key.includes('Uptime') || key.includes('Reduction') || key.includes('Savings'))
                                  ? `${value}${key.includes('Savings') ? '' : '%'}`
                                  : String(value)}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                          <span>Period: <span className="text-foreground font-medium">{report.period || 'N/A'}</span></span>
                          <span>Generated: <span className="text-foreground font-medium">{formatDate(report.generatedDate)}</span></span>
                          <span>Format: <span className="text-foreground font-medium">{report.format || 'pdf'}</span></span>
                        </div>

                        <ReportTimeseries reportId={report.id || report._id || report.reportId} />
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownload(report)}
                          className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors text-sm font-medium"
                        >
                          Download
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedReport(report)}
                          className="w-full px-4 py-2 bg-background border border-border hover:bg-background/80 text-foreground rounded transition-colors text-sm font-medium"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => setShareReport(shareReport?.id === report.id ? null : report)}
                          className="w-full px-4 py-2 bg-background border border-border hover:bg-background/80 text-foreground rounded transition-colors text-sm font-medium"
                        >
                          Share
                        </button>
                        {shareReport?.id === report.id && (
                          <div className="bg-background border border-border rounded p-3 space-y-2">
                            <button
                              type="button"
                              onClick={() => handleNativeShare(report)}
                              className="w-full text-left text-sm text-foreground hover:text-primary"
                            >
                              Share with device options
                            </button>
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(getReportShareText(report))}`}
                              target="_blank"
                              rel="noreferrer"
                              className="block text-sm text-foreground hover:text-primary"
                            >
                              WhatsApp
                            </a>
                            <a
                              href={`sms:?&body=${encodeURIComponent(getReportShareText(report))}`}
                              className="block text-sm text-foreground hover:text-primary"
                            >
                              Message
                            </a>
                            <a
                              href={`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(report.title)}&body=${encodeURIComponent(getReportShareText(report))}`}
                              target="_blank"
                              rel="noreferrer"
                              className="block text-sm text-foreground hover:text-primary"
                            >
                              Gmail
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
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
              onClick={() => setMessage('Custom report generation is ready for backend filters')}
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors text-sm font-medium"
            >
              New Report
            </button>
          </div>
        </div>
      </main>

      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">{selectedReport.title}</h2>
                <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-3 py-1 bg-background border border-border rounded text-sm text-foreground"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-background rounded p-3">
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="font-semibold text-foreground">{selectedReport.category}</p>
              </div>
              <div className="bg-background rounded p-3">
                <p className="text-xs text-muted-foreground">Period</p>
                <p className="font-semibold text-foreground">{selectedReport.period}</p>
              </div>
              <div className="bg-background rounded p-3">
                <p className="text-xs text-muted-foreground">Generated</p>
                <p className="font-semibold text-foreground">{formatDate(selectedReport.generatedDate)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(selectedReport.stats).map(([key, value]) => (
                <div key={key} className="bg-background rounded p-3">
                  <p className="text-xs text-muted-foreground mb-1 capitalize">{labelFromKey(key)}</p>
                  <p className="text-sm font-semibold text-foreground">{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
