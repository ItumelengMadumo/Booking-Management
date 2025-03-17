"use server"

import { Resend } from "resend"
import twilio from "twilio"
import { createNotification } from "./database-service"
import type { Appointment, User } from "@/types/schema"
import { getAppointments } from "./database-service"

// Initialize email client (Resend)
const resend = new Resend(process.env.RESEND_API_KEY)

// Initialize SMS client (Twilio)
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

// Email notification templates
const emailTemplates = {
  bookingConfirmation: (data: {
    clientName: string
    serviceName: string
    providerName: string
    date: string
    time: string
    bookingReference: string
  }) => ({
    subject: `Booking Confirmation: ${data.serviceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Confirmation</h2>
        <p>Hello ${data.clientName},</p>
        <p>Your booking for <strong>${data.serviceName}</strong> with ${data.providerName} has been confirmed.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Date:</strong> ${data.date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${data.time}</p>
          <p style="margin: 5px 0;"><strong>Booking Reference:</strong> ${data.bookingReference}</p>
        </div>
        <p>Thank you for your booking!</p>
        <p>If you need to make any changes, please contact us or visit your account dashboard.</p>
      </div>
    `,
  }),

  bookingRequest: (data: {
    clientName: string
    serviceName: string
    date: string
    time: string
    bookingReference: string
  }) => ({
    subject: `New Booking Request: ${data.serviceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Booking Request</h2>
        <p>Hello,</p>
        <p>You have received a new booking request from ${data.clientName} for <strong>${data.serviceName}</strong>.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Date:</strong> ${data.date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${data.time}</p>
          <p style="margin: 5px 0;"><strong>Booking Reference:</strong> ${data.bookingReference}</p>
        </div>
        <p>Please log in to your dashboard to confirm or reject this booking.</p>
      </div>
    `,
  }),

  bookingStatusUpdate: (data: {
    clientName: string
    serviceName: string
    providerName: string
    date: string
    time: string
    bookingReference: string
    status: string
    reason?: string
  }) => ({
    subject: `Booking ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}: ${data.serviceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}</h2>
        <p>Hello ${data.clientName},</p>
        <p>Your booking for <strong>${data.serviceName}</strong> with ${data.providerName} has been ${data.status}.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Date:</strong> ${data.date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${data.time}</p>
          <p style="margin: 5px 0;"><strong>Booking Reference:</strong> ${data.bookingReference}</p>
          ${data.reason ? `<p style="margin: 5px 0;"><strong>Reason:</strong> ${data.reason}</p>` : ""}
        </div>
        <p>If you have any questions, please contact us.</p>
      </div>
    `,
  }),

  bookingReminder: (data: {
    clientName: string
    serviceName: string
    providerName: string
    date: string
    time: string
    bookingReference: string
  }) => ({
    subject: `Reminder: Your Appointment Tomorrow`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Appointment Reminder</h2>
        <p>Hello ${data.clientName},</p>
        <p>This is a reminder for your upcoming appointment for <strong>${data.serviceName}</strong> with ${data.providerName}.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Date:</strong> ${data.date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${data.time}</p>
          <p style="margin: 5px 0;"><strong>Booking Reference:</strong> ${data.bookingReference}</p>
        </div>
        <p>We look forward to seeing you!</p>
      </div>
    `,
  }),
}

// SMS notification templates
const smsTemplates = {
  bookingConfirmation: (data: {
    serviceName: string
    date: string
    time: string
    bookingReference: string
  }) =>
    `Your booking for ${data.serviceName} on ${data.date} at ${data.time} is confirmed. Ref: ${data.bookingReference}`,

  bookingRequest: (data: {
    clientName: string
    serviceName: string
    date: string
    time: string
  }) =>
    `New booking request from ${data.clientName} for ${data.serviceName} on ${data.date} at ${data.time}. Please log in to confirm.`,

  bookingStatusUpdate: (data: {
    serviceName: string
    date: string
    time: string
    status: string
  }) => `Your booking for ${data.serviceName} on ${data.date} at ${data.time} has been ${data.status}.`,

  bookingReminder: (data: {
    serviceName: string
    date: string
    time: string
  }) =>
    `Reminder: Your appointment for ${data.serviceName} is tomorrow at ${data.time}. We look forward to seeing you!`,
}

/**
 * Send an email notification
 */
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "BookMe <notifications@bookme.example.com>",
      to: [to],
      subject,
      html,
    })

    if (error) throw error

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}

/**
 * Send an SMS notification
 */
export async function sendSMS(to: string, message: string) {
  try {
    const result = await twilioClient.messages.create({
      body: message,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    })

    return { success: true, messageId: result.sid }
  } catch (error) {
    console.error("Error sending SMS:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send SMS",
    }
  }
}

/**
 * Send a booking confirmation to a client
 */
export async function sendBookingConfirmation(
  client: User,
  appointment: Appointment,
  serviceName: string,
  providerName: string,
) {
  try {
    const date = new Date(appointment.startTime).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const time = new Date(appointment.startTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })

    const templateData = {
      clientName: client.name,
      serviceName,
      providerName,
      date,
      time,
      bookingReference: appointment.id,
    }

    // Send email notification
    const emailTemplate = emailTemplates.bookingConfirmation(templateData)
    const emailResult = await sendEmail(client.email, emailTemplate.subject, emailTemplate.html)

    // Create email notification record
    if (emailResult.success) {
      await createNotification({
        userId: client.id,
        appointmentId: appointment.id,
        type: "email",
        status: "sent",
        sentAt: new Date(),
      })
    } else {
      await createNotification({
        userId: client.id,
        appointmentId: appointment.id,
        type: "email",
        status: "failed",
      })
    }

    // Send SMS notification if phone number is available
    if (client.phone) {
      const smsTemplate = smsTemplates.bookingConfirmation({
        serviceName,
        date,
        time,
        bookingReference: appointment.id,
      })

      const smsResult = await sendSMS(client.phone, smsTemplate)

      // Create SMS notification record
      if (smsResult.success) {
        await createNotification({
          userId: client.id,
          appointmentId: appointment.id,
          type: "sms",
          status: "sent",
          sentAt: new Date(),
        })
      } else {
        await createNotification({
          userId: client.id,
          appointmentId: appointment.id,
          type: "sms",
          status: "failed",
        })
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending booking confirmation:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send booking confirmation",
    }
  }
}

/**
 * Notify a provider about a new booking request
 */
export async function notifyProviderOfBookingRequest(
  provider: User,
  appointment: Appointment,
  clientName: string,
  serviceName: string,
) {
  try {
    const date = new Date(appointment.startTime).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const time = new Date(appointment.startTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })

    const templateData = {
      clientName,
      serviceName,
      date,
      time,
      bookingReference: appointment.id,
    }

    // Send email notification
    const emailTemplate = emailTemplates.bookingRequest(templateData)
    const emailResult = await sendEmail(provider.email, emailTemplate.subject, emailTemplate.html)

    // Create email notification record
    if (emailResult.success) {
      await createNotification({
        userId: provider.id,
        appointmentId: appointment.id,
        type: "email",
        status: "sent",
        sentAt: new Date(),
      })
    } else {
      await createNotification({
        userId: provider.id,
        appointmentId: appointment.id,
        type: "email",
        status: "failed",
      })
    }

    // Send SMS notification if phone number is available
    if (provider.phone) {
      const smsTemplate = smsTemplates.bookingRequest({
        clientName,
        serviceName,
        date,
        time,
      })

      const smsResult = await sendSMS(provider.phone, smsTemplate)

      // Create SMS notification record
      if (smsResult.success) {
        await createNotification({
          userId: provider.id,
          appointmentId: appointment.id,
          type: "sms",
          status: "sent",
          sentAt: new Date(),
        })
      } else {
        await createNotification({
          userId: provider.id,
          appointmentId: appointment.id,
          type: "sms",
          status: "failed",
        })
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error notifying provider of booking request:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to notify provider of booking request",
    }
  }
}

/**
 * Notify a client about a booking status update
 */
export async function notifyClientOfBookingStatusUpdate(
  client: User,
  appointment: Appointment,
  serviceName: string,
  providerName: string,
  status: "confirmed" | "cancelled" | "rescheduled",
  reason?: string,
) {
  try {
    const date = new Date(appointment.startTime).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const time = new Date(appointment.startTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })

    const templateData = {
      clientName: client.name,
      serviceName,
      providerName,
      date,
      time,
      bookingReference: appointment.id,
      status,
      reason,
    }

    // Send email notification
    const emailTemplate = emailTemplates.bookingStatusUpdate(templateData)
    const emailResult = await sendEmail(client.email, emailTemplate.subject, emailTemplate.html)

    // Create email notification record
    if (emailResult.success) {
      await createNotification({
        userId: client.id,
        appointmentId: appointment.id,
        type: "email",
        status: "sent",
        sentAt: new Date(),
      })
    } else {
      await createNotification({
        userId: client.id,
        appointmentId: appointment.id,
        type: "email",
        status: "failed",
      })
    }

    // Send SMS notification if phone number is available
    if (client.phone) {
      const smsTemplate = smsTemplates.bookingStatusUpdate({
        serviceName,
        date,
        time,
        status,
      })

      const smsResult = await sendSMS(client.phone, smsTemplate)

      // Create SMS notification record
      if (smsResult.success) {
        await createNotification({
          userId: client.id,
          appointmentId: appointment.id,
          type: "sms",
          status: "sent",
          sentAt: new Date(),
        })
      } else {
        await createNotification({
          userId: client.id,
          appointmentId: appointment.id,
          type: "sms",
          status: "failed",
        })
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error notifying client of booking status update:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to notify client of booking status update",
    }
  }
}

/**
 * Send appointment reminders to clients
 */
export async function sendAppointmentReminders() {
  try {
    // Get appointments scheduled for tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const nextDay = new Date(tomorrow)
    nextDay.setDate(nextDay.getDate() + 1)

    const { success, appointments, error } = await getAppointments({
      startDate: tomorrow.toISOString(),
      endDate: nextDay.toISOString(),
      status: "confirmed",
    })

    if (!success || !appointments) {
      throw new Error(error || "Failed to fetch appointments")
    }

    // Send reminders for each appointment
    for (const appointment of appointments) {
      // Get client and service details
      // In a real app, you would fetch these from the database
      const client = {
        /* client details */
      } as User
      const serviceName = "Service Name"
      const providerName = "Provider Name"

      const date = new Date(appointment.startTime).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      const time = new Date(appointment.startTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })

      const templateData = {
        clientName: client.name,
        serviceName,
        providerName,
        date,
        time,
        bookingReference: appointment.id,
      }

      // Send email reminder
      const emailTemplate = emailTemplates.bookingReminder(templateData)
      await sendEmail(client.email, emailTemplate.subject, emailTemplate.html)

      // Send SMS reminder if phone number is available
      if (client.phone) {
        const smsTemplate = smsTemplates.bookingReminder({
          serviceName,
          date,
          time,
        })

        await sendSMS(client.phone, smsTemplate)
      }
    }

    return { success: true, count: appointments.length }
  } catch (error) {
    console.error("Error sending appointment reminders:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send appointment reminders",
    }
  }
}

