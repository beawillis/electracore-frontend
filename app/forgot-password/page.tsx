'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import authService from '../services/authService'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const normalizedEmail = email.trim().toLowerCase()

      if (!normalizedEmail) {
        setError('Please enter your email address')
        setLoading(false)
        return
      }

      await authService.forgotPassword(normalizedEmail)
      setMessage('If that email exists, password reset instructions have been sent.')
      setEmail('')
    } catch (err: any) {
      // Log full server response for debugging validation errors
      console.error('Forgot password error:', err?.response?.data || err)
      setError(err?.response?.data?.message || err?.message || 'Unable to request password reset')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl p-8">
          <div className="flex items-center gap-3 mb-2">
            <Image src="/logo.png" alt="Electracore Logo" width={32} height={32} />
            <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
          </div>
          <p className="text-muted-foreground mb-8">Enter your account email to receive reset instructions.</p>

          {message && (
            <div className="mb-6 p-3 bg-primary/10 border border-primary/20 rounded text-primary text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                className="w-full px-4 py-3 bg-[#252536] border-2 border-[#3d3d50] rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold rounded-lg transition"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Remember your password?{' '}
            <Link href="/login" className="text-primary hover:text-primary/80 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
