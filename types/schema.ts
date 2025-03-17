export type User = {
  id: string
  name: string
  email: string
  phone: string
  role: "client" | "provider" | "admin"
  createdAt: Date
  updatedAt: Date
}

export type Service = {
  id: string
  providerId: string
  name: string
  description: string
  duration: number // in minutes
  price: number
  depositAmount: number
  image?: string
  createdAt: Date
  updatedAt: Date
}

export type Appointment = {
  id: string
  clientId: string
  providerId: string
  serviceId: string
  startTime: Date
  endTime: Date
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled"
  paymentStatus: "deposit_paid" | "fully_paid" | "unpaid"
  paymentAmount: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type TimeSlot = {
  id: string
  providerId: string
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  isAvailable: boolean
}

export type Notification = {
  id: string
  userId: string
  appointmentId: string
  type: "email" | "sms"
  status: "pending" | "sent" | "failed"
  sentAt?: Date
  createdAt: Date
}

