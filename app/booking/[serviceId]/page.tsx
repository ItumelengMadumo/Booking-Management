"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format, addDays, startOfDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ProtectedRoute } from "@/components/protected-route"

// Mock data - in a real app, this would come from a database
const services = {
  "1": {
    id: "1",
    name: "Standard Service",
    description: "Our most popular service option, perfect for regular customers.",
    price: 60,
    duration: 60,
    depositAmount: 15,
    provider: "Your Business Name",
  },
  "2": {
    id: "2",
    name: "Premium Service",
    description: "Enhanced service with additional features and premium options.",
    price: 90,
    depositAmount: 25,
    duration: 90,
    provider: "Your Business Name",
  },
  "3": {
    id: "3",
    name: "Deluxe Package",
    description: "Our comprehensive deluxe package with all available options included.",
    price: 120,
    duration: 120,
    depositAmount: 30,
    provider: "Your Business Name",
  },
}

// Mock available time slots
const generateTimeSlots = (date: Date) => {
  // In a real app, this would come from the database based on provider availability
  const slots = []
  const startHour = 9 // 9 AM
  const endHour = 17 // 5 PM
  const interval = 30 // 30 minutes

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`)
    }
  }

  // Randomly make some slots unavailable
  return slots.filter(() => Math.random() > 0.3)
}

export default function BookingPage({ params }: { params: { serviceId: string } }) {
  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <BookingPageContent params={params} />
    </ProtectedRoute>
  )
}

function BookingPageContent({ params }: { params: { serviceId: string } }) {
  const router = useRouter()
  const service = services[params.serviceId as keyof typeof services]

  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1))
  const [timeSlot, setTimeSlot] = useState<string | null>(null)
  const [paymentOption, setPaymentOption] = useState<"deposit" | "full">("deposit")

  const availableTimeSlots = date ? generateTimeSlots(date) : []

  if (!service) {
    return <div className="container mx-auto px-4 py-12">Service not found</div>
  }

  const handleBooking = () => {
    if (!date || !timeSlot) return

    // In a real app, this would call a server action to create the booking
    // For now, we'll just navigate to a confirmation page
    router.push(
      `/booking/confirmation?serviceId=${service.id}&date=${format(date, "yyyy-MM-dd")}&time=${timeSlot}&payment=${paymentOption}`,
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Book {service.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Select Date & Time</CardTitle>
            <CardDescription>Choose your preferred appointment date and time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Select a Date</h3>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < startOfDay(new Date())}
                className="rounded-md border"
              />
            </div>

            {date && (
              <div>
                <h3 className="text-lg font-medium mb-4">Select a Time</h3>
                {availableTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {availableTimeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={timeSlot === slot ? "default" : "outline"}
                        onClick={() => setTimeSlot(slot)}
                        className="text-center py-2"
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No available time slots for this date.</p>
                )}
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium mb-4">Payment Option</h3>
              <RadioGroup
                value={paymentOption}
                onValueChange={(value) => setPaymentOption(value as "deposit" | "full")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="deposit" id="deposit" />
                  <Label htmlFor="deposit">Pay Deposit (${service.depositAmount})</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full">Pay Full Amount (${service.price})</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleBooking} disabled={!date || !timeSlot} className="w-full">
              Continue to Payment
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Service</h3>
              <p>{service.name}</p>
            </div>
            <div>
              <h3 className="font-medium">Provider</h3>
              <p>{service.provider}</p>
            </div>
            <div>
              <h3 className="font-medium">Duration</h3>
              <p>{service.duration} minutes</p>
            </div>
            {date && timeSlot && (
              <div>
                <h3 className="font-medium">Appointment</h3>
                <p>
                  {format(date, "EEEE, MMMM d, yyyy")} at {timeSlot}
                </p>
              </div>
            )}
            <div className="pt-4 border-t">
              <h3 className="font-medium">Price</h3>
              <p className="text-xl font-bold">${service.price}</p>
              <p className="text-sm text-muted-foreground">
                {paymentOption === "deposit"
                  ? `Deposit: $${service.depositAmount} (Balance due at appointment: $${service.price - service.depositAmount})`
                  : "Full payment"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Important Information</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Please arrive 10 minutes before your appointment time.</li>
          <li>A fee may be charged for late arrivals or no-shows.</li>
          <li>You will receive a confirmation email and text message after booking.</li>
          <li>A reminder will be sent 6 hours before your appointment.</li>
          <li>Cancellations must be made at least 24 hours in advance for a full refund.</li>
        </ul>
      </div>
    </div>
  )
}

