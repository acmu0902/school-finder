"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalUsers: 0,
    totalSubscriptions: 0,
  })

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          // Fetch admin stats
          await fetchStats()
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  async function fetchStats() {
    try {
      // Get total schools count
      const { count: schoolsCount, error: schoolsError } = await supabase
        .from("school_details_new")
        .select("*", { count: "exact", head: true })

      if (schoolsError) throw schoolsError

      // Get total users count
      const { count: usersCount, error: usersError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })

      if (usersError) throw usersError

      // Get total subscriptions count
      const { count: subscriptionsCount, error: subscriptionsError } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true })

      if (subscriptionsError) throw subscriptionsError

      setStats({
        totalSchools: schoolsCount || 0,
        totalUsers: usersCount || 0,
        totalSubscriptions: subscriptionsCount || 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">未授權訪問</h1>
        <p className="text-gray-600 mb-6">您需要登入才能訪問管理頁面</p>
        <Link href="/login">
          <Button>登入</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">管理控制台</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.totalSchools}</CardTitle>
            <CardDescription>學校總數</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/schools">
              <Button variant="outline" size="sm">
                管理學校
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.totalUsers}</CardTitle>
            <CardDescription>用戶總數</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/users">
              <Button variant="outline" size="sm">
                管理用戶
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.totalSubscriptions}</CardTitle>
            <CardDescription>訂閱總數</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/subscriptions">
              <Button variant="outline" size="sm">
                管理訂閱
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schools" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="schools">學校管理</TabsTrigger>
          <TabsTrigger value="users">用戶管理</TabsTrigger>
          <TabsTrigger value="subscriptions">訂閱管理</TabsTrigger>
        </TabsList>

        <TabsContent value="schools" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-600 mb-4">學校管理</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/schools">
                <Button className="w-full">查看所有學校</Button>
              </Link>
              <Link href="/admin/schools/add">
                <Button variant="outline" className="w-full">
                  添加新學校
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-600 mb-4">用戶管理</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/users">
                <Button className="w-full">查看所有用戶</Button>
              </Link>
              <Link href="/admin/users/add">
                <Button variant="outline" className="w-full">
                  添加新用戶
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-600 mb-4">訂閱管理</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/subscriptions">
                <Button className="w-full">查看所有訂閱</Button>
              </Link>
              <Link href="/admin/subscription-plans">
                <Button variant="outline" className="w-full">
                  管理訂閱計劃
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
