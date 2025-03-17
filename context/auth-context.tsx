"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Update the user role type to use generic terminology
type UserRole = "client" | "provider" | "admin"

type User = {
  id: string
  name: string
  email: string
  role: UserRole
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  ensureDatabaseTablesExist: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Function to check if tables exist and create them if needed
const ensureDatabaseTablesExist = async () => {
  // Using function to get toast to avoid React hooks rules violation
  const { toast } = useToast()

  try {
    console.log("Checking if database tables exist...")

    // Call the server-side API to create tables
    const response = await fetch("/api/setup-database", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        setupKey: "create-tables-on-registration",
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Error from setup API:", data)
      toast({
        title: "Database Setup Error",
        description: data.error || "Failed to set up database tables",
        variant: "destructive",
      })
      return false
    }

    console.log("Setup API response:", data)

    if (data.success) {
      toast({
        title: "Database Setup",
        description: "Database tables created successfully",
      })
      return true
    } else {
      toast({
        title: "Database Setup Error",
        description: data.error || "Failed to set up database tables",
        variant: "destructive",
      })
      return false
    }
  } catch (error) {
    console.error("Error ensuring database tables exist:", error)
    toast({
      title: "Database Setup Error",
      description: error instanceof Error ? error.message : "An unexpected error occurred",
      variant: "destructive",
    })
    return false
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse user from localStorage")
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  // Update the login function to use generic terminology
  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create mock user based on role
      const newUser = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        name: email.split("@")[0],
        email,
        role,
      }

      // Save user to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)

      // Redirect based on role
      if (role === "provider") {
        router.push("/provider/dashboard")
      } else {
        router.push("/dashboard/appointments")
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw new Error("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Clear user from localStorage
      localStorage.removeItem("user")
      setUser(null)

      // Redirect to home
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        ensureDatabaseTablesExist,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

