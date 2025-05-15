"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Loading component
const LoadingComponent = () => (
  <div className="container mx-auto px-4 py-12 text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    <p className="mt-4 text-gray-600">載入中...</p>
  </div>
)

// Dynamically import the subscription client component with SSR disabled
const SubscriptionPageClient = dynamic(() => import("./subscription-client"), {
  ssr: false,
  loading: () => <LoadingComponent />,
})

export default function ClientWrapper() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <SubscriptionPageClient />
    </Suspense>
  )
}
