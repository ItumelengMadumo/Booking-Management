"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useCart, type PaymentOption, type CartItem } from "@/context/cart-context"
import { SchedulingForm } from "@/components/scheduling-form"
import { Trash2, Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { ProtectedRoute } from "@/components/protected-route"

export default function CartPage() {
  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <CartPageContent />
    </ProtectedRoute>
  )
}

function CartPageContent() {
  const router = useRouter()
  const {
    items,
    removeItem,
    clearCart,
    paymentOption,
    setPaymentOption,
    subtotal,
    depositTotal,
    paymentTotal,
    allItemsScheduled,
  } = useCart()

  const [schedulingItem, setSchedulingItem] = useState<CartItem | null>(null)

  const handleRemoveItem = (id: string) => {
    removeItem(id)
  }

  const handlePaymentOptionChange = (value: PaymentOption) => {
    setPaymentOption(value)
  }

  const handleCheckout = () => {
    if (items.length === 0) return

    if (!allItemsScheduled) {
      // Show error or scroll to unscheduled items
      return
    }

    router.push("/checkout")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
      <p className="text-muted-foreground mb-8">
        Review your selected services and schedule appointments before checkout
      </p>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add services to your cart to continue.</p>
          <Link href="/services">
            <Button>Browse Services</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {!allItemsScheduled && (
              <Alert variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Schedule Required</AlertTitle>
                <AlertDescription>
                  All services must be scheduled before proceeding to checkout. Please click "Schedule" for any
                  unscheduled services.
                </AlertDescription>
              </Alert>
            )}

            {items.map((item) => (
              <Card key={item.id} className={`overflow-hidden ${!item.isScheduled ? "border-amber-300" : ""}`}>
                <div className="flex flex-col sm:flex-row">
                  {item.image && (
                    <div className="sm:w-1/3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.serviceName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{item.serviceName}</h3>
                        <p className="text-sm text-muted-foreground">{item.providerName}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label={`Remove ${item.serviceName} from cart`}
                      >
                        <Trash2 className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{item.duration} min</span>
                      </div>

                      {item.isScheduled && item.date && item.time ? (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-sm">
                            {format(new Date(item.date), "MMMM d, yyyy")} at {item.time}
                          </span>
                          <CheckCircle className="h-4 w-4 ml-2 text-green-600" />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-amber-600" />
                          <span className="text-sm text-amber-600">Not scheduled</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-semibold">${item.price}</p>
                      </div>

                      <Button
                        variant={item.isScheduled ? "outline" : "default"}
                        size="sm"
                        onClick={() => setSchedulingItem(item)}
                      >
                        {item.isScheduled ? "Reschedule" : "Schedule"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <div className="flex justify-between">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Link href="/services">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
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
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.serviceName}</span>
                      <span>${item.price}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal}</span>
                </div>

                <div className="pt-4">
                  <h3 className="font-medium mb-2">Payment Option</h3>
                  <RadioGroup
                    value={paymentOption}
                    onValueChange={handlePaymentOptionChange as (value: string) => void}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="deposit" id="deposit" />
                      <Label htmlFor="deposit" className="flex justify-between w-full">
                        <span>Pay Deposit</span>
                        <span>${depositTotal}</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full" id="full" />
                      <Label htmlFor="full" className="flex justify-between w-full">
                        <span>Pay Full Amount</span>
                        <span>${subtotal}</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentOption === "deposit" && (
                  <div className="text-sm text-muted-foreground">
                    <p>Balance due at appointment: ${subtotal - depositTotal}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                <div className="flex justify-between w-full text-lg font-bold">
                  <span>Total</span>
                  <span>${paymentTotal}</span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={!allItemsScheduled || items.length === 0}
                >
                  {!allItemsScheduled ? "Schedule All Services to Continue" : "Proceed to Checkout"}
                </Button>
                {!allItemsScheduled && (
                  <p className="text-sm text-center text-amber-600">All services must be scheduled before checkout</p>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {/* Scheduling Dialog */}
      <Dialog open={!!schedulingItem} onOpenChange={(open) => !open && setSchedulingItem(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
          </DialogHeader>
          {schedulingItem && <SchedulingForm item={schedulingItem} onClose={() => setSchedulingItem(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

