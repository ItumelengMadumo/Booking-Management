"use server"

import { createClient } from "@supabase/supabase-js"

export async function setupDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables")
    return { success: false, error: "Missing environment variables" }
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Check if users table exists, create it if it doesn't
    const { error: usersTableError } = await supabase.rpc("create_users_table_if_not_exists")

    if (usersTableError) {
      // If the RPC doesn't exist, create the table directly
      const { error: createUsersError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          role TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `)

      if (createUsersError) {
        console.error("Error creating users table:", createUsersError)
        return { success: false, error: createUsersError }
      }
    }

    // Check if business_profiles table exists, create it if it doesn't
    const { error: businessTableError } = await supabase.rpc("create_business_profiles_table_if_not_exists")

    if (businessTableError) {
      // If the RPC doesn't exist, create the table directly
      const { error: createBusinessError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS business_profiles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id),
          name TEXT NOT NULL,
          street TEXT,
          city TEXT,
          state TEXT,
          zip_code TEXT,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `)

      if (createBusinessError) {
        console.error("Error creating business_profiles table:", createBusinessError)
        return { success: false, error: createBusinessError }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error setting up database:", error)
    return { success: false, error }
  }
}

