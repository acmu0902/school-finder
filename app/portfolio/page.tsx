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
        detectSessionInUrl: false, // Disable automatic URL detection
      },
    })
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
  }
}

// Mock comments data for demonstration
const MOCK_COMMENTS = [
  {
    id: 1,
    school_name: "聖保羅幼稚園",
    comment:
      "校服質素好好，但價錢偏貴。學校用品清單詳細，開學前有足夠時間準備。冬季校服保暖度高，夏季校服透氣舒適。書包設計實用，適合幼兒使用。文具要求合理，沒有過多特殊要求。",
    category: "學校用品同校服",
  },
  {
    id: 2,
    school_name: "聖保羅幼稚園",
    comment:
      "課程全面，涵蓋語言、數學、藝術和體能發展。老師經驗豐富，教學方法生動有趣。小班教學，每個孩子都得到充分關注。定期有家長會，了解孩子學習進度。提供多元化學習活動，培養孩子各方面能力。",
    category: "學術課程同教學質素",
  },
  {
    id: 3,
    school_name: "聖保羅幼稚園",
    comment:
      "學校規章制度清晰，家長手冊詳細說明各項政策。請假程序簡單，可通過電話或應用程式完成。學校安全措施完善，進出需要識別。定期舉行火災演習，確保緊急情況下的安全。溝通渠道暢通，老師樂意解答家長疑問。",
    category: "學校政策同程序",
  },
  {
    id: 4,
    school_name: "聖保羅幼稚園",
    comment:
      "孩子在學校很開心，每天都期待上學。提供健康均衡的午餐和小食。操場設施豐富，孩子有足夠活動空間。關注孩子情緒發展，有專業輔導支援。班級氣氛和諧，孩子間友誼良好。",
    category: "學生福祉同體驗",
  },
  {
    id: 5,
    school_name: "聖保羅幼稚園",
    comment:
      "入學申請程序清晰，網上系統方便使用。面試氣氛輕鬆，主要觀察孩子社交能力。錄取標準公平，不只看學術能力。學費合理，有清晰的繳費時間表。新生適應期安排妥善，幫助孩子順利過渡。",
    category: "招生同入學",
  },
  {
    id: 6,
    school_name: "瑪利諾修院學校（小學部）",
    comment:
      "校服設計典雅，質料舒適耐穿。書包輕便，適合小朋友使用。文具要求合理，開學前有詳細清單。冬季校服保暖，夏季校服透氣。學校用品可在指定商店購買，價格合理。",
    category: "學校用品同校服",
  },
]

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
        console.error("Supabase client not initialized")
        setError("無法初始化 Supabase 客戶端")
        setIsLoading(false)
        setAuthInitialized(true) // Mark as initialized even if it failed
        // Continue with demo mode
        await fetchDistrictsAndSchools()
        return
      }

      try {
        setAuthInitialized(true)
        // Fetch districts and schools without checking subscription
        // This allows the page to load even if there's an auth issue
        await fetchDistrictsAndSchools()
      } catch (err) {
        console.error("Auth initialization error:", err)
        // Continue with demo mode
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
    // Allow all users to access this feature
    setIsPremium(true)
  }, [authInitialized])

  // Fetch districts and schools
  const fetchDistrictsAndSchools = async () => {
    try {
      if (!supabase) {
        console.error("Supabase client not available for fetching schools")
        setError("無法連接到數據庫，顯示演示數據")
        // Use mock data if Supabase is not available
        const mockSchools = MOCK_COMMENTS.map((comment) => ({
          id: comment.id.toString(),
          name: comment.school_name,
          district: "示範區域",
        })).filter((school, index, self) => index === self.findIndex((s) => s.name === school.name))

        setSchools(mockSchools)
        const uniqueDistricts = ["示範區域"]
        setDistricts(uniqueDistricts)
        return
      }

      const { data, error } = await supabase.from("school_details_new_duplicate").select("*").order("name")

      if (error) {
        console.error("Error fetching schools:", error)
        throw error
      }

      setSchools(data || [])

      // Extract unique districts
      const uniqueDistricts = [...new Set(data?.map((school) => school.district).filter(Boolean))]
      setDistricts(uniqueDistricts as string[])
    } catch (error) {
      console.error("Error in fetchDistrictsAndSchools:", error)
      setError("無法載入學校資料，顯示演示數據")

      // Use mock data as fallback
      const mockSchools = MOCK_COMMENTS.map((comment) => ({
        id: comment.id.toString(),
        name: comment.school_name,
        district: "示範區域",
      })).filter((school, index, self) => index === self.findIndex((s) => s.name === school.name))

      setSchools(mockSchools)
      const uniqueDistricts = ["示範區域"]
      setDistricts(uniqueDistricts)
    }
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

        // In a real implementation, fetch comments from database
        // For now, use mock data and filter by school name
        const schoolComments = MOCK_COMMENTS.filter((comment) => comment.school_name === schoolData.name)

        if (schoolComments.length > 0) {
          setComments(schoolComments)
        } else {
          // If no comments found, generate them using Grok AI
          await generateCommentsWithAI(schoolData.name)
        }
      } catch (error) {
        console.error("Error fetching school details or comments:", error)
        setCommentsError("無法載入學校資料或評論，請稍後再試")
      } finally {
        setIsLoadingComments(false)
      }
    }

    fetchSchoolDetailsAndComments()
  }, [selectedSchool])

  // Generate pros and cons using Grok AI based on parents_comments
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

      // Call our API route to generate pros and cons
      const response = await fetch("/api/grok", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
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
        // Fallback: try to extract pros and cons using regex if JSON parsing fails
        const prosMatch = content.match(/pros[:\s]+([\s\S]*?)(?=cons|$)/i)
        const consMatch = content.match(/cons[:\s]+([\s\S]*?)(?=$)/i)

        const pros = prosMatch
          ? prosMatch[1]
              .split(/\n-|\n\d+\./)
              .filter(Boolean)
              .map((item) => item.trim())
          : []
        const cons = consMatch
          ? consMatch[1]
              .split(/\n-|\n\d+\./)
              .filter(Boolean)
              .map((item) => item.trim())
          : []

        setProsAndCons({ pros, cons })
      }
    } catch (error) {
      console.error("Error generating pros and cons:", error)
      setProsAndCons({ pros: ["無法生成優點"], cons: ["無法生成缺點"] })
    } finally {
      setIsLoadingProsAndCons(false)
    }
  }

  // Generate comments using Grok AI
  const generateCommentsWithAI = async (schoolName: string) => {
    try {
      const categories = [
        "學校用品同校服",
        "學術課程同教學質素",
        "學校政策同程序",
        "學生福祉同體驗",
        "招生同入學",
        "優點和缺點",
      ]

      const generatedComments = []

      for (const category of categories) {
        const prompt = `你是一個幫助家長了解學校的AI助手。請為"${schoolName}"生成一個關於"${category}"的家長評論摘要。評論應該是5個要點的簡短摘要，每個要點一句話，使用繁體中文，並以家長的角度撰寫。`

        // Call our API route to generate comment
        const response = await fetch("/api/grok", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        })

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()
        const comment = data.choices[0].message.content

        generatedComments.push({
          id: generatedComments.length + 1,
          school_name: schoolName,
          comment,
          category,
        })
      }

      setComments(generatedComments)
    } catch (error) {
      console.error("Error generating comments with AI:", error)
      setCommentsError("無法生成AI評論，請稍後再試")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality if needed
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
          此工具提供的資訊來源於線上討論論壇和由人工智能生成，僅供參考之用，未經驗證不得視為專業建議或事實。建議使用者在依賴該資訊進行決策或其他用途前，獨立驗證其正確性。
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
              <SelectTrigger className="w-full bg-white border border-blue-200 rounded-full h-12 px-4 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white">
                <SelectValue placeholder="選擇地區" />
              </SelectTrigger>
              <SelectContent className="bg-[#E6F4FF]">
                <SelectItem value="all" className="text-[#0092D0] data-[highlighted]:bg-gray-200">
                  所有地區
                </SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district} value={district} className="text-[#0092D0] data-[highlighted]:bg-gray-200">
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
              <SelectTrigger className="w-full bg-white border border-blue-200 rounded-full h-12 px-4 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white">
                <SelectValue placeholder={selectedDistrict ? "選擇學校" : "請先選擇地區"} />
              </SelectTrigger>
              <SelectContent className="bg-[#E6F4FF]">
                {filteredSchools.map((school) => (
                  <SelectItem
                    key={school.id}
                    value={school.id}
                    className="text-[#0092D0] data-[highlighted]:bg-gray-200"
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
