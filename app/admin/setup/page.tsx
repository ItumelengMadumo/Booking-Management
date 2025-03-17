"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Database } from "lucide-react"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)

  const setupDatabase = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/setup-database")
      const data = await response.json()

      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        error: `Failed to set up database: ${error.message}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Setup
          </CardTitle>
          <CardDescription>Create the necessary database tables for your booking application</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">This will create the following tables in your Supabase database:</p>
          <ul className="list-disc pl-5 text-sm text-gray-500 space-y-1">
            <li>
              <code>users</code> - For storing user profiles
            </li>
            <li>
              <code>business_profiles</code> - For storing service provider business details
            </li>
          </ul>

          {result && (
            <Alert className="mt-4" variant={result.success ? "default" : "destructive"}>
              {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{result.message || result.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={setupDatabase} disabled={isLoading} className="w-full">
            {isLoading ? "Setting Up..." : "Set Up Database"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

