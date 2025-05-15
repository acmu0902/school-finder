"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useAuth } from "@/lib/auth-context-simple"

// Update the Supabase client initialization
// Replace the current initialization code with this:

// Initialize Supabase client with error handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables are missing")
    // Return a dummy client that will be replaced once the component mounts
    return null as any
  }
  return createClient(supabaseUrl, supabaseAnonKey)
})()

export default function SubscriptionPageClient() {
  const router = useRouter()
  const { user: authUser, isLoading: authLoading } = useAuth()
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Use useAuth hook safely inside useEffect
  useEffect(() => {
    setUser(authUser)
    setIsLoading(authLoading)
  }, [authUser, authLoading])

  useEffect(() => {
    async function fetchSubscription() {
      try {
        if (user) {
          // Fetch subscription status
          const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single()

          if (error && error.code !== "PGRST116") {
            console.error("Error fetching subscription:", error)
          }

          setSubscription(data || null)
        }
      } catch (error) {
        console.error("Error checking subscription:", error)
      }
    }

    if (user) {
      fetchSubscription()
    }
  }, [user])

  const handleSubscribe = async (plan: string) => {
    if (!user) {
      router.push("/login")
      return
    }

    // In a real implementation, this would redirect to Stripe checkout
    // For now, we'll just simulate a successful subscription
    try {
      const { data, error } = await supabase.from("subscriptions").upsert({
        user_id: user.id,
        plan_type: plan,
        status: "active",
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      })

      if (error) throw error

      // Refresh the page to show updated subscription
      window.location.reload()
    } catch (error) {
      console.error("Error subscribing:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">載入中...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-[#F7941D] mb-4">訂閱計劃</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        升級到高級計劃，獲取更多功能和更好的體驗。獲得真實家長評價，使用AI輔助工具，並獲得專家建議。
      </p>

      {subscription && subscription.status === "active" ? (
        <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-green-700 mb-2">您已訂閱 {subscription.plan_type} 計劃</h2>
          <p className="text-green-600 mb-4">
            您的訂閱有效期至 {new Date(subscription.expires_at).toLocaleDateString()}
          </p>
          <Link href="/account">
            <Button variant="outline">管理您的訂閱</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500"
                >
                  <path d="M10 10c.5-2.5 4.343-2.657 4-0.5"></path>
                  <path d="M10.5 9.5c.5-2.5-4.343-2.657-4-0.5"></path>
                  <path d="M9.5 13.5C8 17.5 6 18 6 18.5c0 .5.5 1 1 1"></path>
                  <path d="M13.5 13.5c1.5 4 3.5 4.5 3.5 5 0 .5-.5 1-1 1"></path>
                  <path d="M16 18c-1 0-4-1-8-6-4.5-5.5-.5-8.5 1-9 1.5-.5 5 2.5 5 6.5 0 0 0 3-2 5 0 0 1.5 1.5 3 1.5 1.5 0 3-2 3-2"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-400 uppercase mb-2">免費</h2>
            <div className="mb-6">
              <span className="text-3xl font-bold">HK$0</span>
              <span className="text-gray-500">/年</span>
            </div>

            <div className="space-y-3 text-left mb-8">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>搜尋所有學校</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>查看學校基本資料</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>最多收藏 5 所學校</span>
              </div>
            </div>

            <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50" disabled={user === null}>
              目前方案
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-lg border-2 border-[#F7941D] p-6 text-center hover:shadow-lg transition-shadow relative">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#F7941D]/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#F7941D]"
                >
                  <path d="M22 12.5V6l-4-4H7a3 3 0 0 0-3 3v13a3 3 0 0 0 3 3h8"></path>
                  <path d="M18 15v6"></path>
                  <path d="M15 18h6"></path>
                  <path d="M18 2v4h4"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-[#F7941D] uppercase mb-2">高級</h2>
            <div className="mb-6">
              <span className="text-3xl font-bold">HK$8</span>
              <span className="text-gray-500">/月</span>
            </div>

            <div className="space-y-3 text-left mb-8">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>免費計劃的所有功能</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>查看真實家長評價</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>按心儀小學搜尋幼稚園</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>AI輔助作品集撰寫工具</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>申請表格問題支援</span>
              </div>
            </div>

            <Button
              className="w-full bg-[#F7941D] hover:bg-[#F7941D]/80 text-white"
              onClick={() => handleSubscribe("premium")}
              disabled={user === null}
            >
              {user ? "立即訂閱" : "請先登入"}
            </Button>
          </div>
        </div>
      )}

      {!user && (
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">您需要登入才能訂閱</p>
          <Link href="/login">
            <Button className="bg-[#0092D0] hover:bg-[#0092D0]/80">登入或註冊</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
