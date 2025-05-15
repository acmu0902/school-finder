"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context-simple"

export default function HomeActionButtons() {
  const { user: authUser, isLoading: authLoading } = useAuth()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const initialized = useRef(false)

  // Use useAuth hook safely inside useEffect
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    try {
      setUser(authUser)
      setIsLoading(authLoading)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user data")
      setIsLoading(false)
    }
  }, [authUser, authLoading])

  // During loading, show only the search button
  if (isLoading) {
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

  // If there's an error, still show the search button
  if (error) {
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

  // If user is not logged in, show search and login buttons
  if (!user) {
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
        <a href="/login">
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto bg-[#0092D0] border-[#92B6F0] text-[#FFFFFF] hover:bg-[#92B6F0] hover:text-white px-8 py-6 rounded-full font-bold text-lg"
          >
            登入 / 註冊
          </Button>
        </a>
      </div>
    )
  }

  // If user is logged in, show only the search button
  // Premium buttons are handled separately by the PremiumButton component
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
