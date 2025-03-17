"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/context/cart-context"
import { Loader2, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { ProtectedRoute } from "@/components/protected-route"

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().min(2, { message: "State must be at least 2 characters" }),
  zipCode: z.string().min(5, { message: "Zip code must be at least 5 characters" }),
  saveInfo: z.boolean().optional(),
  receiveUpdates: z.boolean().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function CheckoutPage() {
  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <CheckoutPageContent />
    </ProtectedRoute>
  )
}

function CheckoutPageContent() {
  const router = useRouter()
  const { items, paymentOption, paymentTotal, clearCart, allItemsScheduled } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      saveInfo: true,
      receiveUpdates: true,
    },
  })

  useEffect(() => {
    // Redirect to cart if no items or not all items are scheduled
    if (items.length === 0 || !allItemsScheduled) {
      router.push("/cart")
    }
  }, [items.length, allItemsScheduled, router])

  if (items.length === 0 || !allItemsScheduled) {
    return null
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // In a real app, this would send the data to your backend
      // along with the cart items and payment option
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store client details in localStorage for the confirmation page
      localStorage.setItem("clientDetails", JSON.stringify(data))

      // Navigate to payment page
      router.push("/payment")
    } catch (error) {
      console.error("Error submitting form:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-muted-foreground mb-8">Please provide your details to complete your booking</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                We'll use this information to send your booking confirmation and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      aria-invalid={errors.firstName ? "true" : "false"}
                    />
                    {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...register("lastName")} aria-invalid={errors.lastName ? "true" : "false"} />
                    {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      aria-invalid={errors.email ? "true" : "false"}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      aria-invalid={errors.phone ? "true" : "false"}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" {...register("address")} aria-invalid={errors.address ? "true" : "false"} />
                  {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city")} aria-invalid={errors.city ? "true" : "false"} />
                    {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" {...register("state")} aria-invalid={errors.state ? "true" : "false"} />
                    {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input id="zipCode" {...register("zipCode")} aria-invalid={errors.zipCode ? "true" : "false"} />
                    {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="saveInfo" {...register("saveInfo")} />
                    <Label htmlFor="saveInfo">Save this information for next time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="receiveUpdates" {...register("receiveUpdates")} />
                    <Label htmlFor="receiveUpdates">Receive booking updates via email and SMS</Label>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {items.length} {items.length === 1 ? "service" : "services"} in your cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.serviceName}</p>
                        <p className="text-sm text-muted-foreground">{item.providerName}</p>
                      </div>
                      <span>${item.price}</span>
                    </div>
                    {item.date && item.time && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{format(new Date(item.date), "MMMM d, yyyy")}</span>
                        <Clock className="h-4 w-4 mx-2" />
                        <span>{item.time}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${items.reduce((total, item) => total + item.price, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Option</span>
                  <span>{paymentOption === "deposit" ? "Deposit" : "Full Payment"}</span>
                </div>
              </div>

              {paymentOption === "deposit" && (
                <div className="text-sm text-muted-foreground">
                  <p>
                    Balance due at appointment: $
                    {items.reduce((total, item) => total + item.price, 0) -
                      items.reduce((total, item) => total + item.depositAmount, 0)}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <div className="flex justify-between w-full text-lg font-bold">
                <span>Total</span>
                <span>${paymentTotal}</span>
              </div>
              <Button type="submit" form="checkout-form" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue to Payment"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

