"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@supabase/supabase-js"

export default function PremiumButtonsClient() {
  const [hasPremium, setHasPremium] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for premium status on the client side
    async function checkPremiumStatus() {
      try {
        setIsLoading(true)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
          setIsLoading(false)
          return
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          setIsLoading(false)
          return
        }

        console.log("Client: User found:", user.id)

        // Check subscription
        const { data: subscription, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("plan_type", "premium")
          .eq("status", "active")
          .limit(1)

        if (error) {
          console.error("Client: Error checking subscription:", error)
          setIsLoading(false)
          return
        }

        console.log("Client: Subscription check result:", subscription)

        if (subscription && subscription.length > 0) {
          setHasPremium(true)
        }
      } catch (error) {
        console.error("Client: Error checking premium status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkPremiumStatus()
  }, [])

  if (isLoading || !hasPremium) return null

  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
      <a href="/portfolio">
        <Button
          size="lg"
          className="w-full sm:w-auto bg-[#4CAF50] hover:bg-[#4CAF50]/80 text-white px-8 py-6 rounded-full font-bold text-lg"
        >
          家長評論
        </Button>
      </a>
      <a href="/interview-prep">
        <Button
          size="lg"
          className="w-full sm:w-auto bg-[#0092D0] hover:bg-[#0092D0]/80 text-white px-8 py-6 rounded-full font-bold text-lg"
        >
          面試準備
        </Button>
      </a>
    </div>
  )
}
