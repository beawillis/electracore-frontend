'use client'

import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Sidebar } from '@/components/layout/Sidebar'

export default function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-card border-b border-border sticky top-0 z-10">
            <div className="px-8 py-6">
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground text-sm">Configure your account and preferences</p>
            </div>
          </header>

          <div className="p-8">
            <div className="max-w-2xl">
              {/* Profile Settings */}
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Profile Settings</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <button className="w-full py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Notifications</h2>

                <div className="space-y-3">
                  {[
                    { label: 'Critical Alerts', desc: 'Get notified of critical issues' },
                    { label: 'Daily Summary', desc: 'Receive daily system reports' },
                    { label: 'Maintenance Due', desc: 'Reminders for scheduled maintenance' },
                    { label: 'Email Notifications', desc: 'Receive alerts via email' },
                  ].map((item, idx) => (
                    <label key={idx} className="flex items-center gap-3 p-3 bg-background rounded cursor-pointer hover:bg-background/80 transition-colors">
                      <input
                        type="checkbox"
                        defaultChecked={idx < 2}
                        className="w-4 h-4 accent-primary"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* API Integration */}
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">API Integration</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Backend API URL
                    </label>
                    <input
                      type="text"
                      value={process.env.REACT_APP_API_URL || ''}
                      readOnly
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground opacity-50 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Socket.IO URL
                    </label>
                    <input
                      type="text"
                      value={process.env.REACT_APP_SOCKET_URL || ''}
                      readOnly
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground opacity-50 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      MQTT Broker
                    </label>
                    <input
                      type="text"
                      value={process.env.REACT_APP_MQTT_URL || ''}
                      readOnly
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground opacity-50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Account</h2>

                <div className="space-y-3">
                  <button className="w-full py-2 px-4 bg-background hover:bg-background/80 text-foreground border border-border rounded-lg transition-colors">
                    Change Password
                  </button>
                  <button className="w-full py-2 px-4 bg-background hover:bg-background/80 text-foreground border border-border rounded-lg transition-colors">
                    Two-Factor Authentication
                  </button>
                  <button className="w-full py-2 px-4 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/30 rounded-lg transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
