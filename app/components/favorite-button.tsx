"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"

interface FavoriteButtonProps {
  schoolId: string
  initialFavorite?: boolean
}

export default function FavoriteButton({ schoolId, initialFavorite = false }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate checking favorite status
  useEffect(() => {
    // This would normally fetch from the database
    // For now, we'll just use the initialFavorite prop
    setIsFavorite(initialFavorite)
  }, [schoolId, initialFavorite])

  const handleToggleFavorite = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Toggle the favorite status
      setIsFavorite((prev) => !prev)

      // In a real implementation, you would call an API to update the database
      // const result = await toggleFavorite(schoolId)
      // if (result.success) {
      //   setIsFavorite(result.isFavorite)
      // }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-full ${
        isFavorite ? "text-[#E31B23] hover:text-[#E31B23]/80" : "text-gray-400 hover:text-[#FFAA5A]"
      } transition-colors duration-200 focus:outline-none`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
    </button>
  )
}
