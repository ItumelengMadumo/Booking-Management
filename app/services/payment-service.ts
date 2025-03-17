"use server"

import Stripe from "stripe"
import { z } from "zod"

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // Use the latest API version
})

// Schema for payment intent creation
const PaymentIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("usd"),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  customerId: z.string().optional(),
  receiptEmail: z.string().email().optional(),
})

type PaymentIntentParams = z.infer<typeof PaymentIntentSchema>

/**
 * Create a payment intent with Stripe
 */
export async function createPaymentIntent(params: PaymentIntentParams) {
  try {
    const validatedParams = PaymentIntentSchema.parse(params)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: validatedParams.amount,
      currency: validatedParams.currency,
      description: validatedParams.description,
      metadata: validatedParams.metadata,
      receipt_email: validatedParams.receiptEmail,
      ...(validatedParams.customerId && { customer: validatedParams.customerId }),
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create payment intent",
    }
  }
}

/**
 * Create a Stripe checkout session for a booking
 */
export async function createCheckoutSession(params: {
  bookingId: string
  serviceId: string
  serviceName: string
  amount: number
  customerEmail: string
  paymentType: "deposit" | "full"
  successUrl: string
  cancelUrl: string
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: params.serviceName,
              description: `${params.paymentType === "deposit" ? "Deposit for" : "Full payment for"} ${params.serviceName}`,
            },
            unit_amount: params.amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${params.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: params.cancelUrl,
      customer_email: params.customerEmail,
      metadata: {
        bookingId: params.bookingId,
        serviceId: params.serviceId,
        paymentType: params.paymentType,
      },
    })

    return { success: true, url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create checkout session",
    }
  }
}

/**
 * Verify a payment was successful
 */
export async function verifyPayment(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    return {
      success: true,
      status: paymentIntent.status,
      isSuccessful: paymentIntent.status === "succeeded",
      amount: paymentIntent.amount,
      metadata: paymentIntent.metadata,
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify payment",
    }
  }
}

/**
 * Create a refund for a payment
 */
export async function createRefund(params: {
  paymentIntentId: string
  amount?: number
  reason?: "duplicate" | "fraudulent" | "requested_by_customer"
}) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: params.paymentIntentId,
      ...(params.amount && { amount: params.amount }),
      ...(params.reason && { reason: params.reason }),
    })

    return {
      success: true,
      refundId: refund.id,
      status: refund.status,
    }
  } catch (error) {
    console.error("Error creating refund:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create refund",
    }
  }
}

/**
 * Create a Stripe customer
 */
export async function createCustomer(params: {
  email: string
  name: string
  phone?: string
  metadata?: Record<string, string>
}) {
  try {
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.name,
      phone: params.phone,
      metadata: params.metadata,
    })

    return {
      success: true,
      customerId: customer.id,
    }
  } catch (error) {
    console.error("Error creating customer:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create customer",
    }
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature") as string

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)

    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded":
        // Handle successful payment
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handleSuccessfulPayment(paymentIntent)
        break

      case "checkout.session.completed":
        // Handle completed checkout session
        const session = event.data.object as Stripe.Checkout.Session
        await handleCompletedCheckout(session)
        break

      // Add more event handlers as needed
    }

    return { success: true }
  } catch (error) {
    console.error("Error handling webhook:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to handle webhook",
    }
  }
}

// Helper functions for webhook handlers
async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  // Update booking status in database
  // Send confirmation notification
  // Additional business logic
  console.log("Payment succeeded:", paymentIntent.id)
}

async function handleCompletedCheckout(session: Stripe.Checkout.Session) {
  // Update booking status in database
  const bookingId = session.metadata?.bookingId
  const paymentType = session.metadata?.paymentType

  if (bookingId) {
    // Update booking payment status
    // Additional business logic
    console.log(`Checkout completed for booking ${bookingId} with ${paymentType} payment`)
  }
}

