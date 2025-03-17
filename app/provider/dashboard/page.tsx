"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DialogFooter } from "@/components/ui/dialog"
import { MonthlyStats } from "@/components/monthly-stats"

import { useState } from "react"
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addDays,
  parseISO,
  startOfMonth,
  endOfMonth,
  getDay,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
} from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, User, DollarSign, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Update the mock data to use generic service names
const appointments = [
  {
    id: "1",
    clientName: "John Smith",
    clientEmail: "john@example.com",
    clientPhone: "555-123-4567",
    serviceId: "1",
    serviceName: "Standard Service",
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
    clientName: "Jane Doe",
    clientEmail: "jane@example.com",
    clientPhone: "555-987-6543",
    serviceId: "1",
    serviceName: "Standard Service",
    date: "2025-03-15",
    startTime: "13:30",
    endTime: "14:30",
    status: "confirmed",
    paymentStatus: "fully_paid",
    paymentAmount: 60,
    totalAmount: 60,
  },
  {
    id: "3",
    clientName: "Alice Johnson",
    clientEmail: "alice@example.com",
    clientPhone: "555-456-7890",
    serviceId: "3",
    serviceName: "Deluxe Package",
    date: "2025-03-16",
    startTime: "11:00",
    endTime: "12:30",
    status: "pending",
    paymentStatus: "deposit_paid",
    paymentAmount: 30,
    totalAmount: 120,
  },
  {
    id: "4",
    clientName: "Bob Williams",
    clientEmail: "bob@example.com",
    clientPhone: "555-789-0123",
    serviceId: "2",
    serviceName: "Premium Service",
    date: "2025-03-17",
    startTime: "15:00",
    endTime: "16:15",
    status: "confirmed",
    paymentStatus: "deposit_paid",
    paymentAmount: 25,
    totalAmount: 90,
  },
  {
    id: "5",
    clientName: "Emily Davis",
    clientEmail: "emily@example.com",
    clientPhone: "555-234-5678",
    serviceId: "1",
    serviceName: "Standard Service",
    date: "2025-03-18",
    startTime: "09:30",
    endTime: "10:30",
    status: "confirmed",
    paymentStatus: "fully_paid",
    paymentAmount: 60,
    totalAmount: 60,
  },
  {
    id: "6",
    clientName: "Michael Brown",
    clientEmail: "michael@example.com",
    clientPhone: "555-345-6789",
    serviceId: "3",
    serviceName: "Deluxe Package",
    date: "2025-03-20",
    startTime: "14:00",
    endTime: "16:00",
    status: "confirmed",
    paymentStatus: "deposit_paid",
    paymentAmount: 30,
    totalAmount: 120,
  },
  {
    id: "7",
    clientName: "Sarah Wilson",
    clientEmail: "sarah@example.com",
    clientPhone: "555-456-7890",
    serviceId: "2",
    serviceName: "Premium Service",
    date: "2025-03-22",
    startTime: "10:00",
    endTime: "11:00",
    status: "confirmed",
    paymentStatus: "fully_paid",
    paymentAmount: 90,
    totalAmount: 90,
  },
  {
    id: "8",
    clientName: "David Lee",
    clientEmail: "david@example.com",
    clientPhone: "555-567-8901",
    serviceId: "1",
    serviceName: "Standard Service",
    date: "2025-03-25",
    startTime: "13:00",
    endTime: "14:00",
    status: "pending",
    paymentStatus: "deposit_paid",
    paymentAmount: 15,
    totalAmount: 60,
  },
  {
    id: "9",
    clientName: "Jennifer Taylor",
    clientEmail: "jennifer@example.com",
    clientPhone: "555-678-9012",
    serviceId: "1",
    serviceName: "Standard Service",
    date: "2025-03-27",
    startTime: "11:30",
    endTime: "12:30",
    status: "confirmed",
    paymentStatus: "deposit_paid",
    paymentAmount: 15,
    totalAmount: 60,
  },
  {
    id: "10",
    clientName: "Robert Martin",
    clientEmail: "robert@example.com",
    clientPhone: "555-789-0123",
    serviceId: "2",
    serviceName: "Premium Service",
    date: "2025-03-29",
    startTime: "15:30",
    endTime: "17:00",
    status: "confirmed",
    paymentStatus: "fully_paid",
    paymentAmount: 90,
    totalAmount: 90,
  },
]

const statusColors = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
  rescheduled: "bg-purple-100 text-purple-800",
}

export default function ProviderDashboard() {
  return (
    <ProtectedRoute requiredRole="provider">
      <ProviderDashboardContent />
    </ProtectedRoute>
  )
}

function ProviderDashboardContent() {
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<"day" | "week" | "month">("week")
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null)
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  // Date range calculations based on view
  const startDate =
    view === "day" ? date : view === "week" ? startOfWeek(date, { weekStartsOn: 0 }) : startOfMonth(date)

  const endDate = view === "day" ? date : view === "week" ? endOfWeek(date, { weekStartsOn: 0 }) : endOfMonth(date)

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const getAppointmentsForDate = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    return appointments.filter((appointment) => appointment.date === dateString)
  }

  const handlePrevious = () => {
    if (view === "day") {
      setDate(addDays(date, -1))
    } else if (view === "week") {
      setDate(addDays(date, -7))
    } else {
      setDate(subMonths(date, 1))
    }
  }

  const handleNext = () => {
    if (view === "day") {
      setDate(addDays(date, 1))
    } else if (view === "week") {
      setDate(addDays(date, 7))
    } else {
      setDate(addMonths(date, 1))
    }
  }

  const handleReschedule = () => {
    // In a real app, this would call a server action to reschedule the appointment
    console.log("Reschedule appointment", selectedAppointment?.id)
    setRescheduleDialogOpen(false)
  }

  const handleCancel = () => {
    // In a real app, this would call a server action to cancel the appointment
    console.log("Cancel appointment", selectedAppointment?.id)
    setCancelDialogOpen(false)
  }

  // Function to render the monthly calendar view
  const renderMonthView = () => {
    // Create array for week day headers
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    // Get the first day of the month
    const firstDayOfMonth = startOfMonth(date)

    // Get the day of the week for the first day (0-6, where 0 is Sunday)
    const firstDayOfWeek = getDay(firstDayOfMonth)

    // Create an array of days including padding for the first week
    const daysWithPadding = [...Array(firstDayOfWeek).fill(null), ...days]

    // Group days into weeks
    const weeks = []
    for (let i = 0; i < daysWithPadding.length; i += 7) {
      weeks.push(daysWithPadding.slice(i, i + 7))
    }

    return (
      <div className="bg-white rounded-lg overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-px bg-muted">
          {weekDays.map((day) => (
            <div key={day} className="py-2 text-center font-medium text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-muted">
          {daysWithPadding.map((day, index) => {
            if (!day) {
              // Empty cell for padding
              return <div key={`empty-${index}`} className="bg-background min-h-[120px]" />
            }

            const dayAppointments = getAppointmentsForDate(day)
            const isCurrentMonth = isSameMonth(day, date)
            const isCurrentDay = isToday(day)

            return (
              <div
                key={day.toString()}
                className={`bg-background min-h-[120px] p-1 ${!isCurrentMonth ? "opacity-50" : ""} ${isCurrentDay ? "ring-2 ring-primary ring-inset" : ""}`}
              >
                <div className="text-right p-1 font-medium text-sm">{format(day, "d")}</div>
                <div className="space-y-1 max-h-[100px] overflow-y-auto">
                  {dayAppointments.length > 0
                    ? dayAppointments.slice(0, 3).map((appointment) => (
                        <div
                          key={appointment.id}
                          onClick={() => setSelectedAppointment(appointment)}
                          className="p-1 text-xs rounded bg-primary/10 cursor-pointer hover:bg-primary/20 transition-colors truncate"
                        >
                          <div className="flex items-center gap-1">
                            <span className="font-medium truncate">{appointment.startTime}</span>
                            <Badge
                              className={`${statusColors[appointment.status as keyof typeof statusColors]} text-[10px] px-1 py-0`}
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="truncate">{appointment.clientName}</div>
                        </div>
                      ))
                    : null}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-center text-muted-foreground">+{dayAppointments.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Provider Dashboard</h1>
          <p className="text-muted-foreground">Manage your appointments and schedule</p>
        </div>

        <div className="flex items-center gap-4">
          <Tabs value={view} onValueChange={(v) => setView(v as "day" | "week" | "month")} className="w-[280px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-[150px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {view === "day"
                    ? format(date, "MMMM d, yyyy")
                    : view === "week"
                      ? `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`
                      : format(date, "MMMM yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Appointment Calendar</CardTitle>
            <CardDescription>
              {view === "day"
                ? format(date, "EEEE, MMMM d, yyyy")
                : view === "week"
                  ? `Week of ${format(startDate, "MMMM d, yyyy")}`
                  : format(date, "MMMM yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {view === "month" ? (
              renderMonthView()
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {days.map((day) => (
                  <div key={day.toString()} className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-2 text-center font-medium">
                      {format(day, "EEE")}
                      <div className="text-sm text-muted-foreground">{format(day, "MMM d")}</div>
                    </div>
                    <div className="p-2 space-y-2 min-h-[200px]">
                      {getAppointmentsForDate(day).length > 0 ? (
                        getAppointmentsForDate(day).map((appointment) => (
                          <div
                            key={appointment.id}
                            className="p-2 rounded-md bg-primary/10 cursor-pointer hover:bg-primary/20 transition-colors"
                            onClick={() => setSelectedAppointment(appointment)}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-medium">
                                {appointment.startTime} - {appointment.endTime}
                              </span>
                              <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                                {appointment.status}
                              </Badge>
                            </div>
                            <div className="text-sm">{appointment.serviceName}</div>
                            <div className="text-sm text-muted-foreground">{appointment.clientName}</div>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                          No appointments
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>{format(new Date(), "MMMM d, yyyy")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getAppointmentsForDate(new Date()).length > 0 ? (
                getAppointmentsForDate(new Date()).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-3 rounded-md border hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">
                        {appointment.startTime} - {appointment.endTime}
                      </span>
                      <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium">{appointment.serviceName}</div>
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <User className="h-3 w-3 mr-1" />
                      {appointment.clientName}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">No appointments scheduled for today</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Monthly Statistics</CardTitle>
            <CardDescription>View your performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyStats appointments={appointments} />
          </CardContent>
        </Card>
      </div>

      {/* Appointment Details Dialog */}
      {selectedAppointment && (
        <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
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
                <h3 className="text-sm font-medium text-muted-foreground">Client Information</h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{selectedAppointment.clientName}</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-2 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{selectedAppointment.clientEmail}</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-2 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>{selectedAppointment.clientPhone}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Payment Information</h3>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {selectedAppointment.paymentStatus === "fully_paid"
                        ? "Fully Paid"
                        : `Deposit Paid (${((selectedAppointment.paymentAmount / selectedAppointment.totalAmount) * 100).toFixed(0)}%)`}
                    </span>
                  </div>
                  <span className="font-bold">
                    ${selectedAppointment.paymentAmount} / ${selectedAppointment.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              {selectedAppointment.status === "confirmed" && (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setRescheduleDialogOpen(true)
                    }}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setCancelDialogOpen(true)
                    }}
                  >
                    Cancel Appointment
                  </Button>
                  <Button className="flex-1">Mark as Completed</Button>
                </>
              )}
              {selectedAppointment.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setCancelDialogOpen(true)
                    }}
                  >
                    Reject
                  </Button>
                  <Button className="flex-1">Confirm Appointment</Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setRescheduleDialogOpen(true)
                    }}
                  >
                    Reschedule
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto pr-2">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>Select a new date and time for this appointment.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">New Date</h3>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">New Time</h3>
              <div className="grid grid-cols-3 gap-2">
                {["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"].map((time) => (
                  <Button key={time} variant="outline" className="text-center">
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Reason for Rescheduling</h3>
              <Textarea placeholder="Provide a reason for rescheduling" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReschedule}>Confirm Reschedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  <h3 className="font-medium">Warning</h3>
                  <p className="text-sm">
                    Cancelling this appointment may result in lost revenue. The client will be notified of the
                    cancellation.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Reason for Cancellation</h3>
              <Textarea placeholder="Provide a reason for cancellation" />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Go Back
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false)
                setRescheduleDialogOpen(true)
              }}
            >
              Reschedule Instead
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

