'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { useTransformers } from '../hooks/useTransformers'

export default function TransformersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const { transformers, loading, error, refetch } = useTransformers()

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
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Transformers</h1>
              <p className="text-muted-foreground text-sm">Live transformer health and status</p>
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
              {(error as any)?.response?.data?.message || (error as Error)?.message || 'Unable to load transformers'}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {loading ? (
              <div className="bg-card border border-border rounded-lg p-6 text-muted-foreground">Loading transformers...</div>
            ) : transformers.length > 0 ? (
              transformers.map((transformer: any) => (
                <div key={transformer.id || transformer._id} className="bg-card border border-border rounded-lg p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-foreground">{transformer.name || transformer.id || 'Unnamed transformer'}</h2>
                      <p className="text-xs text-muted-foreground">{transformer.location || 'No location'}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-background text-foreground">
                      {transformer.status || 'unknown'}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-background rounded p-3">
                      <p className="text-muted-foreground text-xs">Health</p>
                      <p className="text-foreground font-semibold">{transformer.healthScore ?? transformer.health ?? '-'}</p>
                    </div>
                    <div className="bg-background rounded p-3">
                      <p className="text-muted-foreground text-xs">Last update</p>
                      <p className="text-foreground font-semibold">{transformer.lastUpdated || transformer.updatedAt || '-'}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground md:col-span-2 xl:col-span-3">
                No transformers returned by the backend yet.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
