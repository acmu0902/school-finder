"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

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

export default function CreatePortfolioPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkSubscription() {
      try {
        setIsLoading(true)

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/login")
          return
        }

        // Check if user has premium subscription
        const { data: subscription, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("plan_type", "premium")
          .eq("status", "active")
          .single()

        if (error && error.code !== "PGRST116") {
          console.error("Error checking subscription:", error)
          setError("無法檢查訂閱狀態，請稍後再試")
          return
        }

        if (!subscription) {
          setError("此功能僅適用於高級訂閱用戶")
          return
        }

        setIsPremium(true)
      } catch (err) {
        console.error("Unexpected error:", err)
        setError("發生錯誤，請稍後再試")
      } finally {
        setIsLoading(false)
      }
    }

    checkSubscription()
  }, [router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto"></div>
        <p className="mt-4 text-gray-600">載入中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="text-center mt-8">
          <Button onClick={() => router.push("/subscription")} className="bg-[#F7941D] hover:bg-[#F7941D]/80">
            升級至高級訂閱
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#4CAF50] mb-8 text-center">創建作品集</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>新作品集</CardTitle>
          <CardDescription>創建一個新的作品集以展示您孩子的才能和成就</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                標題
              </label>
              <Input id="title" placeholder="作品集標題" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                描述
              </label>
              <Textarea id="description" placeholder="描述您孩子的才能和成就..." rows={4} />
            </div>

            <div className="flex justify-end">
              <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/80 text-white">創建作品集</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
