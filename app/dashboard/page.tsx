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
            <h1 className="flex flex-col text-2xl font-bold text-foreground leading-tight">
              <span>ElectraCore</span>
              <span className="text-sm font-medium text-muted-foreground">Smart Transformer Monitoring System</span>
            </h1>
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
            <h2 className="flex flex-col items-center text-2xl font-bold text-foreground leading-tight mb-4">
              <span>ElectraCore</span>
              <span className="text-sm font-medium text-muted-foreground">Smart Transformer Monitoring System</span>
            </h2>
          </div>
        </div>
      </main>
    </div>
  )
}
