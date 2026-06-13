'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Home component that checks for authentication and redirects to dashboard or login page accordingly, with a loading state while checking authentication
export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-foreground">Redirecting...</p>
      </div>
    </div>
  )
}
