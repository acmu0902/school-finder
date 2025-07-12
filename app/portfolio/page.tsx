"use client"

export const dynamic = "force-dynamic"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Search, MapPin, Globe, Phone, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Initialize Supabase client with error handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a singleton Supabase client
let supabase: ReturnType<typeof createClient> | null = null
if (typeof window !== "undefined" && supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
  }
}

export default function ParentsCommentsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authInitialized, setAuthInitialized] = useState(false)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [districts, setDistricts] = useState<string[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [schools, setSchools] = useState<any[]>([])
  const [filteredSchools, setFilteredSchools] = useState<any[]>([])
  const [selectedSchool, setSelectedSchool] = useState<string>("")
  const [selectedSchoolDetails, setSelectedSchoolDetails] = useState<any>(null)

  // Comments state
  const [comments, setComments] = useState<any[]>([])
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [commentsError, setCommentsError] = useState<string | null>(null)

  // Pros and cons state
  const [prosAndCons, setProsAndCons] = useState<{ pros: string[]; cons: string[] } | null>(null)
  const [isLoadingProsAndCons, setIsLoadingProsAndCons] = useState(false)

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      if (!supabase) {
        setError("無法初始化 Supabase 客戶端")
        setIsLoading(false)
        return
      }

      try {
        setAuthInitialized(true)
        await fetchDistrictsAndSchools()
      } catch (err) {
        console.error("Auth initialization error:", err)
        setError("初始化失敗")
      } finally {
        setIsLoading(false)
      }
    }

    if (!authInitialized) {
      initializeAuth()
    }
  }, [authInitialized])

  // Check if user has premium subscription
  useEffect(() => {
    setIsPremium(true)
  }, [authInitialized])

  // Fetch districts and schools
  const fetchDistrictsAndSchools = async () => {
    if (!supabase) {
      throw new Error("Supabase client not available")
    }

    const { data, error } = await supabase.from("school_details_new_duplicate").select("*").order("name")

    if (error) {
      throw error
    }

    setSchools(data || [])

    // Extract unique districts
    const uniqueDistricts = [...new Set(data?.map((school) => school.district).filter(Boolean))]
    setDistricts(uniqueDistricts as string[])
  }

  // Filter schools when district changes
  useEffect(() => {
    if (selectedDistrict) {
      if (selectedDistrict === "all") {
        setFilteredSchools(schools)
      } else {
        const filtered = schools.filter((school) => school.district === selectedDistrict)
        setFilteredSchools(filtered)
      }
      setSelectedSchool("")
      setSelectedSchoolDetails(null)
      setComments([])
      setProsAndCons(null)
    } else {
      setFilteredSchools([])
      setSelectedSchool("")
      setSelectedSchoolDetails(null)
      setComments([])
      setProsAndCons(null)
    }
  }, [selectedDistrict, schools])

  // Fetch school details and comments when a school is selected
  useEffect(() => {
    async function fetchSchoolDetailsAndComments() {
      if (!selectedSchool || !supabase) {
        setSelectedSchoolDetails(null)
        setComments([])
        setProsAndCons(null)
        return
      }

      setIsLoadingComments(true)
      setCommentsError(null)
      setProsAndCons(null)

      try {
        // Fetch school details
        const { data: schoolData, error: schoolError } = await supabase
          .from("school_details_new_duplicate")
          .select("*")
          .eq("id", selectedSchool)
          .single()

        if (schoolError) throw schoolError

        setSelectedSchoolDetails(schoolData)

        // Generate pros and cons if parents_comments exist
        if (schoolData.parents_comments) {
          generateProsAndCons(schoolData.name, schoolData.parents_comments)
        }

        // Generate comments using AI
        await generateCommentsWithAI(schoolData.name)
      } catch (error) {
        console.error("Error fetching school details or comments:", error)
        setCommentsError("無法載入學校資料或評論，請稍後再試")
      } finally {
        setIsLoadingComments(false)
      }
    }

    fetchSchoolDetailsAndComments()
  }, [selectedSchool])

  // Organize pros and cons using Grok AI based on parents_comments
  const generateProsAndCons = async (schoolName: string, parentsComments: string) => {
    setIsLoadingProsAndCons(true)

    try {
      const prompt = `You are an AI assistant helping parents understand school reviews. 
Based ONLY on the following parents' comments about "${schoolName}", provide a balanced summary of pros and cons.
DO NOT fabricate or add any information not present in these comments.
If the comments don't contain enough information for either pros or cons, just mention that there's limited information.

Parents' comments:
${parentsComments}

Format your response as a JSON object with two arrays: "pros" and "cons", each containing 3-5 points.`

      // Call our API route to generate pros and cons with lower creativity
      const response = await fetch("/api/grok", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, temperature: 0.3 }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("API error:", response.status, errorData)
        throw new Error(errorData.error || `API request failed with status ${response.status}`)
      }

      const data = await response.json()
      if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Invalid response format from API")
      }

      const content = data.choices[0].message.content

      // Parse the JSON response
      try {
        // The response might be wrapped in code blocks, so we need to extract the JSON
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) ||
          content.match(/```\n([\s\S]*?)\n```/) || [null, content]
        const jsonString = jsonMatch[1] || content
        const parsedContent = JSON.parse(jsonString.trim())

        setProsAndCons({
          pros: Array.isArray(parsedContent.pros) ? parsedContent.pros : [],
          cons: Array.isArray(parsedContent.cons) ? parsedContent.cons : [],
        })
      } catch (parseError) {
        console.error("Error parsing pros and cons JSON:", parseError)
        throw new Error("Failed to parse AI response")
      }
    } catch (error) {
      console.error("Error generating pros and cons:", error)
      throw error
    } finally {
      setIsLoadingProsAndCons(false)
    }
  }

  // Organize comments using Grok AI
  const generateCommentsWithAI = async (schoolName: string) => {
    const categories = ["學校用品同校服", "學術課程同教學質素", "學校政策同程序", "學生福祉同體驗", "招生同入學"]

    const organizedComments = []

    for (const category of categories) {
      const prompt = `你是一個幫助家長了解學校的AI助手。請為"${schoolName}"整理一個關於"${category}"的家長評論摘要。評論應該是5個要點的簡短摘要，每個要點一句話，使用繁體中文，並以家長的角度撰寫。`

      // Call our API route to generate comment with lower creativity
      const response = await fetch("/api/grok", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, temperature: 0.3 }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `API request failed with status ${response.status}`)
      }

      const data = await response.json()
      if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Invalid response format from API")
      }

      const comment = data.choices[0].message.content

      organizedComments.push({
        id: organizedComments.length + 1,
        school_name: schoolName,
        comment,
        category,
      })
    }

    setComments(organizedComments)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const resetFilters = () => {
    setSelectedDistrict("all")
    setSelectedSchool("")
    setSelectedSchoolDetails(null)
    setComments([])
    setProsAndCons(null)
    setSearchTerm("")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F7941D] mx-auto"></div>
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
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#F7941D] mb-8">家長評論</h1>

      {/* Disclaimer */}
      <Alert className="mb-8 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>免責聲明</strong> -
          此工具提供的資訊來源於線上討論論壇和由人工智能整理，僅供參考之用，未經驗證不得視為專業建議或事實。建議使用者在依賴該資訊進行決策或其他用途前，獨立驗證其正確性。
        </AlertDescription>
      </Alert>

      {/* Search and Filters */}
      <div className="mb-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative flex items-center mb-6">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800">
              <Search size={20} />
            </div>
            <Input
              type="text"
              placeholder="搜尋學校名稱或地址..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 py-3 pr-4 h-14 rounded-full border border-blue-200 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-[#C3CFF7]"
              style={{ backgroundColor: "#C3CFF7" }}
            />
          </div>
        </form>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-full bg-white border border-blue-200 rounded-full h-12 px-4 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white text-black">
                <SelectValue placeholder="選擇地區" />
              </SelectTrigger>
              <SelectContent className="bg-[#E6F4FF]">
                <SelectItem value="all" className="text-[#003366] data-[highlighted]:bg-gray-200">
                  所有地區
                </SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district} value={district} className="text-[#003366] data-[highlighted]:bg-gray-200">
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Select
              value={selectedSchool}
              onValueChange={setSelectedSchool}
              disabled={!selectedDistrict || filteredSchools.length === 0}
            >
              <SelectTrigger className="w-full bg-white border border-blue-200 rounded-full h-12 px-4 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white text-black">
                <SelectValue placeholder={selectedDistrict ? "選擇學校" : "請先選擇地區"} />
              </SelectTrigger>
              <SelectContent className="bg-[#E6F4FF]">
                {filteredSchools.map((school) => (
                  <SelectItem
                    key={school.id}
                    value={school.id}
                    className="text-[#003366] data-[highlighted]:bg-gray-200"
                  >
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedSchoolDetails ? `已選擇: ${selectedSchoolDetails.name}` : "請選擇學校查看家長評論"}
          </div>
          <Button
            variant="outline"
            onClick={resetFilters}
            className="bg-[#0092D0] text-white hover:bg-[#0092D0]/80 hover:text-white border-0 rounded-full"
          >
            重設篩選
          </Button>
        </div>
      </div>

      {/* School Details */}
      {selectedSchoolDetails && (
        <Card className="mb-8 border-l-4 border-[#F7941D] bg-[#FFF2E6]">
          <CardHeader>
            <CardTitle className="text-2xl text-[#F7941D]">{selectedSchoolDetails.name}</CardTitle>
            <CardDescription>
              <div className="flex items-center mt-1">
                <MapPin size={16} className="mr-1 text-gray-500" />
                <span>{selectedSchoolDetails.district || "未提供地區"}</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="flex items-center text-gray-700">
                  <MapPin size={16} className="mr-2 text-[#F7941D]" />
                  {selectedSchoolDetails.address || "未提供地址"}
                </p>
              </div>
              <div>
                <p className="flex items-center text-gray-700">
                  <Phone size={16} className="mr-2 text-[#F7941D]" />
                  {selectedSchoolDetails.phone || "未提供電話"}
                </p>
              </div>
              {selectedSchoolDetails.website && (
                <div className="col-span-1 md:col-span-2">
                  <p className="flex items-center text-gray-700">
                    <Globe size={16} className="mr-2 text-[#F7941D]" />
                    <a
                      href={
                        selectedSchoolDetails.website.startsWith("http")
                          ? selectedSchoolDetails.website
                          : `https://${selectedSchoolDetails.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0092D0] hover:underline"
                    >
                      {selectedSchoolDetails.website}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      {selectedSchoolDetails && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#F7941D]">家長評論摘要</h2>

          {isLoadingComments ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F7941D] mx-auto"></div>
              <p className="mt-4 text-gray-600">載入評論中...</p>
            </div>
          ) : commentsError ? (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{commentsError}</AlertDescription>
            </Alert>
          ) : comments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comments.map((comment) => (
                <Card key={comment.id} className="border-l-4 border-[#FFAA5A] bg-[#FFF2E6]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-[#F7941D]">{comment.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-line">{comment.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">暫無家長評論</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
