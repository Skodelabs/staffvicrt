"use client";

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { authService } from '@/services/auth/auth-service'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  
  // Check authentication state on component mount and when localStorage changes
  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth-token')
      setIsLoggedIn(!!token)
    }
    
    // Check initial auth state
    checkAuth()
    
    // Listen for storage events (in case user logs in/out in another tab)
    window.addEventListener('storage', checkAuth)
    
    return () => {
      window.removeEventListener('storage', checkAuth)
    }
  }, [])

  // Handle logout
  const handleLogout = async () => {
    await authService.logout()
    setIsLoggedIn(false)
    router.push('/auth/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600">Student Portal</span>
          </Link>
        </div>
        <nav className="hidden flex-1 items-center space-x-4 md:flex">
          {!isLoggedIn ? (
            // Navigation links for logged out users
            <Link 
              href="/"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === "/" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Home
            </Link>
          ) : (
            // Navigation links for logged in users
            <>
              <Link 
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === "/dashboard" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/student/register"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === "/student/register" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                Registration
              </Link>
              <Link 
                href="/student/applications"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === "/student/applications" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                Applications
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <Button 
              variant="outline" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Link href="/auth/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
