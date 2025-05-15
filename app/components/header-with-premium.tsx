import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import Header from "./header"

export default async function HeaderWithPremium() {
  let showPremiumLink = false

  try {
    const cookieStore = cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase environment variables are missing")
      return <Header showPremiumLink={false} />
    }

    // Create a Supabase client for server-side
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          try {
            return cookieStore.get(name)?.value
          } catch (error) {
            console.error("Error accessing cookie:", error)
            return undefined
          }
        },
      },
      auth: {
        persistSession: false, // Don't persist the session on the server
      },
    })

    // Get the current user with error handling
    try {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data?.user) {
        return <Header showPremiumLink={false} />
      }

      // Check if user has premium subscription
      try {
        const { data: subscription, error: subError } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("user_id", data.user.id)
          .eq("plan_type", "premium")
          .eq("status", "active")
          .limit(1)

        if (!subError && subscription && subscription.length > 0) {
          showPremiumLink = true
        }
      } catch (subError) {
        console.error("Error checking subscription:", subError)
      }
    } catch (userError) {
      console.error("Error getting user:", userError)
    }
  } catch (error) {
    console.error("Error in HeaderWithPremium:", error instanceof Error ? error.message : String(error))
  }

  // Always return a header component, even if there was an error
  return <Header showPremiumLink={showPremiumLink} />
}
