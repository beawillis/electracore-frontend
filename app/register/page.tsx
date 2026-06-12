'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      // Mock registration
      localStorage.setItem('authToken', 'mock-token-' + Date.now())
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: email,
        name: name,
      }))
      
      router.push('/dashboard')
    } catch (err) {
      setError('Registration failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl p-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">ElectraCore</h1>
          <p className="text-muted-foreground mb-8">Create your account</p>

          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-[#252536] border-2 border-[#3d3d50] rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={loading}
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary/80 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">ElectraCore</h1>
          <p className="text-muted-foreground">Smart Transformer Monitoring</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-lg p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Create Account</h2>

          {/* Error Message */}
          {(formError || error) && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm">
              {formError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-[#252536] border-2 border-[#3d3d50] rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-[#252536] border-2 border-[#3d3d50] rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#252536] border-2 border-[#3d3d50] rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#252536] border-2 border-[#3d3d50] rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Already have an account?</span>
            </div>
          </div>

          {/* Sign In Link */}
          <Link
            href="/login"
            className="w-full py-2 px-4 border border-primary rounded-lg text-primary font-semibold hover:bg-primary/10 transition-colors text-center inline-block"
          >
            Sign In
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-muted-foreground text-sm">
          <p>Join thousands of energy professionals</p>
        </div>
      </div>
    </div>
  )
}
