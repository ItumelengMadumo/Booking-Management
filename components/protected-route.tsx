"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "client" | "provider" | "admin"
  allowedRoles?: Array<"client" | "provider" | "admin">
  redirectTo?: string
}

export function ProtectedRoute({ children, requiredRole, allowedRoles, redirectTo = "/login" }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(redirectTo)
      return
    }

    // If specific role is required and user doesn't have it
    if (requiredRole && user?.role !== requiredRole) {
      // Redirect providers to provider dashboard
      if (user?.role === "provider") {
        router.push("/provider/dashboard")
        return
      }

      // Redirect clients to client dashboard
      if (user?.role === "client") {
        router.push("/dashboard/appointments")
        return
      }

      // Fallback redirect
      router.push("/")
      return
    }

    // If allowed roles are specified and user's role is not in the list
    if (allowedRoles && allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      // Redirect providers to provider dashboard
      if (user.role === "provider") {
        router.push("/provider/dashboard")
        return
      }

      // Redirect clients to client dashboard
      if (user.role === "client") {
        router.push("/dashboard/appointments")
        return
      }

      // Fallback redirect
      router.push("/")
    }
  }, [isLoading, isAuthenticated, user, requiredRole, allowedRoles, router, redirectTo])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render anything if not authenticated or doesn't have required role
  if (!isAuthenticated) {
    return null
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null
  }

  if (allowedRoles && allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}

