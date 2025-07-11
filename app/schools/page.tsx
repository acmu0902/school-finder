"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Bookmark, Search, ChevronLeft, ChevronRight } from "lucide-react"

export const dynamic = "force-dynamic"

// Initialize Supabase client with error handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a singleton Supabase client
let supabase: ReturnType<typeof createClient> | null = null
if (typeof window !== "undefined" && supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<any[]>([])
  const [filteredSchools, setFilteredSchools] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const initialized = useRef(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const schoolsPerPage = 9

  // Filter states
  const [districts, setDistricts] = useState<string[]>([])
  const [schoolTypes, setSchoolTypes] = useState<string[]>([])
  const [genders, setGenders] = useState<string[]>([])

  // Selected filters
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedSchoolType, setSelectedSchoolType] = useState<string>("")
  const [selectedGender, setSelectedGender] = useState<string>("")

  useEffect(() => {
    if (!supabase || initialized.current) {
      return
    }

    initialized.current = true

    async function fetchSchools() {
      try {
        setIsLoading(true)
        const { data, error } = await supabase.from("school_details_new").select("*").order("name")

        if (error) throw error

        setSchools(data || [])
        setFilteredSchools(data || [])

        // Extract unique values for filters
        const uniqueDistricts = [...new Set(data?.map((school) => school.district).filter(Boolean))]
        const uniqueSchoolTypes = [...new Set(data?.map((school) => school.school_type).filter(Boolean))]
        const uniqueGenders = [...new Set(data?.map((school) => school.gender).filter(Boolean))]

        setDistricts(uniqueDistricts as string[])
        setSchoolTypes(uniqueSchoolTypes as string[])
        setGenders(uniqueGenders as string[])
      } catch (error) {
        console.error("Error fetching schools:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchools()
  }, [])

  // Apply filters when they change
  useEffect(() => {
    let result = schools

    // Apply district filter
    if (selectedDistrict) {
      result = result.filter((school) => school.district === selectedDistrict)
    }

    // Apply school type filter
    if (selectedSchoolType) {
      result = result.filter((school) => school.school_type === selectedSchoolType)
    }

    // Apply gender filter
    if (selectedGender) {
      result = result.filter((school) => school.gender === selectedGender)
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (school) =>
          (school.name && school.name.toLowerCase().includes(term)) ||
          (school.address && school.address.toLowerCase().includes(term)),
      )
    }

    setFilteredSchools(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [schools, selectedDistrict, selectedSchoolType, selectedGender, searchTerm])

  const resetFilters = () => {
    setSelectedDistrict("")
    setSelectedSchoolType("")
    setSelectedGender("")
    setSearchTerm("")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The search is already applied via useEffect, this just prevents form submission
  }

  // Handle map link click to prevent parent navigation
  const handleMapLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Get current schools for pagination
  const indexOfLastSchool = currentPage * schoolsPerPage
  const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage
  const currentSchools = filteredSchools.slice(indexOfFirstSchool, indexOfLastSchool)
  const totalPages = Math.ceil(filteredSchools.length / schoolsPerPage)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-1izL8HPIZwxNfJoTVBhjfFD96MrBpC.png"
          alt="Kindergarten background with cute clouds, sun, and rainbows"
          fill
          className="object-cover opacity-50 blur-[1px]"
          priority
        />
        <div className="absolute inset-0 bg-white/60" />
      </div>
      <div className="container relative z-10 mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#0092D0] mb-8">學校搜尋</h1>

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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
                    <SelectItem
                      key={district}
                      value={district}
                      className="text-[#003366] data-[highlighted]:bg-gray-200"
                    >
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Select value={selectedSchoolType} onValueChange={setSelectedSchoolType}>
                <SelectTrigger className="w-full bg-white border border-blue-200 rounded-full h-12 px-4 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white text-black">
                  <SelectValue placeholder="學校類型" />
                </SelectTrigger>
                <SelectContent className="bg-[#E6F4FF]">
                  <SelectItem value="all" className="text-[#003366] data-[highlighted]:bg-gray-200">
                    所有類型
                  </SelectItem>
                  {schoolTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-[#003366] data-[highlighted]:bg-gray-200">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger className="w-full bg-white border border-blue-200 rounded-full h-12 px-4 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white text-black">
                  <SelectValue placeholder="性別" />
                </SelectTrigger>
                <SelectContent className="bg-[#E6F4FF]">
                  <SelectItem value="all" className="text-[#003366] data-[highlighted]:bg-gray-200">
                    所有性別
                  </SelectItem>
                  {genders.map((gender) => (
                    <SelectItem key={gender} value={gender} className="text-[#003366] data-[highlighted]:bg-gray-200">
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">找到 {filteredSchools.length} 所學校</div>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="bg-[#4BAAE0] text-white hover:bg-[#0092D0] hover:text-white border-0 rounded-full"
            >
              重設篩選
            </Button>
          </div>
        </div>

        {/* School List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0092D0] mx-auto"></div>
            <p className="mt-4 text-gray-600">載入中...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentSchools.length > 0 ? (
                currentSchools.map((school) => (
                  <div
                    key={school.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 h-full"
                  >
                    <div className="flex flex-col h-full border-l-4 border-[#4BAAE0]">
                      <div className="p-4 flex-grow">
                        <div className="flex items-start">
                          <div className="mr-3 flex-shrink-0">
                            {school.logo_image || school.image_url || school.logo_url || school.logo ? (
                              <Image
                                src={school.logo_image || school.image_url || school.logo_url || school.logo}
                                alt={school.name}
                                width={48}
                                height={48}
                                className="rounded-md object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-[#F7DE9E] rounded-md flex items-center justify-center">
                                <span className="text-xl font-bold text-[#FFFFFF]">
                                  {school.name?.charAt(0) || "S"}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <Link href={`/schools/${school.id}`}>
                              <h3 className="font-high text-blue-500 mb-1 hover:underline">{school.name}</h3>
                            </Link>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <span className="mr-2">{school.school_type || "學校"}</span>
                              {school.district && (
                                <div className="flex items-center">
                                  <MapPin size={14} className="mr-1" />
                                  <span>{school.district}</span>
                                </div>
                              )}
                            </div>
                            {school.address ? (
                              <div className="flex items-start">
                                <MapPin size={12} className="mr-1 flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                  <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={handleMapLinkClick}
                                    className="text-sm text-gray-600 line-clamp-2 hover:text-blue-500 hover:underline"
                                  >
                                    {school.address}
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-600 line-clamp-2">未提供地址</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex space-x-1">
                          {school.gender && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {school.gender}
                            </span>
                          )}
                        </div>
                        <Link href={`/schools/${school.id}`}>
                          <button className="text-sm text-[#4BAAE0] hover:text-[#0092D0] flex items-center">
                            <Bookmark size={16} className="mr-1" />
                            收藏
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">沒有找到符合條件的學校</p>
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="mt-4 bg-[#4BAAE0] text-white hover:bg-[#0092D0] hover:text-white border-0 rounded-full"
                  >
                    重設篩選
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredSchools.length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center bg-[#E6F4FF] text-[#0092D0] hover:bg-[#0092D0] hover:text-white border-[#0092D0]"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    上一頁
                  </Button>

                  <span className="px-4 py-2 text-sm">
                    第 {currentPage} 頁，共 {totalPages} 頁
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center bg-[#E6F4FF] text-[#0092D0] hover:bg-[#0092D0] hover:text-white border-[#0092D0]"
                  >
                    下一頁
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
