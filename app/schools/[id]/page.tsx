"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import SchoolDetailTabs from "@/app/components/school-detail-tabs"

export const dynamic = "force-dynamic"

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

export default function SchoolDetailPage() {
  const { id } = useParams()
  const [school, setSchool] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSchoolDetails() {
      try {
        setIsLoading(true)
        setError(null)

        if (!id) {
          throw new Error("學校ID未提供")
        }

        const { data, error } = await supabase.from("school_details_new").select("*").eq("id", id).single()

        if (error) throw error

        setSchool(data)
      } catch (err: any) {
        console.error("Error fetching school details:", err)
        setError(err.message || "載入學校資料時發生錯誤")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchSchoolDetails()
    }
  }, [id])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/schools">
          <Button variant="ghost" className="flex items-center gap-2 pl-0 hover:pl-2 transition-all">
            <ChevronLeft size={16} />
            返回學校列表
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
          <Link href="/schools">
            <Button variant="outline" className="mt-4">
              返回學校列表
            </Button>
          </Link>
        </div>
      ) : school ? (
        <SchoolDetailTabs school={school} id={id as string} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">未找到學校資料</p>
          <Link href="/schools">
            <Button variant="outline" className="mt-4">
              返回學校列表
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
