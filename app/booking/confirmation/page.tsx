"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import type { CartItem } from "@/context/cart-context"
import { ProtectedRoute } from "@/components/protected-route"

export default function ConfirmationPage() {
  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <ConfirmationPageContent />
    </ProtectedRoute>
  )
}

function ConfirmationPageContent() {
  const [bookingReference, setBookingReference] = useState<string | null>(null)
  const [clientDetails, setClientDetails] = useState<any>(null)
  const [scheduledAppointments, setScheduledAppointments] = useState<CartItem[]>([])

  useEffect(() => {
    // Get booking reference from localStorage
    const storedBookingReference = localStorage.getItem("bookingReference")
    if (storedBookingReference) {
      setBookingReference(storedBookingReference)
    }

    // Get client details from localStorage
    const storedClientDetails = localStorage.getItem("clientDetails")
    if (storedClientDetails) {
      setClientDetails(JSON.parse(storedClientDetails))
    }

    // Get scheduled appointments from localStorage
    const storedAppointments = localStorage.getItem("scheduledAppointments")
    if (storedAppointments) {
      setScheduledAppointments(JSON.parse(storedAppointments))
    }

    // Clean up localStorage after retrieving the data
    return () => {
      localStorage.removeItem("bookingReference")
      localStorage.removeItem("clientDetails")
      localStorage.removeItem("scheduledAppointments")
    }
  }, [])

  if (!bookingReference || !clientDetails || scheduledAppointments.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading booking details...</p>
        </div>
      </div>
    )
  }

  // Calculate totals
  const subtotal = scheduledAppointments.reduce((total, item) => total + item.price, 0)
  const depositTotal = scheduledAppointments.reduce((total, item) => total + item.depositAmount, 0)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
          <p className="text-muted-foreground mt-2">Your appointments have been successfully booked.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>Reference #: {bookingReference}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Client Information</h3>
              <p>
                {clientDetails.firstName} {clientDetails.lastName}
              </p>
              <p>{clientDetails.email}</p>
              <p>{clientDetails.phone}</p>
              {clientDetails.address && (
                <p>
                  {clientDetails.address}, {clientDetails.city}, {clientDetails.state} {clientDetails.zipCode}
                </p>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Scheduled Appointments</h3>
              {scheduledAppointments.map((appointment, index) => (
                <div key={appointment.id} className="space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{appointment.serviceName}</p>
                      <p className="text-sm text-muted-foreground">{appointment.providerName}</p>
                    </div>
                    <span>${appointment.price}</span>
                  </div>
                  {appointment.date && appointment.time && (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{format(new Date(appointment.date), "EEEE, MMMM d, yyyy")}</span>
                      <Clock className="h-4 w-4 mx-2 text-muted-foreground" />
                      <span>{appointment.time}</span>
                    </div>
                  )}
                  {index < scheduledAppointments.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment</h3>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-bold">${depositTotal}</span>
              </div>
              {depositTotal < subtotal && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Balance Due at Appointment:</span>
                  <span>${subtotal - depositTotal}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>A confirmation email and text message have been sent to your registered contact information.</p>
              <p>You will receive a reminder 6 hours before each appointment.</p>
            </div>
            <div className="flex gap-4 w-full">
              <Link href="/dashboard/appointments" className="flex-1">
                <Button variant="outline" className="w-full">
                  View My Appointments
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full">Return Home</Button>
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold mb-2">Need to make changes?</h2>
          <p className="text-muted-foreground mb-4">
            You can reschedule or cancel your appointments from your dashboard.
          </p>
          <Link href="/dashboard/appointments">
            <Button variant="outline">Manage Appointments</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

