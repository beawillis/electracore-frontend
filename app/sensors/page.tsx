'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { useLiveReadings } from '../hooks/useSensors'
import { useTransformers } from '../hooks/useTransformers'

export default function SensorsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedTransformerId, setSelectedTransformerId] = useState('')
  const { transformers } = useTransformers()
  const activeTransformerId = selectedTransformerId || transformers[0]?.id || transformers[0]?._id || ''
  const { readings, loading, error, refetch } = useLiveReadings(activeTransformerId)

  const selectedTransformerName = useMemo(() => {
    const transformer = transformers.find((item: any) => (item.id || item._id) === activeTransformerId)
    return transformer?.name || activeTransformerId || 'No transformer selected'
  }, [activeTransformerId, transformers])

  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token) {
      router.push('/login')
      return
    }

    if (userData) setUser(JSON.parse(userData))
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
          <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sensors</h1>
              <p className="text-muted-foreground text-sm">Live readings for {selectedTransformerName}</p>
            </div>
            <div className="flex gap-2">
              <select
                value={activeTransformerId}
                onChange={(event) => setSelectedTransformerId(event.target.value)}
                className="px-3 py-2 bg-background border border-border rounded text-foreground text-sm"
              >
                {transformers.length === 0 ? (
                  <option value="">No transformers</option>
                ) : (
                  transformers.map((transformer: any) => (
                    <option key={transformer.id || transformer._id} value={transformer.id || transformer._id}>
                      {transformer.name || transformer.id || transformer._id}
                    </option>
                  ))
                )}
              </select>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={!activeTransformerId}
                className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground rounded text-sm font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </header>

        <div className="px-6 py-8">
          {Boolean(error) && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {(error as any)?.response?.data?.message || (error as Error)?.message || 'Unable to load sensor readings'}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading ? (
              <div className="bg-card border border-border rounded-lg p-6 text-muted-foreground">Loading readings...</div>
            ) : readings.length > 0 ? (
              readings.map((reading: any, index: number) => (
                <div key={reading.id || reading._id || `${reading.sensorType}-${index}`} className="bg-card border border-border rounded-lg p-5">
                  <p className="text-sm text-muted-foreground">{reading.sensorType || reading.type || 'Sensor'}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {reading.value ?? '-'}{reading.unit ? ` ${reading.unit}` : ''}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">{reading.timestamp || reading.createdAt || '-'}</p>
                </div>
              ))
            ) : (
              <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground md:col-span-3 xl:col-span-4">
                No live readings returned by the backend yet.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
