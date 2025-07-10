"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context-simple"
import { LogOut, User } from "lucide-react"

interface HeaderProps {
  showPremiumLink?: boolean
}

export default function Header({ showPremiumLink = false }: HeaderProps) {
  const { user, signOut, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const isLoggingOut = useRef(false)
  const initialized = useRef(false)
  const [isHomePage, setIsHomePage] = useState(false)

  // Only show user state after component has mounted to prevent hydration mismatch
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      setMounted(true)

      // Check if we're on the home page
      setIsHomePage(window.location.pathname === "/")
    }
  }, [])

  const handleLogout = async () => {
    if (isLoggingOut.current) return

    isLoggingOut.current = true
    await signOut()

    // Use a simple redirect instead of router.push to avoid potential loops
    window.location.href = "/"
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image__18_-removebg-preview-0qIZyufUHFapDCG70EkUnc2ia5wvVd.png"
              alt="SmartStart Logo"
              width={180}
              height={60}
              className="h-auto"
              priority
            />
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-[#4CAF50] hover:text-[#4CAF50]/80 font-bold text-lg transform hover:scale-105 transition-transform"
              style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif" }}
            >
              主頁
            </a>
            <a
              href="/schools"
              className="text-[#0092D0] hover:text-[#0092D0]/80 font-bold text-lg transform hover:scale-105 transition-transform"
              style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif" }}
            >
              學校搜尋
            </a>
            <a
              href="/portfolio"
              className="text-[#F7941D] hover:text-[#F7941D]/80 font-bold text-lg transform hover:scale-105 transition-transform"
              style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif" }}
            >
              家長評論
            </a>
            <a
              href="/interview-prep"
              className="text-[#6A5ACD] hover:text-[#6A5ACD]/80 font-bold text-lg transform hover:scale-105 transition-transform"
              style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif" }}
            >
              面試準備
            </a>
            <a
              href="/about"
              className="text-[#4CAF50] hover:text-[#4CAF50]/80 font-bold text-lg transform hover:scale-105 transition-transform"
              style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif" }}
            >
              關於我們
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            {!mounted || isLoading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-gray-700">
                    <User size={16} className="text-[#0092D0]" />
                    <span className="font-medium">{user.name || user.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="bg-[#92B6F0] border-[#0092D0] text-[#FFFFFF] hover:bg-[#0092D0] hover:text-white flex items-center gap-1"
                  >
                    <LogOut size={14} />
                    登出
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
