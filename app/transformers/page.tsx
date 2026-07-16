'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { useTransformers } from '../hooks/useTransformers'
import transformerService from '../services/transformerService'

export default function TransformersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const { transformers, loading, error, refetch } = useTransformers()
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [transformerForm, setTransformerForm] = useState({
    name: '',
    transformerId: '',
    location: '',
    capacity: '',
    status: 'healthy',
  })

  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token) {
      router.push('/login')
      return
    }

    if (userData) setUser(JSON.parse(userData))
  }, [router])

  const handleTransformerChange = (field: string, value: string) => {
    setTransformerForm((current) => ({ ...current, [field]: value }))
  }

  const getRegistrationErrorMessage = (err: any) => {
    if (err?.response?.status === 401) {
      return 'Your session has expired or the backend rejected the request. Please sign in again and try once more.'
    }
    if (err?.response?.status === 403) {
      return 'You do not have permission to register transformers on this backend.'
    }
    if (err?.response?.status === 404) {
      return 'The backend registration endpoint is not available right now.'
    }
    return err?.response?.data?.message || err?.message || 'Unable to register transformer'
  }

  const handleRegisterTransformer = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setFormError('')

    if (!transformerForm.name.trim() || !transformerForm.transformerId.trim()) {
      setFormError('Transformer name and transformer ID are required')
      return
    }

    const payload = {
      name: transformerForm.name.trim(),
      transformerId: transformerForm.transformerId.trim(),
      location: transformerForm.location.trim() || undefined,
      capacity: transformerForm.capacity.trim() || undefined,
      status: transformerForm.status,
    }

    setSaving(true)
    try {
      try {
        await transformerService.registerTransformer(payload)
      } catch (err: any) {
        if (err?.response?.status !== 404) throw err
        await transformerService.createTransformer(payload)
      }
      setMessage('Transformer registered successfully')
      setTransformerForm({ name: '', transformerId: '', location: '', capacity: '', status: 'healthy' })
      setShowRegisterForm(false)
      refetch()
    } catch (err: any) {
      setFormError(getRegistrationErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

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
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowRegisterForm((current) => !current)}
                className="px-4 py-2 bg-background border border-border hover:bg-background/80 text-foreground rounded text-sm font-medium"
              >
                {showRegisterForm ? 'Close' : 'Register Transformer'}
              </button>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded text-sm font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </header>

        <div className="px-6 py-8">
          {message && (
            <div className="mb-6 p-3 bg-primary/10 border border-primary/20 rounded text-primary text-sm">
              {typeof message === 'string' ? message : JSON.stringify(message)}
            </div>
          )}

          {Boolean(error) && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {(error as any)?.response?.data?.message || (error as Error)?.message || 'Unable to load transformers'}
            </div>
          )}

          {showRegisterForm && (
            <form onSubmit={handleRegisterTransformer} className="mb-8 bg-card border border-border rounded-lg p-5">
              <div className="mb-4">
                <h2 className="font-semibold text-foreground">Register Transformer</h2>
                <p className="text-sm text-muted-foreground">Add a transformer to the monitoring inventory.</p>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
                  {typeof formError === 'string' ? formError : JSON.stringify(formError)}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
                <input
                  value={transformerForm.name}
                  onChange={(e) => handleTransformerChange('name', e.target.value)}
                  placeholder="Transformer name"
                  className="px-3 py-2 bg-[#252536] border border-[#3d3d50] rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  disabled={saving}
                />
                <input
                  value={transformerForm.transformerId}
                  onChange={(e) => handleTransformerChange('transformerId', e.target.value)}
                  placeholder="Transformer ID"
                  className="px-3 py-2 bg-[#252536] border border-[#3d3d50] rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  disabled={saving}
                />
                <input
                  value={transformerForm.location}
                  onChange={(e) => handleTransformerChange('location', e.target.value)}
                  placeholder="Location"
                  className="px-3 py-2 bg-[#252536] border border-[#3d3d50] rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  disabled={saving}
                />
                <input
                  value={transformerForm.capacity}
                  onChange={(e) => handleTransformerChange('capacity', e.target.value)}
                  placeholder="Capacity / rating"
                  className="px-3 py-2 bg-[#252536] border border-[#3d3d50] rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  disabled={saving}
                />
                <select
                  value={transformerForm.status}
                  onChange={(e) => handleTransformerChange('status', e.target.value)}
                  className="px-3 py-2 bg-[#252536] border border-[#3d3d50] rounded text-foreground focus:outline-none focus:border-primary"
                  disabled={saving}
                >
                  <option value="healthy">Healthy</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                  <option value="offline">Offline</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-4 px-5 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground rounded text-sm font-medium"
              >
                {saving ? 'Registering...' : 'Save Transformer'}
              </button>
            </form>
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
