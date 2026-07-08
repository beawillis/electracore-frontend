'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { useDevices } from '../hooks/useDevices'
import deviceService from '../services/deviceService'

export default function DevicesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const { devices, loading, error, refetch } = useDevices()
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [deviceForm, setDeviceForm] = useState({
    name: '',
    deviceId: '',
    type: '',
    transformerId: '',
    location: '',
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

  const handleDeviceChange = (field: string, value: string) => {
    setDeviceForm((current) => ({ ...current, [field]: value }))
  }

  const handleRegisterDevice = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setFormError('')

    if (!deviceForm.name.trim() || !deviceForm.deviceId.trim()) {
      setFormError('Device name and device ID are required')
      return
    }

    setSaving(true)
    try {
      await deviceService.registerDevice({
        name: deviceForm.name.trim(),
        deviceId: deviceForm.deviceId.trim(),
        type: deviceForm.type.trim() || 'monitoring-device',
        transformerId: deviceForm.transformerId.trim() || undefined,
        location: deviceForm.location.trim() || undefined,
      })
      setMessage('Device registered successfully')
      setDeviceForm({ name: '', deviceId: '', type: '', transformerId: '', location: '' })
      setShowRegisterForm(false)
      refetch()
    } catch (err: any) {
      setFormError(err?.response?.data?.message || err?.message || 'Unable to register device')
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
              <h1 className="text-2xl font-bold text-foreground">Devices</h1>
              <p className="text-muted-foreground text-sm">Live IoT device status from the backend</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowRegisterForm((current) => !current)}
                className="px-4 py-2 bg-background border border-border hover:bg-background/80 text-foreground rounded text-sm font-medium"
              >
                {showRegisterForm ? 'Close' : 'Register Device'}
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
              {message}
            </div>
          )}

          {Boolean(error) && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {(error as any)?.response?.data?.message || (error as Error)?.message || 'Unable to load devices'}
            </div>
          )}

          {showRegisterForm && (
            <form onSubmit={handleRegisterDevice} className="mb-8 bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-semibold text-foreground">Register Device</h2>
                  <p className="text-sm text-muted-foreground">Add an IoT monitoring device to the backend inventory.</p>
                </div>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
                <input
                  value={deviceForm.name}
                  onChange={(e) => handleDeviceChange('name', e.target.value)}
                  placeholder="Device name"
                  className="px-3 py-2 bg-[#252536] border border-[#3d3d50] rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  disabled={saving}
                />
                <input
                  value={deviceForm.deviceId}
                  onChange={(e) => handleDeviceChange('deviceId', e.target.value)}
                  placeholder="Device ID"
                  className="px-3 py-2 bg-[#252536] border border-[#3d3d50] rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  disabled={saving}
                />
                <input
                  value={deviceForm.type}
                  onChange={(e) => handleDeviceChange('type', e.target.value)}
                  placeholder="Type"
                  className="px-3 py-2 bg-[#252536] border border-[#3d3d50] rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  disabled={saving}
                />
                <input
                  value={deviceForm.transformerId}
                  onChange={(e) => handleDeviceChange('transformerId', e.target.value)}
                  placeholder="Transformer ID"
                  className="px-3 py-2 bg-[#252536] border border-[#3d3d50] rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  disabled={saving}
                />
                <input
                  value={deviceForm.location}
                  onChange={(e) => handleDeviceChange('location', e.target.value)}
                  placeholder="Location"
                  className="px-3 py-2 bg-[#252536] border border-[#3d3d50] rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  disabled={saving}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-4 px-5 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground rounded text-sm font-medium"
              >
                {saving ? 'Registering...' : 'Save Device'}
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? (
              <div className="bg-card border border-border rounded-lg p-6 text-muted-foreground">Loading devices...</div>
            ) : devices.length > 0 ? (
              devices.map((device: any) => (
                <div key={device.id || device._id || device.deviceId} className="bg-card border border-border rounded-lg p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-foreground">{device.name || device.deviceId || device.id || 'Unnamed device'}</h2>
                      <p className="text-xs text-muted-foreground">{device.type || 'Device'}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-background text-foreground">
                      {device.status || (device.online ? 'online' : 'unknown')}
                    </span>
                  </div>
                  <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                    <p>Transformer: <span className="text-foreground">{device.transformerId || '-'}</span></p>
                    <p>Last seen: <span className="text-foreground">{device.lastSeen || device.updatedAt || '-'}</span></p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground md:col-span-3">
                No devices returned by the backend yet.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
