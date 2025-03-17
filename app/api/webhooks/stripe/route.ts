import { NextResponse } from "next/server"
import { handleStripeWebhook } from "@/app/services/payment-service"

export async function POST(request: Request) {
  try {
    const result = await handleStripeWebhook(request)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error handling Stripe webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

