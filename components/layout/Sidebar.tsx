'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const menuItems = [
  { icon: '📊', label: 'Dashboard', href: '/dashboard' },
  { icon: '⚡', label: 'Transformers', href: '/transformers' },
  { icon: '🔌', label: 'Devices', href: '/devices' },
  { icon: '📈', label: 'Sensors', href: '/sensors' },
  { icon: '⚠️', label: 'Alerts', href: '/alerts' },
  { icon: '🤖', label: 'AI Predictions', href: '/predictions' },
  { icon: '📋', label: 'Reports', href: '/reports' },
  { icon: '⚙️', label: 'Settings', href: '/settings' },
]

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(true)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-card border-r border-border transition-all duration-300 h-screen flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {isOpen && (
          <div>
            <h1 className="text-lg font-bold text-primary">ElectraCore</h1>
            <p className="text-xs text-muted-foreground">Monitoring</p>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-background rounded transition-colors"
        >
          {isOpen ? '←' : '→'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-primary/10 text-primary border border-primary'
                : 'text-foreground hover:bg-background'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-border p-4 space-y-2">
        {isOpen && (
          <div className="p-2 bg-background rounded">
            <p className="text-xs text-muted-foreground">Logged in as</p>
            <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded transition-colors text-sm font-medium"
        >
          {isOpen ? 'Logout' : '🚪'}
        </button>
      </div>
    </aside>
  )
}
