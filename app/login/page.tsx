"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Mail, Lock } from "lucide-react"
import { useAuth } from "@/lib/auth-context-simple"

export default function LoginPage() {
  const { user, isLoading: authLoading, signIn, signUp } = useAuth()
  const redirected = useRef(false)

  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading && !redirected.current) {
      redirected.current = true
      window.location.href = "/"
    }
  }, [user, authLoading])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error: signInError } = await signIn(email, password)

      if (signInError) {
        setError(signInError)
        return
      }

      // Redirect will happen automatically via the useEffect above
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error: signUpError } = await signUp(email, password, name)

      if (signUpError) {
        setError(signUpError)
        return
      }

      setSuccess("註冊成功！請檢查您的電子郵件以確認您的帳戶。")
      setName("")
      setEmail("")
      setPassword("")
    } catch (err) {
      console.error("Registration error:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // If already logged in and not loading, don't show the login form
  if (user && !authLoading) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="w-full max-w-md">
        {/* Custom Tab Design */}
        <div className="flex mb-8 rounded-md overflow-hidden">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "login" ? "bg-[#0092D0] text-white" : "bg-[#E6F4FF] text-gray-700 hover:bg-[#C3CFF7]"
            }`}
          >
            登入
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "register" ? "bg-[#FFAA5A] text-white" : "bg-[#FFF0E6] text-gray-700 hover:bg-[#FFE0CC]"
            }`}
          >
            註冊
          </button>
        </div>

        {/* Login Form */}
        {activeTab === "login" && (
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[#0092D0] mb-2">歡迎</h1>
              <p className="text-gray-500">使用電郵登入</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail size={18} />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="電郵"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 py-6 border-[#0092D0] border rounded-md w-full bg-[#C3CFF7] text-gray-700"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="密碼"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 py-6 border-[#0092D0] border rounded-md w-full bg-[#C3CFF7] text-gray-700"
                />
              </div>

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-[#0092D0]">
                  忘記密碼？
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0092D0] hover:bg-[#0092D0]/80 text-white py-6 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? "登入中..." : "登入"}
              </Button>
            </form>
          </div>
        )}

        {/* Register Form */}
        {activeTab === "register" && (
          <div className="bg-[#FFF8F0] p-8 rounded-lg shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[#FFAA5A] mb-2">加入我們</h1>
              <p className="text-grey-500">創建新帳戶</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail size={18} />
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 py-6 border-[#FFAA5A] border rounded-md w-full bg-[#F5D7B3] text-gray-700"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail size={18} />
                </div>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 py-6 border-[#FFAA5A] border rounded-md w-full bg-[#F5D7B3] text-gray-700"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </div>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-10 py-6 border-[#FFAA5A] border rounded-md w-full bg-[#F5D7B3] text-gray-700"
                />
              </div>

              <p className="text-xs text-blue-500">密碼必須至少包含6個字符</p>

              <Button
                type="submit"
                className="w-full bg-[#FFAA5A] hover:bg-[#FFAA5A]/80 text-white py-6 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? "註冊中..." : "註冊"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
