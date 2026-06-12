'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'

export default function DashboardPage() {
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

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="bg-card border-b border-border pt-4 lg:pt-0">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Welcome, {user?.name || 'User'}</p>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-2">Total Transformers</p>
              <p className="text-3xl font-bold text-foreground">—</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-2">Active Devices</p>
              <p className="text-3xl font-bold text-foreground">—</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-2">System Health</p>
              <p className="text-3xl font-bold text-foreground">—</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-2">Critical Alerts</p>
              <p className="text-3xl font-bold text-foreground">—</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Dashboard Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              The full dashboard with real-time monitoring is under development.
            </p>
            <div className="space-y-2 text-left inline-block">
              <h3 className="font-semibold text-foreground mb-3">Next Steps:</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>Build your backend API</li>
                <li>Configure Socket.IO for real-time updates</li>
                <li>Setup MQTT for device data</li>
                <li>Connect frontend to your backend</li>
                <li>Implement device management</li>
                <li>Add monitoring and alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
