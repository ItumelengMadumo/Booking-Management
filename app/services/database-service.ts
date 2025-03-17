"use server"

import { createClient } from "@supabase/supabase-js"
import type { User, Service, Appointment, TimeSlot, Notification } from "@/types/schema"

// Initialize Supabase client
const supabaseUrl = "https://zvsgmradjlfgyuizabzx.supabase.co "
\
const supabaseKey = process.env.
;
;("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2c2dtcmFkamxmZ3l1aXphYnp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMzQ4NzgsImV4cCI6MjA1NzYxMDg3OH0.3WadYbpxqksCOxsNzs0lRdGCU3YWHzrE4Byt2owi-Kg ")
const supabase = createClient(supabaseUrl, supabaseKey)

// User-related functions
export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) throw error

    return { success: true, user: data as User }
  } catch (error) {
    console.error("Error fetching user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch user",
    }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error && error.code !== "PGRST116") throw error // PGRST116 is "no rows returned"

    return { success: true, user: data as User | null }
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch user by email",
    }
  }
}

export async function createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">) {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          ...userData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error

    return { success: true, user: data as User }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    }
  }
}

export async function updateUser(userId: string, userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...userData,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error

    return { success: true, user: data as User }
  } catch (error) {
    console.error("Error updating user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
    }
  }
}

// Service-related functions
export async function getServices(providerId?: string) {
  try {
    let query = supabase.from("services").select("*")

    if (providerId) {
      query = query.eq("providerId", providerId)
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, services: data as Service[] }
  } catch (error) {
    console.error("Error fetching services:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch services",
    }
  }
}

export async function getServiceById(serviceId: string) {
  try {
    const { data, error } = await supabase.from("services").select("*").eq("id", serviceId).single()

    if (error) throw error

    return { success: true, service: data as Service }
  } catch (error) {
    console.error("Error fetching service:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch service",
    }
  }
}

export async function createService(serviceData: Omit<Service, "id" | "createdAt" | "updatedAt">) {
  try {
    const { data, error } = await supabase
      .from("services")
      .insert([
        {
          ...serviceData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error

    return { success: true, service: data as Service }
  } catch (error) {
    console.error("Error creating service:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create service",
    }
  }
}

export async function updateService(
  serviceId: string,
  serviceData: Partial<Omit<Service, "id" | "createdAt" | "updatedAt">>,
) {
  try {
    const { data, error } = await supabase
      .from("services")
      .update({
        ...serviceData,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", serviceId)
      .select()
      .single()

    if (error) throw error

    return { success: true, service: data as Service }
  } catch (error) {
    console.error("Error updating service:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update service",
    }
  }
}

// Appointment-related functions
export async function getAppointments(filters?: {
  clientId?: string
  providerId?: string
  serviceId?: string
  status?: string
  startDate?: string
  endDate?: string
}) {
  try {
    let query = supabase.from("appointments").select("*")

    if (filters?.clientId) {
      query = query.eq("clientId", filters.clientId)
    }

    if (filters?.providerId) {
      query = query.eq("providerId", filters.providerId)
    }

    if (filters?.serviceId) {
      query = query.eq("serviceId", filters.serviceId)
    }

    if (filters?.status) {
      query = query.eq("status", filters.status)
    }

    if (filters?.startDate) {
      query = query.gte("startTime", filters.startDate)
    }

    if (filters?.endDate) {
      query = query.lte("startTime", filters.endDate)
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, appointments: data as Appointment[] }
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch appointments",
    }
  }
}

export async function getAppointmentById(appointmentId: string) {
  try {
    const { data, error } = await supabase.from("appointments").select("*").eq("id", appointmentId).single()

    if (error) throw error

    return { success: true, appointment: data as Appointment }
  } catch (error) {
    console.error("Error fetching appointment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch appointment",
    }
  }
}

export async function createAppointment(appointmentData: Omit<Appointment, "id" | "createdAt" | "updatedAt">) {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          ...appointmentData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error

    return { success: true, appointment: data as Appointment }
  } catch (error) {
    console.error("Error creating appointment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create appointment",
    }
  }
}

export async function updateAppointment(
  appointmentId: string,
  appointmentData: Partial<Omit<Appointment, "id" | "createdAt" | "updatedAt">>,
) {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .update({
        ...appointmentData,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", appointmentId)
      .select()
      .single()

    if (error) throw error

    return { success: true, appointment: data as Appointment }
  } catch (error) {
    console.error("Error updating appointment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update appointment",
    }
  }
}

// TimeSlot-related functions
export async function getAvailableTimeSlots(providerId: string, date: string) {
  try {
    // Get the day of week (0-6, where 0 is Sunday)
    const dayOfWeek = new Date(date).getDay()

    // Get provider's available time slots for this day of week
    const { data: timeSlots, error: timeSlotsError } = await supabase
      .from("time_slots")
      .select("*")
      .eq("providerId", providerId)
      .eq("dayOfWeek", dayOfWeek)
      .eq("isAvailable", true)

    if (timeSlotsError) throw timeSlotsError

    // Get existing appointments for this provider on this date
    const { data: appointments, error: appointmentsError } = await supabase
      .from("appointments")
      .select("startTime, endTime")
      .eq("providerId", providerId)
      .gte("startTime", `${date}T00:00:00`)
      .lt("startTime", `${date}T23:59:59`)
      .not("status", "eq", "cancelled")

    if (appointmentsError) throw appointmentsError

    // Filter out time slots that overlap with existing appointments
    const availableTimeSlots = (timeSlots as TimeSlot[]).filter((slot) => {
      const slotStart = new Date(`${date}T${slot.startTime}`)
      const slotEnd = new Date(`${date}T${slot.endTime}`)

      // Check if this slot overlaps with any appointment
      return !(appointments as Appointment[]).some((appointment) => {
        const appointmentStart = new Date(appointment.startTime)
        const appointmentEnd = new Date(appointment.endTime)

        // Check for overlap
        return slotStart <= appointmentEnd && slotEnd >= appointmentStart
      })
    })

    return { success: true, timeSlots: availableTimeSlots }
  } catch (error) {
    console.error("Error fetching available time slots:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch available time slots",
    }
  }
}

export async function updateTimeSlot(timeSlotId: string, isAvailable: boolean) {
  try {
    const { data, error } = await supabase
      .from("time_slots")
      .update({ isAvailable })
      .eq("id", timeSlotId)
      .select()
      .single()

    if (error) throw error

    return { success: true, timeSlot: data as TimeSlot }
  } catch (error) {
    console.error("Error updating time slot:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update time slot",
    }
  }
}

// Create bulk time slots for a provider
export async function createProviderTimeSlots(providerId: string, timeSlots: Omit<TimeSlot, "id">[]) {
  try {
    const { data, error } = await supabase
      .from("time_slots")
      .insert(
        timeSlots.map((slot) => ({
          ...slot,
          providerId,
        })),
      )
      .select()

    if (error) throw error

    return { success: true, timeSlots: data as TimeSlot[] }
  } catch (error) {
    console.error("Error creating time slots:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create time slots",
    }
  }
}

// Notification-related functions
export async function createNotification(notificationData: Omit<Notification, "id" | "createdAt">) {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert([
        {
          ...notificationData,
          createdAt: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error

    return { success: true, notification: data as Notification }
  } catch (error) {
    console.error("Error creating notification:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create notification",
    }
  }
}

export async function updateNotificationStatus(
  notificationId: string,
  status: "pending" | "sent" | "failed",
  sentAt?: Date,
) {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .update({
        status,
        ...(sentAt && { sentAt: sentAt.toISOString() }),
      })
      .eq("id", notificationId)
      .select()
      .single()

    if (error) throw error

    return { success: true, notification: data as Notification }
  } catch (error) {
    console.error("Error updating notification status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update notification status",
    }
  }
}

