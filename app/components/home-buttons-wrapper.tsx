"use client"

import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"

// Loading component for the dynamic import - just show search button
const LoadingButtons = () => (
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

// Dynamically import the HomeActionButtons component with SSR disabled
const HomeActionButtons = dynamic(() => import("./home-action-buttons"), {
  ssr: false,
  loading: () => <LoadingButtons />,
})

export default function HomeButtonsWrapper() {
  return <HomeActionButtons />
}
