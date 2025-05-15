export const dynamic = "force-dynamic"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%20%2819%29.png-HHx4jXGXHF9NnGHdUylUW88nmDV78I.webp"
          alt="Kindergarten classroom"
          fill
          className="object-cover opacity-15"
          priority
        />
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white/0 p-8 rounded-xl shadow-sm ">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-[#4CAF50] mb-8">關於我們</h1>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p>
              在 SmartStart
              ，我們相信每個孩子都值得擁有人生中最好的起點——一個建立在愛、關懷和優質教育基礎上的開始。作為三個孩子的家長，我親身體會到為孩子尋找理想幼稚園時所面臨的挑戰、恐懼和挫折。無休止的研究、學校參觀、意見分歧，以及深夜的討論，這些都會讓人感到不堪重負。正因如此，我們創立了
              SmartStart ——讓這段旅程變得更輕鬆、更明智，也讓您更有信心。
            </p>

            <p>
              SmartStart
              不僅僅是一個搜尋工具；它是由家長為家長設計的平台。我們的使命很簡單：幫助您找到最適合的幼稚園，讓您的孩子能夠茁壯成長，邁出通往美好未來的第一步。我們明白這些早期歲月的重要性——不僅僅��學術發展，還包括社交能力、情緒健康和終身學習習慣。有了
              SmartStart ，您可以隨時掌握所有需要的資訊，讓您對孩子的教育做出自信且明智的決定。
            </p>

            <h2 className="text-2xl font-bold text-[#4CAF50] mt-8 mb-4">為什麼選擇 SmartStart ？</h2>

            <ul className="space-y-4 list-disc pl-6">
              <li>
                <span className="font-semibold">以家長為中心的設計</span>
                ：平台的每個功能都是帶著同理心和理解精心打造的。從可自訂的篩選條件，到詳細的幼稚園介紹，我們周到地包含了所有能讓您快速高效縮小選擇範圍的功能。
              </li>
              <li>
                <span className="font-semibold">全面的資訊</span>：告別零散的評論和不完整的細節。SmartStart
                提供最新的見解，涵蓋每間幼稚園的課程、設施、教學理念、課外活動及安全措施——全都在同一個地方。
              </li>
              <li>
                <span className="font-semibold">來自真實家長的可信評價</span>
                ：直接聆聽其他走過相同道路的家長分享經驗。他們的誠實反饋將在您做決定時提供指引。
              </li>
              <li>
                <span className="font-semibold">省時的簡便操作</span>：不用再在多個網站之間切換或打無數電話。使用
                SmartStart ，您可以並排比較學校，保存您的最愛，甚至輕鬆安排參觀。
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[#4CAF50] mt-8 mb-4">源於親身經歷</h2>

            <p>
              作為一名家長，我記得那些無眠的夜晚，不斷思考是否為孩子做出了正確的選擇。他們會安全嗎？他們會喜歡學習嗎？他們會交到朋友嗎？這些問題驅使我創立了
              SmartStart ，這樣就沒有家長需要再次孤單面對這個過程。
            </p>

            <p>
              我們會全程支持您，因為當涉及到孩子的未來時，容不得任何妥協。一起為他們提供一個聰明的開始——充滿喜悅、好奇心和無限可能的起點。
            </p>

            <p className="text-center font-semibold text-[#4CAF50] mt-8">
              歡迎來到 SmartStart 。讓我們一步步，一所幼稚園接著一所幼稚園，共同建造更光明的明天。
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/schools">
              <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/80 text-white px-6 py-2 rounded-full">
                開始尋找學校
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
