"use client"

import { useState } from "react"
import { format, subMonths, addMonths } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, DollarSign, Users, Clock } from "lucide-react"

interface MonthlyStatsProps {
  appointments: any[]
}

export function MonthlyStats({ appointments }: MonthlyStatsProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  // Filter appointments for the current month
  const monthAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date)
    return (
      appointmentDate.getMonth() === currentMonth.getMonth() &&
      appointmentDate.getFullYear() === currentMonth.getFullYear()
    )
  })

  // Calculate statistics
  const totalAppointments = monthAppointments.length
  const totalRevenue = monthAppointments.reduce((sum, appointment) => sum + appointment.paymentAmount, 0)
  const uniqueClients = new Set(monthAppointments.map((appointment) => appointment.clientName)).size
  const totalHours = monthAppointments
    .reduce((sum, appointment) => {
      const startTime = appointment.startTime.split(":").map(Number)
      const endTime = appointment.endTime.split(":").map(Number)
      const hours = endTime[0] - startTime[0] + (endTime[1] - startTime[1]) / 60
      return sum + hours
    }, 0)
    .toFixed(1)

  // Calculate status counts
  const statusCounts = monthAppointments.reduce((counts: Record<string, number>, appointment) => {
    counts[appointment.status] = (counts[appointment.status] || 0) + 1
    return counts
  }, {})

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Monthly Overview</CardTitle>
          <CardDescription>Statistics for {format(currentMonth, "MMMM yyyy")}</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Appointments</p>
              <p className="text-2xl font-bold">{totalAppointments}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Clients</p>
              <p className="text-2xl font-bold">{uniqueClients}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Hours</p>
              <p className="text-2xl font-bold">{totalHours}</p>
            </div>
          </div>
        </div>

        {/* Status breakdown */}
        {Object.keys(statusCounts).length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium mb-2">Status Breakdown</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${status === "confirmed" ? "bg-green-500" : status === "pending" ? "bg-yellow-500" : status === "cancelled" ? "bg-red-500" : "bg-blue-500"}`}
                    ></div>
                    <span className="text-sm capitalize">{status}</span>
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

