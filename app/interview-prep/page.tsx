"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, School, Sparkles, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

// Interview questions
const INTERVIEW_QUESTIONS = [
  {
    id: 1,
    question: "為甚麼選擇這間幼稚園？",
    color: "border-[#FF6B6B]",
    description:
      "在回答這個問題時，您可以提及學校的教學理念、課程特色、師資質素或地理位置等因素，並解釋為何這些因素適合您的孩子。",
  },
  {
    id: 2,
    question: "覺得孩子有甚麼優點或缺點？",
    color: "border-[#FFD166]",
    description:
      "誠實地分享您孩子的優點，如好奇心強、喜歡分享或有創意等。談及缺點時，可以表達您如何幫助孩子改進，展示您對孩子的了解和教育態度。",
  },
  {
    id: 3,
    question: "照顧孩子遇到甚麼困難？會怎樣處理？",
    color: "border-[#06D6A0]",
    description:
      "分享一些實際的挑戰和您的解決方法，展示您的耐心和解決問題的能力。這也是表達您希望與學校合作解決問題的機會。",
  },
  {
    id: 4,
    question: "對孩子有什麼期望？",
    color: "border-[#118AB2]",
    description:
      "表達合理的期望，如希望孩子能夠快樂學習、培養良好的社交能力和學習習慣等。避免過分強調學術成就，展示您重視全面發展。",
  },
  {
    id: 5,
    question: "希望孩子在學校學到什麼？",
    color: "border-[#7209B7]",
    description:
      "除了基本知識外，可以提及社交技能、自理能力、解決問題的能力等。表達您希望學校能夠提供的支持和資源，以及您願意如何配合學校的教育。",
  },
]

export default function InterviewPrepPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Districts and schools state
  const [districts, setDistricts] = useState<string[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [schools, setSchools] = useState<any[]>([])
  const [filteredSchools, setFilteredSchools] = useState<any[]>([])
  const [selectedSchool, setSelectedSchool] = useState<string>("")
  const [selectedSchoolDetails, setSelectedSchoolDetails] = useState<any>(null)
  const [isLoadingSchoolDetails, setIsLoadingSchoolDetails] = useState(false)

  // AI-generated answers
  const [aiAnswers, setAiAnswers] = useState<{ [key: number]: string }>({})
  const [isGeneratingAnswers, setIsGeneratingAnswers] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  // Check if user has premium subscription
  useEffect(() => {
    // Allow all users to access this feature
    setIsLoading(false)
    setIsPremium(true)

    // Fetch districts and schools for all users
    fetchDistrictsAndSchools()
  }, [])

  // Fetch districts and schools
  const fetchDistrictsAndSchools = async () => {
    try {
      const { data, error } = await supabase.from("school_details_new").select("*").order("name")

      if (error) throw error

      setSchools(data || [])

      // Extract unique districts
      const uniqueDistricts = [...new Set(data?.map((school) => school.district).filter(Boolean))]
      setDistricts(uniqueDistricts as string[])
    } catch (error) {
      console.error("Error fetching schools:", error)
      setError("無法載入學校資料，請稍後再試")
    }
  }

  // Filter schools when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const filtered = schools.filter((school) => school.district === selectedDistrict)
      setFilteredSchools(filtered)
      setSelectedSchool("")
      setSelectedSchoolDetails(null)
      setAiAnswers({})
      setAiError(null)
    } else {
      setFilteredSchools([])
      setSelectedSchool("")
      setSelectedSchoolDetails(null)
      setAiAnswers({})
      setAiError(null)
    }
  }, [selectedDistrict, schools])

  // Fetch school details when a school is selected
  useEffect(() => {
    async function fetchSchoolDetails() {
      if (!selectedSchool) {
        setSelectedSchoolDetails(null)
        setAiAnswers({})
        setAiError(null)
        return
      }

      setIsLoadingSchoolDetails(true)
      setAiAnswers({})
      setAiError(null)

      try {
        const { data, error } = await supabase.from("school_details_new").select("*").eq("id", selectedSchool).single()

        if (error) throw error

        setSelectedSchoolDetails(data)

        // If the school has a vision, generate AI answers
        if (data?.vision) {
          generateAiAnswers(data.name, data.vision)
        }
      } catch (error) {
        console.error("Error fetching school details:", error)
      } finally {
        setIsLoadingSchoolDetails(false)
      }
    }

    fetchSchoolDetails()
  }, [selectedSchool])

  // Generate AI answers using our API route
  const generateAiAnswers = async (schoolName: string, vision: string) => {
    setIsGeneratingAnswers(true)
    setAiError(null)

    try {
      const answers: { [key: number]: string } = {}

      // Generate answers for each question
      for (const question of INTERVIEW_QUESTIONS) {
        const prompt = `You are helping a parent prepare for a kindergarten interview at "${schoolName}". 
The school's vision is: "${vision}"

Please draft a thoughtful answer (in Traditional Chinese) for the following interview question, incorporating the school's vision where appropriate:

Question: ${question.question}

Your answer should be concise (around 100-150 words), authentic, and show that you've done your research about the school.`

        try {
          // Call our own API route with improved error handling
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

          const answer = data.choices[0].message.content
          answers[question.id] = answer
        } catch (questionError) {
          console.error(`Error generating answer for question ${question.id}:`, questionError)
          answers[question.id] = `無法生成回答: ${questionError instanceof Error ? questionError.message : "未知錯誤"}`
        }
      }

      setAiAnswers(answers)
    } catch (error) {
      console.error("Error generating AI answers:", error)
      setAiError(`無法生成AI回答: ${error instanceof Error ? error.message : "未知錯誤"}。請稍後再試。`)
    } finally {
      setIsGeneratingAnswers(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0092D0] mx-auto"></div>
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
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#6A5ACD] mb-2">面試準備</h1>
        <div className="h-1 w-40 bg-[#FFD166] mx-auto mb-2"></div>
        <p className="text-gray-600">
          呢個係一個由人工智能驅動嘅工具，可以幫到您解答幼稚園面試父母最常見嘅五個問題。只要簡單揀選區域然後揀選學校，我哋嘅人工智能工具就會提供答案
        </p>
      </div>

      {/* Disclaimer */}
      <Alert className="mb-8 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>免責聲明</strong> -
          此工具提供的資訊由人工智能生成，僅供參考之用，未經驗證不得視為專業建議或事實。建議使用者在依賴該資訊進行決策或其他用途前，獨立驗證其正確性。
        </AlertDescription>
      </Alert>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8 border border-[#E6E6FA]">
        <h2 className="text-2xl font-bold text-[#6A5ACD] mb-6">選擇學校</h2>

        <div className="mb-6">
          <label className="block text-[#6A5ACD] font-medium mb-2">地區</label>
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="w-full bg-white border-gray-300 focus:border-[#6A5ACD] focus:ring focus:ring-[#E6E6FA] h-12 text-black">
              <SelectValue placeholder="選擇地區" />
            </SelectTrigger>
            <SelectContent className="bg-[#f5f5f5] border-none shadow-md">
              <SelectItem
                value="all"
                className="py-3 px-4 hover:bg-[#e8e8e8] focus:bg-[#e8e8e8] cursor-pointer text-[#003366]"
              >
                所有地區
              </SelectItem>
              {districts.map((district) => (
                <SelectItem
                  key={district}
                  value={district}
                  className="py-3 px-4 hover:bg-[#e8e8e8] focus:bg-[#e8e8e8] cursor-pointer flex items-center justify-between text-[#003366]"
                >
                  <span>{district}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6">
          <label className="block text-[#6A5ACD] font-medium mb-2">學校</label>
          <Select
            value={selectedSchool}
            onValueChange={setSelectedSchool}
            disabled={!selectedDistrict || filteredSchools.length === 0}
          >
            <SelectTrigger className="w-full bg-white border-gray-300 focus:border-[#6A5ACD] focus:ring focus:ring-[#E6E6FA] h-12 text-black">
              <SelectValue placeholder={selectedDistrict ? "選擇學校" : "請先選擇地區"} />
            </SelectTrigger>
            <SelectContent className="bg-[#f5f5f5] border-none shadow-md">
              {filteredSchools.map((school) => (
                <SelectItem
                  key={school.id}
                  value={school.id}
                  className="py-3 px-4 hover:bg-[#e8e8e8] focus:bg-[#e8e8e8] cursor-pointer flex items-center justify-between text-[#003366]"
                >
                  <span>{school.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* School Vision Section */}
        {isLoadingSchoolDetails ? (
          <div className="p-4 bg-[#F0F8FF] rounded-lg mb-6 text-center">
            <div className="animate-pulse h-4 bg-[#E6E6FA] rounded w-3/4 mx-auto mb-2"></div>
            <div className="animate-pulse h-4 bg-[#E6E6FA] rounded w-1/2 mx-auto"></div>
          </div>
        ) : selectedSchoolDetails?.vision ? (
          <div className="p-6 bg-[#F0F8FF] rounded-lg mb-6 border-l-4 border-[#6A5ACD]">
            <div className="flex items-center mb-3">
              <School className="text-[#6A5ACD] mr-2" size={20} />
              <h3 className="text-lg font-bold text-[#6A5ACD]">{selectedSchoolDetails.name} - 學校願景</h3>
            </div>
            <p className="text-gray-700">{selectedSchoolDetails.vision}</p>
          </div>
        ) : selectedSchoolDetails ? (
          <div className="p-4 bg-[#F0F8FF] rounded-lg mb-6 text-center text-gray-500">此學校未提供願景資料</div>
        ) : null}

        {isGeneratingAnswers && (
          <div className="p-4 bg-[#F0F8FF] rounded-lg mb-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Sparkles className="text-[#6A5ACD] mr-2 animate-pulse" size={20} />
              <p className="text-[#6A5ACD] font-medium">正在生成AI回答...</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[#6A5ACD] h-2.5 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        )}

        {aiError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{aiError}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 border border-[#E6E6FA]">
        <h2 className="text-2xl font-bold text-[#6A5ACD] mb-6 flex items-center">
          <span className="inline-block w-8 h-8 bg-[#FFD166] rounded-full text-white text-center mr-2 flex items-center justify-center">
            ?
          </span>
          五大面試問題
        </h2>

        <div className="space-y-8">
          {INTERVIEW_QUESTIONS.map((q) => (
            <div key={q.id} className={`p-6 bg-[#F0F8FF] rounded-lg border-l-4 ${q.color}`}>
              <h3 className="text-lg font-bold text-[#6A5ACD] mb-3">
                {q.id}. {q.question}
              </h3>

              {/* General guidance */}
              <p className="text-gray-700 mb-4">{q.description}</p>

              {/* AI-generated answer */}
              {aiAnswers[q.id] ? (
                <div className="mt-4 p-4 bg-white rounded-lg border border-[#E6E6FA]">
                  <div className="flex items-center mb-2">
                    <Sparkles className="text-[#6A5ACD] mr-2" size={16} />
                    <h4 className="font-medium text-[#6A5ACD]">AI生成的回答建議</h4>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{aiAnswers[q.id]}</p>
                </div>
              ) : isGeneratingAnswers ? (
                <div className="mt-4 p-4 bg-white rounded-lg border border-[#E6E6FA]">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-[#E6E6FA] rounded w-3/4"></div>
                      <div className="h-4 bg-[#E6E6FA] rounded"></div>
                      <div className="h-4 bg-[#E6E6FA] rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
