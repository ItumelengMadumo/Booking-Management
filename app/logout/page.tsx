"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function LogoutPage() {
  const router = useRouter()
  const { logout, isLoading } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleCancel = () => {
    // Go back to the previous page
    router.back()
  }

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Log Out</CardTitle>
          <CardDescription className="text-center">Are you sure you want to log out?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4 bg-muted p-4 rounded-md mb-4">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">
                You will be logged out of your account and will need to log in again to access your appointments and
                bookings.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoggingOut || isLoading}
            className="flex items-center"
          >
            {isLoggingOut || isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Logging Out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

