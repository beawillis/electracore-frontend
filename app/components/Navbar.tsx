'use client' // Navbar component for desktop and mobile navigation

// Imports
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

// Navigation items for the sidebar and mobile menu
const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Transformers', href: '/transformers', icon: '⚡' },
  { name: 'Devices', href: '/devices', icon: '🔧' },
  { name: 'Sensors', href: '/sensors', icon: '📡' },
  { name: 'Alerts', href: '/alerts', icon: '🚨' },
  { name: 'Predictions', href: '/predictions', icon: '🤖' },
  { name: 'Reports', href: '/reports', icon: '📈' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
]

// Navbar component with responsive design for desktop and mobile
export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border fixed left-0 top-0 h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <Image
            src="/logo.png"
            alt="Electracore Logo"
             width={32}
              height={32}
             />
            <div>
              <h1 className="text-2xl font-bold text-primary">ElectraCore</h1>
              <p className="text-xs font-medium text-muted-foreground">Smart Transformer Monitoring System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-foreground hover:bg-background'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-destructive hover:bg-destructive/90 text-white rounded-lg transition text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-card border-b border-border sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="flex flex-col text-xl font-bold text-primary leading-tight">
            <span>ElectraCore</span>
            <span className="text-[10px] font-medium text-muted-foreground">Smart Transformer Monitoring System</span>
          </h1>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 hover:bg-background rounded-lg"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <nav className="px-4 py-4 space-y-2 border-t border-border bg-card">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-background'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="text-sm">{item.name}</span>
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="w-full mt-2 px-4 py-2 bg-destructive hover:bg-destructive/90 text-white rounded-lg transition text-sm"
            >
              Logout
            </button>
          </nav>
        )}
      </header>
    </>
  )
}
