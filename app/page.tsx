export const dynamic = "force-dynamic"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import HomeButtonsWrapper from "./components/home-buttons-wrapper"
import { Suspense } from "react"

// This is a Server Component that shows premium buttons to all users
async function PremiumButton() {
  // Always show the buttons to all users - no authentication required
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

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%20%2819%29.png-0qWyYqmIVwg0dgeDwhgfgXGrXR5U2c.webp"
          alt="Kindergarten classroom with pastel colors and educational toys"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-16 bg-white/70 p-8 rounded-xl backdrop-blur-sm max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#0092D0]">尋找最適合您孩子的學校</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            我們幫助家長找到最合適的學校，讓孩子在理想的環境中成長和學習。
          </p>

          <HomeButtonsWrapper />

          {/* Premium Button - only shown to premium subscribers */}
          <Suspense fallback={null}>
            {/* @ts-expect-error Server Component */}
            <PremiumButton />
          </Suspense>

          {/* Client-side fallback for premium buttons */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* First Card - Blue Border */}
          <div className="bg-white/90 p-8 rounded-2xl shadow-md card-hover border-2 border-[#0092D0]">
            <div className="w-16 h-16 rounded-full bg-[#0092D0]/10 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#0092D0]"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#0092D0] mb-4">搜尋學校</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>輕鬆篩選符合需求的幼稚園，包括地理位置、教學理念和課程特色</li>
              <li>即時掌握學校全面資訊，快速了解每間學校的優勢與特點</li>
              <li>高效縮小選擇範圍，專注於最適合孩子的教育環境</li>
            </ul>
          </div>

          {/* Second Card - Orange Border */}
          <div className="bg-white/90 p-8 rounded-2xl shadow-md card-hover border-2 border-[#F7941D]">
            <div className="w-16 h-16 rounded-full bg-[#F7941D]/10 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#F7941D]"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#F7941D] mb-4">查看真實家長評價</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>獲取其他家長的真實反饋，了解學校環境與教學質量</li>
              <li>從親身經歷中獲得寶貴建議，幫助評估學校是否適合孩子</li>
              <li>借鑒同路人的經驗，讓選擇更有信心、更安心</li>
            </ul>
          </div>

          {/* Third Card - Green Border */}
          <div className="bg-white/90 p-8 rounded-2xl shadow-md card-hover border-2 border-[#4CAF50]">
            <div className="w-16 h-16 rounded-full bg-[#4CAF50]/10 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#4CAF50]"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#4CAF50] mb-4">AI撰寫工具</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>快速整理繁雜資料，生成清晰易懂的內容，節省家長時間</li>
              <li>提供專業支持，幫助聚焦關鍵資訊，簡化決策過程</li>
              <li>以智能科技提升搜尋效率，讓資訊更精準、更可靠</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
