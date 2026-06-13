'use client' // Login page with form handling and mock authentication logic

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// LoginPage component that provides a login form and handles authentication logic
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email || !password) {
        setError('Please enter email and password')
        setLoading(false)
        return
      }

      // Mock authentication
      localStorage.setItem('authToken', 'mock-token-' + Date.now())
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: email,
        name: email.split('@')[0],
      }))
      
      router.push('/dashboard')
    } catch (err) {
      setError('Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl p-8">
          <div className="flex items-center gap-3 mb-2">
            
            <Image
             src="/logo.png"
             alt="Electracore Logo"
             width={32}
              height={32}
             />
            <h1 className="text-3xl font-bold text-foreground">Electracore</h1>
          </div>
          <p className="text-muted-foreground mb-8">Smart Transformer Monitoring System</p>

          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                className="w-full px-4 py-3 bg-[#252536] border-2 border-[#3d3d50] rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#252536] border-2 border-[#3d3d50] rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold rounded-lg transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="my-6 text-center text-sm text-muted-foreground">
            Or use demo credentials
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                setEmail('admin@test.com')
                setPassword('demo123')
              }}
              className="w-full py-2 bg-background border border-border rounded-lg text-foreground hover:bg-[#252536] text-sm"
            >
              Demo Admin
            </button>
            <button
              onClick={() => {
                setEmail('user@test.com')
                setPassword('demo123')
              }}
              className="w-full py-2 bg-background border border-border rounded-lg text-foreground hover:bg-[#252536] text-sm"
            >
              Demo User
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:text-primary/80 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
