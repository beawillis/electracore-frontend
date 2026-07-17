"use client"

import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import reportsService from '../../app/services/reportsService'
import dashboardService from '../../app/services/dashboardService'

type Point = { timestamp: string; value: number }

export default function ReportTimeseries({ reportId, initialSeries }: { reportId?: string; initialSeries?: Point[] }) {
  const [loading, setLoading] = useState(false)
  const [series, setSeries] = useState<Point[] | null>(initialSeries || null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!reportId) return
    if (series) return
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
        try {
          const res = await reportsService.getReportSeries(reportId)
          // Expecting { data: [...] } or array directly
          const payload = res?.data || res || []
          const normalized = (Array.isArray(payload) ? payload : payload.series || []).map((p: any) => ({
            timestamp: p.timestamp || p.time || p.t,
            value: Number(p.value ?? p.y ?? p.v ?? 0),
          }))
          if (mounted) setSeries(normalized)
        } catch (err: any) {
          // If no report timeseries endpoint, fall back to dashboard trend data
          if (err?.response?.status === 404) {
            try {
              const trend = await dashboardService.getTrendData('7d')
              const payload = trend?.data || trend || []
              const normalized = (Array.isArray(payload) ? payload : payload.trends || []).map((p: any) => ({
                timestamp: p.timestamp || p.time || p.t,
                value: Number(p.value ?? p.y ?? p.v ?? 0),
              }))
              if (mounted) setSeries(normalized)
              return
            } catch (e: any) {
              if (mounted) setError(e?.message || 'Unable to load fallback trend data')
              return
            }
          }
          if (mounted) setError(err?.message || 'Unable to load series')
        } finally {
          if (mounted) setLoading(false)
        }
    }
    load()
    return () => {
      mounted = false
    }
  }, [reportId])

  if (!reportId) return null

  if (loading) return <div className="mt-4 text-sm text-muted-foreground">Loading chart…</div>
  if (error) return <div className="mt-4 text-sm text-destructive">{error}</div>
  if (!series || series.length === 0)
    return <div className="mt-4 text-sm text-muted-foreground">No time-series data available for this report.</div>

  // Map timestamps to readable labels
  const data = series.map((p) => ({ ...p, t: new Date(p.timestamp).toLocaleString() }))

  return (
    <div className="mt-4 w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" tick={{ fontSize: 11 }} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#0ea5e9" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
