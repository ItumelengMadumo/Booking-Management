"use client"

import { useState } from "react"
import { format, addDays, startOfDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart, type CartItem } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"

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

interface SchedulingFormProps {
  item: CartItem
  onClose?: () => void
}

export function SchedulingForm({ item, onClose }: SchedulingFormProps) {
  const { updateItem } = useCart()
  const { toast } = useToast()

  const [date, setDate] = useState<Date | undefined>(item.date ? new Date(item.date) : addDays(new Date(), 1))
  const [timeSlot, setTimeSlot] = useState<string | null>(item.time || null)

  const availableTimeSlots = date ? generateTimeSlots(date) : []

  const handleSchedule = () => {
    if (!date || !timeSlot) return

    updateItem(item.id, {
      date: format(date, "yyyy-MM-dd"),
      time: timeSlot,
      isScheduled: true,
    })

    toast({
      title: "Appointment Scheduled",
      description: `${item.serviceName} has been scheduled for ${format(date, "MMMM d, yyyy")} at ${timeSlot}.`,
      duration: 3000,
    })

    if (onClose) {
      onClose()
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Schedule {item.serviceName}</CardTitle>
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

        <div className="flex justify-end gap-2">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSchedule} disabled={!date || !timeSlot}>
            Confirm Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

