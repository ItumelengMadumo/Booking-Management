"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// Mock data - in a real app, this would come from a database
const appointments = [
  {
    id: "1",
    serviceName: "Standard Service",
    providerName: "Your Business Name",
    providerAddress: "123 Main St, Anytown, USA",
    date: "2025-03-15",
    startTime: "10:00",
    endTime: "11:00",
    status: "confirmed",
    paymentStatus: "deposit_paid",
    paymentAmount: 15,
    totalAmount: 60,
  },
  {
    id: "2",
    serviceName: "Deluxe Package",
    providerName: "Your Business Name",
    providerAddress: "123 Main St, Anytown, USA",
    date: "2025-03-20",
    startTime: "14:00",
    endTime: "15:30",
    status: "confirmed",
    paymentStatus: "fully_paid",
    paymentAmount: 120,
    totalAmount: 120,
  },
  {
    id: "3",
    serviceName: "Premium Service",
    providerName: "Your Business Name",
    providerAddress: "123 Main St, Anytown, USA",
    date: "2025-03-25",
    startTime: "11:30",
    endTime: "12:45",
    status: "confirmed",
    paymentStatus: "deposit_paid",
    paymentAmount: 25,
    totalAmount: 90,
  },
  {
    id: "4",
    serviceName: "Standard Service",
    providerName: "Your Business Name",
    providerAddress: "123 Main St, Anytown, USA",
    date: "2025-02-10",
    startTime: "13:00",
    endTime: "14:00",
    status: "completed",
    paymentStatus: "fully_paid",
    paymentAmount: 60,
    totalAmount: 60,
  },
]

const statusColors = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
  rescheduled: "bg-purple-100 text-purple-800",
}

export default function ClientAppointments() {
  return (
    <ProtectedRoute requiredRole="client">
      <ClientAppointmentsContent />
    </ProtectedRoute>
  )
}

function ClientAppointmentsContent() {
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status !== "completed" && appointment.status !== "cancelled",
  )

  const pastAppointments = appointments.filter(
    (appointment) => appointment.status === "completed" || appointment.status === "cancelled",
  )

  const handleCancel = () => {
    // In a real app, this would call a server action to cancel the appointment
    console.log("Cancel appointment", selectedAppointment?.id)
    setCancelDialogOpen(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
      <p className="text-muted-foreground mb-8">View and manage your upcoming and past appointments</p>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle>{appointment.serviceName}</CardTitle>
                      <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <CardDescription>{appointment.providerName}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{format(parseISO(appointment.date), "EEEE, MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {appointment.startTime} - {appointment.endTime}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                        <span>{appointment.providerAddress}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {appointment.paymentStatus === "fully_paid"
                              ? "Fully Paid"
                              : `Deposit Paid (Balance due: $${appointment.totalAmount - appointment.paymentAmount})`}
                          </span>
                          <span className="font-bold">
                            ${appointment.paymentAmount} / ${appointment.totalAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedAppointment(appointment)}>
                      View Details
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        setSelectedAppointment(appointment)
                        setCancelDialogOpen(true)
                      }}
                    >
                      Cancel
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No upcoming appointments</h3>
              <p className="text-muted-foreground mb-6">You don't have any upcoming appointments scheduled.</p>
              <Link href="/services">
                <Button>Book an Appointment</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle>{appointment.serviceName}</CardTitle>
                      <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <CardDescription>{appointment.providerName}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{format(parseISO(appointment.date), "EEEE, MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {appointment.startTime} - {appointment.endTime}
                        </span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Payment</span>
                          <span className="font-bold">${appointment.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setSelectedAppointment(appointment)}>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No past appointments</h3>
              <p className="text-muted-foreground">You don't have any past appointments.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Appointment Details Dialog */}
      {selectedAppointment && (
        <Dialog open={!!selectedAppointment && !cancelDialogOpen} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                {format(parseISO(selectedAppointment.date), "EEEE, MMMM d, yyyy")} • {selectedAppointment.startTime} -{" "}
                {selectedAppointment.endTime}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Service</h3>
                  <p className="font-medium">{selectedAppointment.serviceName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <Badge className={statusColors[selectedAppointment.status as keyof typeof statusColors]}>
                    {selectedAppointment.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Provider Information</h3>
                <div className="space-y-1">
                  <div className="font-medium">{selectedAppointment.providerName}</div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <span>{selectedAppointment.providerAddress}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Payment Information</h3>
                <div className="flex justify-between items-center">
                  <span>
                    {selectedAppointment.paymentStatus === "fully_paid"
                      ? "Fully Paid"
                      : `Deposit Paid (${((selectedAppointment.paymentAmount / selectedAppointment.totalAmount) * 100).toFixed(0)}%)`}
                  </span>
                  <span className="font-bold">
                    ${selectedAppointment.paymentAmount} / ${selectedAppointment.totalAmount}
                  </span>
                </div>
                {selectedAppointment.paymentStatus !== "fully_paid" && (
                  <p className="text-sm text-muted-foreground">
                    Balance due at appointment: ${selectedAppointment.totalAmount - selectedAppointment.paymentAmount}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Cancellation Policy</h3>
                <p className="text-sm text-muted-foreground">
                  Cancellations must be made at least 24 hours in advance for a full refund. Late arrivals may be
                  subject to a late fee.
                </p>
              </div>
            </div>

            <DialogFooter>
              {selectedAppointment.status === "confirmed" && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    setCancelDialogOpen(true)
                  }}
                >
                  Cancel Appointment
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>Are you sure you want to cancel this appointment?</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-md bg-destructive/10 p-4 text-destructive">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">Cancellation Policy</h3>
                  <p className="text-sm">
                    Cancellations made less than 24 hours before the appointment may be subject to a cancellation fee.
                    Your deposit may not be refundable.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Reason for Cancellation</h3>
              <Textarea placeholder="Please provide a reason for cancellation" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Go Back
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

