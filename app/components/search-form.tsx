"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

const teachingMethodOptions = [
  { id: "activity", label: "Activity based" },
  { id: "thematic", label: "Thematic based" },
  { id: "parent", label: "Parent Reading" },
  { id: "storytelling", label: "Storytelling" },
  { id: "outdoor", label: "Outdoor Learning" },
  { id: "sensors", label: "Sensors Learning" },
]

const curriculumOptions = [
  { value: "Local", label: "Local" },
  { value: "International", label: "International" },
  { value: "Montessori", label: "Montessori" },
  { value: "Waldorf", label: "Waldorf" },
  { value: "Reggio Emilia", label: "Reggio Emilia" },
  { value: "American", label: "American" },
  { value: "British", label: "British" },
  { value: "Forest", label: "Forest" },
]

export function SearchForm() {
  const router = useRouter()
  const [gender, setGender] = useState("")
  const [personality, setPersonality] = useState("")
  const [preferredLocation, setPreferredLocation] = useState("")
  const [curriculum, setCurriculum] = useState("")
  const [teachingMethods, setTeachingMethods] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTeachingMethodChange = (method: string) => {
    setTeachingMethods((prev) => (prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender,
          personality,
          preferredLocation,
          curriculum,
          teachingMethods,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Search failed")
      }

      router.push("/results")
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Something went wrong. Please try again.")
      }
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Find Your Ideal School</CardTitle>
        <CardDescription>Enter your preferences to find the perfect kindergarten for your child</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="gender">Gender Preference</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boys">Boys School</SelectItem>
                <SelectItem value="girls">Girls School</SelectItem>
                <SelectItem value="co-educational">Co-educational</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personality">Child's Personality</Label>
            <Textarea
              id="personality"
              placeholder="Describe your child's personality (e.g., active, shy, creative, etc.)"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Preferred Location</Label>
            <Input
              id="location"
              placeholder="Enter preferred location"
              value={preferredLocation}
              onChange={(e) => setPreferredLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="curriculum">Curriculum</Label>
            <Select value={curriculum} onValueChange={setCurriculum}>
              <SelectTrigger>
                <SelectValue placeholder="Select curriculum" />
              </SelectTrigger>
              <SelectContent>
                {curriculumOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Teaching Methods</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teachingMethodOptions.map((method) => (
                <div key={method.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={method.id}
                    checked={teachingMethods.includes(method.id)}
                    onCheckedChange={() => handleTeachingMethodChange(method.id)}
                  />
                  <Label htmlFor={method.id} className="cursor-pointer">
                    {method.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Searching..." : "Find Schools"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

