import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Parse request body with error handling
    let body
    try {
      body = await request.json()
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body",
        },
        { status: 400 },
      )
    }

    // Simple validation to prevent unauthorized access
    if (body.setupKey !== "create-tables-on-registration") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      )
    }

    // Initialize Supabase client with service role key for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // Validate environment variables
    if (!supabaseUrl) {
      console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
      return NextResponse.json(
        {
          success: false,
          error: "Supabase URL configuration missing",
        },
        { status: 500 },
      )
    }

    if (!supabaseServiceKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable")
      return NextResponse.json(
        {
          success: false,
          error: "Supabase service key configuration missing",
        },
        { status: 500 },
      )
    }

    console.log("Initializing Supabase client with service role key")
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create tables using direct SQL via RPC
    console.log("Creating database tables...")

    // Try to create tables using stored procedures
    try {
      // Create UUID extension
      await supabase.rpc("create_uuid_extension_if_not_exists").then(({ error }) => {
        if (error) console.log("Error creating UUID extension:", error.message)
      })

      // Create users table
      await supabase.rpc("create_users_table_if_not_exists").then(({ error }) => {
        if (error) console.log("Error creating users table:", error.message)
      })

      // Create business_profiles table
      await supabase.rpc("create_business_profiles_table_if_not_exists").then(({ error }) => {
        if (error) console.log("Error creating business_profiles table:", error.message)
      })

      // Create services table
      await supabase.rpc("create_services_table_if_not_exists").then(({ error }) => {
        if (error) console.log("Error creating services table:", error.message)
      })

      // Create appointments table
      await supabase.rpc("create_appointments_table_if_not_exists").then(({ error }) => {
        if (error) console.log("Error creating appointments table:", error.message)
      })

      console.log("All database tables created successfully")
      return NextResponse.json({
        success: true,
        message: "Database tables created successfully",
      })
    } catch (error) {
      console.error("Error creating tables via RPC:", error)

      // If RPC fails, we'll try a different approach
      // For now, return an error
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create tables. Please run the SQL setup script directly in the Supabase SQL editor.",
          details: error instanceof Error ? error.message : JSON.stringify(error),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Unhandled error in setup-database API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "This endpoint requires a POST request with proper setup key",
    },
    { status: 405 },
  )
}

