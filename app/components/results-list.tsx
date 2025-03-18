"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ExternalLink, MapPin } from "lucide-react"

interface School {
  name: string
  address: string
  phone: string
  website: string
  teachingMethods: string
  features: string
  curriculum: string
  matchPercentage?: number
  matchExplanation?: string
}

export function ResultsList() {
  const [schools, setSchools] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("/api/search/results")

        if (!response.ok) {
          throw new Error("Failed to fetch results")
        }

        const data = await response.json()
        setSchools(data.schools || [])
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("Something went wrong. Please try again.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-destructive/15 text-destructive text-sm p-6 rounded-md">{error}</div>
  }

  if (schools.length === 0) {
    return (
      <div className="text-center p-6">
        <h3 className="text-xl font-semibold mb-2">No matches found</h3>
        <p className="text-muted-foreground">Try adjusting your search criteria to find more schools.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Matching Schools ({schools.length})</h2>

      <div className="grid grid-cols-1 gap-6">
        {schools.map((school, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{school.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {school.address}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Curriculum</h4>
                <p className="text-sm text-muted-foreground">{school.curriculum}</p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Teaching Methods</h4>
                <p className="text-sm text-muted-foreground">{school.teachingMethods}</p>
              </div>

              {school.matchPercentage !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Personality Match</h4>
                    <span className="font-semibold">{school.matchPercentage}%</span>
                  </div>
                  <Progress value={school.matchPercentage} className="h-2" />
                  {school.matchExplanation && (
                    <p className="text-sm text-muted-foreground mt-1">{school.matchExplanation}</p>
                  )}
                </div>
              )}

              <div>
                <h4 className="font-medium mb-1">Contact</h4>
                <p className="text-sm text-muted-foreground">{school.phone}</p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              {school.website && (
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <a href={school.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Visit Website
                  </a>
                </Button>
              )}

              <Button variant="outline" className="flex items-center gap-2" asChild>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(school.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="h-4 w-4" />
                  View on Map
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

