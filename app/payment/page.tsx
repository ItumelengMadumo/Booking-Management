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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { Loader2, CreditCard, Lock, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { ProtectedRoute } from "@/components/protected-route"

// Update the form schema to make expiry month and year optional
const formSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, { message: "Card number must be 16 digits" }),
  cardName: z.string().min(2, { message: "Cardholder name is required" }),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  cvv: z.string().regex(/^\d{3,4}$/, { message: "CVV must be 3 or 4 digits" }),
})

type FormValues = z.infer<typeof formSchema>

export default function PaymentPage() {
  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <PaymentPageContent />
    </ProtectedRoute>
  )
}

function PaymentPageContent() {
  const router = useRouter()
  const { items, paymentOption, paymentTotal, clearCart, allItemsScheduled } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clientDetails, setClientDetails] = useState<any>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    // Get client details from localStorage
    const storedClientDetails = localStorage.getItem("clientDetails")
    if (storedClientDetails) {
      setClientDetails(JSON.parse(storedClientDetails))
    }

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
      // In a real app, this would process the payment through a payment gateway
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a booking reference
      const bookingReference = `BOK-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`
      localStorage.setItem("bookingReference", bookingReference)

      // Store the scheduled appointments
      localStorage.setItem("scheduledAppointments", JSON.stringify(items))

      // Clear the cart
      clearCart()

      // Navigate to confirmation page
      router.push("/booking/confirmation")
    } catch (error) {
      console.error("Error processing payment:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Payment</h1>
      <p className="text-muted-foreground mb-8">Complete your booking by providing payment details</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Details
              </CardTitle>
              <CardDescription>All transactions are secure and encrypted</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    {...register("cardNumber")}
                    aria-invalid={errors.cardNumber ? "true" : "false"}
                  />
                  {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Smith"
                    {...register("cardName")}
                    aria-invalid={errors.cardName ? "true" : "false"}
                  />
                  {errors.cardName && <p className="text-sm text-destructive">{errors.cardName.message}</p>}
                </div>

                {/* Update the Select components to be optional and not block form submission */}
                {/* Replace the expiryMonth and expiryYear fields in the form with: */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryMonth">Expiry Month</Label>
                    <Select onValueChange={(value) => register("expiryMonth").onChange({ target: { value } })}>
                      <SelectTrigger id="expiryMonth">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                            {month.toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryYear">Expiry Year</Label>
                    <Select onValueChange={(value) => register("expiryYear").onChange({ target: { value } })}>
                      <SelectTrigger id="expiryYear">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      {...register("cvv")}
                      aria-invalid={errors.cvv ? "true" : "false"}
                    />
                    {errors.cvv && <p className="text-sm text-destructive">{errors.cvv.message}</p>}
                  </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Lock className="h-4 w-4 mr-2" />
                  <p>Your payment information is processed securely. We do not store your credit card details.</p>
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
              {clientDetails && (
                <div className="space-y-2">
                  <h3 className="font-medium">Contact Information</h3>
                  <p className="text-sm">
                    {clientDetails.firstName} {clientDetails.lastName}
                  </p>
                  <p className="text-sm">{clientDetails.email}</p>
                  <p className="text-sm">{clientDetails.phone}</p>
                </div>
              )}

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Scheduled Appointments</h3>
                {items.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{item.serviceName}</p>
                      <span>${item.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.providerName}</p>
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
              <Button type="submit" form="payment-form" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  "Complete Booking"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

