import { NextResponse } from "next/server"
import { sendAppointmentReminders } from "@/app/services/notification-service"

export async function GET(request: Request) {
  // Check for authorization header (optional but recommended)
  const authHeader = request.headers.get("authorization")
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await sendAppointmentReminders()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${result.count} appointment reminders`,
    })
  } catch (error) {
    console.error("Error sending appointment reminders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

