"use client"

import { Button } from "@/components/ui/button"

export default function HomeActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <a href="/schools">
        <Button
          size="lg"
          className="w-full sm:w-auto bg-[#FFAA5A] hover:bg-[#FFAA5A]/80 text-white px-8 py-6 rounded-full font-bold text-lg"
        >
          搜尋學校
        </Button>
      </a>
    </div>
  )
}
