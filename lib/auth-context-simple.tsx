"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a singleton Supabase client
let supabase: ReturnType<typeof createClient> | null = null
if (typeof window !== "undefined" && supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

type User = {
  id: string
  email: string
  name?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: any; user: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const initialized = useRef(false)
  const authListenerSet = useRef(false)

  // One-time initialization
  useEffect(() => {
    if (!supabase || initialized.current) {
      return
    }

    initialized.current = true

    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        if (data?.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || "",
            name: data.user.user_metadata?.name || "",
          })
        }
      } catch (error) {
        console.error("Error checking user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [])

  // Set up auth listener separately
  useEffect(() => {
    if (!supabase || authListenerSet.current) {
      return
    }

    authListenerSet.current = true

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event)

      if (event === "SIGNED_IN" && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name || "",
        })
        setIsLoading(false)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setIsLoading(false)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: "Supabase client not initialized" }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error: error ? error.message : null }
    } catch (error) {
      console.error("Sign in error:", error)
      return { error: "An unexpected error occurred" }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (!supabase) return { error: "Supabase client not initialized", user: null }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      })

      if (!error && data.user) {
        try {
          await supabase.from("users").insert([
            {
              id: data.user.id,
              email,
              name,
              created_at: new Date().toISOString(),
            },
          ])
        } catch (insertError) {
          console.error("Error inserting user:", insertError)
        }
      }

      return { error: error ? error.message : null, user: data.user }
    } catch (error) {
      console.error("Sign up error:", error)
      return { error: "An unexpected error occurred", user: null }
    }
  }

  const signOut = async () => {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
      // We'll let the auth listener handle the state update
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
