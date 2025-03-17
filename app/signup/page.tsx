"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"

// Client schema
const clientSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().min(10, { message: "Please enter a valid phone number" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Provider schema with business details
const providerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().min(10, { message: "Please enter a valid phone number" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    businessName: z.string().min(2, { message: "Business name must be at least 2 characters" }),
    businessAddress: z.object({
      street: z.string().min(1, { message: "Street address is required" }),
      city: z.string().min(1, { message: "City is required" }),
      state: z.string().min(1, { message: "State is required" }),
      zipCode: z.string().min(1, { message: "Zip code is required" }),
    }),
    businessDescription: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { register, isLoading } = useAuth()

  // Client form state
  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  // Provider form state
  const [providerForm, setProviderForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    businessDescription: "",
  })

  // Form errors
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})
  const [providerErrors, setProviderErrors] = useState<Record<string, string>>({})

  // Handle client form changes
  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setClientForm((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (clientErrors[name]) {
      setClientErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle provider form changes
  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.startsWith("businessAddress.")) {
      const addressField = name.split(".")[1]
      setProviderForm((prev) => ({
        ...prev,
        businessAddress: {
          ...prev.businessAddress,
          [addressField]: value,
        },
      }))

      // Clear address error
      if (providerErrors[name]) {
        setProviderErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    } else {
      setProviderForm((prev) => ({ ...prev, [name]: value }))

      // Clear error when field is edited
      if (providerErrors[name]) {
        setProviderErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    }
  }

  // Handle client form submission
  const handleClientSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      // Validate form
      clientSchema.parse(clientForm)

      // Register client
      await register({
        name: clientForm.name,
        email: clientForm.email,
        phone: clientForm.phone,
        password: clientForm.password,
        role: "client",
      })

      toast({
        title: "Account created",
        description: "Your client account has been created successfully.",
      })

      // Redirect to login
      router.push("/login")
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format validation errors
        const formattedErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path) {
            formattedErrors[err.path[0]] = err.message
          }
        })
        setClientErrors(formattedErrors)
      } else {
        toast({
          title: "Error",
          description: "Failed to create account. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  // Handle provider form submission
  const handleProviderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      // Validate form
      providerSchema.parse(providerForm)

      // Register provider
      await register({
        name: providerForm.name,
        email: providerForm.email,
        phone: providerForm.phone,
        password: providerForm.password,
        role: "provider",
        businessDetails: {
          name: providerForm.businessName,
          address: providerForm.businessAddress,
          description: providerForm.businessDescription,
        },
      })

      toast({
        title: "Account created",
        description: "Your service provider account has been created successfully.",
      })

      // Redirect to login
      router.push("/login")
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format validation errors
        const formattedErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path) {
            const path = Array.isArray(err.path) ? err.path.join(".") : err.path
            formattedErrors[path] = err.message
          }
        })
        setProviderErrors(formattedErrors)
      } else {
        toast({
          title: "Error",
          description: "Failed to create account. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create an account</CardTitle>
            <CardDescription className="text-center">Choose your account type and enter your details</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="client" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="client">Client</TabsTrigger>
                <TabsTrigger value="provider">Service Provider</TabsTrigger>
              </TabsList>

              {/* Client Sign Up Form */}
              <TabsContent value="client">
                <form onSubmit={handleClientSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Full Name</Label>
                    <Input
                      id="client-name"
                      name="name"
                      placeholder="John Doe"
                      value={clientForm.name}
                      onChange={handleClientChange}
                      required
                    />
                    {clientErrors.name && <p className="text-sm text-destructive">{clientErrors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-email">Email</Label>
                    <Input
                      id="client-email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={clientForm.email}
                      onChange={handleClientChange}
                      required
                    />
                    {clientErrors.email && <p className="text-sm text-destructive">{clientErrors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-phone">Phone Number</Label>
                    <Input
                      id="client-phone"
                      name="phone"
                      type="tel"
                      placeholder="(123) 456-7890"
                      value={clientForm.phone}
                      onChange={handleClientChange}
                      required
                    />
                    {clientErrors.phone && <p className="text-sm text-destructive">{clientErrors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-password">Password</Label>
                    <Input
                      id="client-password"
                      name="password"
                      type="password"
                      value={clientForm.password}
                      onChange={handleClientChange}
                      required
                    />
                    {clientErrors.password && <p className="text-sm text-destructive">{clientErrors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-confirm-password">Confirm Password</Label>
                    <Input
                      id="client-confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={clientForm.confirmPassword}
                      onChange={handleClientChange}
                      required
                    />
                    {clientErrors.confirmPassword && (
                      <p className="text-sm text-destructive">{clientErrors.confirmPassword}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Client Account"}
                  </Button>
                </form>
              </TabsContent>

              {/* Provider Sign Up Form */}
              <TabsContent value="provider">
                <form onSubmit={handleProviderSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider-name">Full Name</Label>
                    <Input
                      id="provider-name"
                      name="name"
                      placeholder="John Doe"
                      value={providerForm.name}
                      onChange={handleProviderChange}
                      required
                    />
                    {providerErrors.name && <p className="text-sm text-destructive">{providerErrors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provider-email">Email</Label>
                    <Input
                      id="provider-email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={providerForm.email}
                      onChange={handleProviderChange}
                      required
                    />
                    {providerErrors.email && <p className="text-sm text-destructive">{providerErrors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provider-phone">Phone Number</Label>
                    <Input
                      id="provider-phone"
                      name="phone"
                      type="tel"
                      placeholder="(123) 456-7890"
                      value={providerForm.phone}
                      onChange={handleProviderChange}
                      required
                    />
                    {providerErrors.phone && <p className="text-sm text-destructive">{providerErrors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input
                      id="business-name"
                      name="businessName"
                      placeholder="Acme Services"
                      value={providerForm.businessName}
                      onChange={handleProviderChange}
                      required
                    />
                    {providerErrors.businessName && (
                      <p className="text-sm text-destructive">{providerErrors.businessName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Business Address</Label>
                    <div className="grid gap-2">
                      <Input
                        name="businessAddress.street"
                        placeholder="Street Address"
                        value={providerForm.businessAddress.street}
                        onChange={handleProviderChange}
                        required
                      />
                      {providerErrors["businessAddress.street"] && (
                        <p className="text-sm text-destructive">{providerErrors["businessAddress.street"]}</p>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Input
                            name="businessAddress.city"
                            placeholder="City"
                            value={providerForm.businessAddress.city}
                            onChange={handleProviderChange}
                            required
                          />
                          {providerErrors["businessAddress.city"] && (
                            <p className="text-sm text-destructive">{providerErrors["businessAddress.city"]}</p>
                          )}
                        </div>
                        <div>
                          <Input
                            name="businessAddress.state"
                            placeholder="State"
                            value={providerForm.businessAddress.state}
                            onChange={handleProviderChange}
                            required
                          />
                          {providerErrors["businessAddress.state"] && (
                            <p className="text-sm text-destructive">{providerErrors["businessAddress.state"]}</p>
                          )}
                        </div>
                      </div>

                      <Input
                        name="businessAddress.zipCode"
                        placeholder="Zip Code"
                        value={providerForm.businessAddress.zipCode}
                        onChange={handleProviderChange}
                        required
                      />
                      {providerErrors["businessAddress.zipCode"] && (
                        <p className="text-sm text-destructive">{providerErrors["businessAddress.zipCode"]}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-description">Business Description</Label>
                    <Textarea
                      id="business-description"
                      name="businessDescription"
                      placeholder="Tell us about your business and services..."
                      value={providerForm.businessDescription}
                      onChange={handleProviderChange}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provider-password">Password</Label>
                    <Input
                      id="provider-password"
                      name="password"
                      type="password"
                      value={providerForm.password}
                      onChange={handleProviderChange}
                      required
                    />
                    {providerErrors.password && <p className="text-sm text-destructive">{providerErrors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provider-confirm-password">Confirm Password</Label>
                    <Input
                      id="provider-confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={providerForm.confirmPassword}
                      onChange={handleProviderChange}
                      required
                    />
                    {providerErrors.confirmPassword && (
                      <p className="text-sm text-destructive">{providerErrors.confirmPassword}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Provider Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

