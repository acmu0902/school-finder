import { NextResponse } from "next/server"
import { getSchoolsData } from "@/lib/sheets-parser"
import { analyzePersonalityFit } from "@/lib/grok-ai"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { setSearchResults } from "@/lib/search-store"

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { gender, personality, preferredLocation, curriculum, teachingMethods } = await req.json()

    // Get data from Google Sheets instead of Excel
    const schools = await getSchoolsData()

    // Filter schools based on criteria
    let matchedSchools = schools.filter((school) => {
      const genderMatch = !gender || school.gender.toLowerCase().includes(gender.toLowerCase())
      const locationMatch = !preferredLocation || school.address.toLowerCase().includes(preferredLocation.toLowerCase())
      const curriculumMatch = !curriculum || school.curriculum.toLowerCase().includes(curriculum.toLowerCase())

      let methodsMatch = true
      if (teachingMethods && teachingMethods.length > 0) {
        methodsMatch = teachingMethods.some((method: string) =>
          school.teachingMethods.toLowerCase().includes(method.toLowerCase()),
        )
      }

      return genderMatch && locationMatch && curriculumMatch && methodsMatch
    })

    // If we have personality criteria, analyze with Grok AI
    if (personality && matchedSchools.length > 0) {
      const results = await Promise.all(
        matchedSchools.map(async (school) => {
          const analysis = await analyzePersonalityFit(
            personality,
            school.curriculum,
            school.features,
            school.teachingMethods,
            school.learningExperience,
          )

          return {
            ...school,
            personalityMatch: analysis.isMatch,
            matchPercentage: analysis.matchPercentage,
            matchExplanation: analysis.explanation,
          }
        }),
      )

      // Sort by match percentage
      matchedSchools = results.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
    }

    // Store results for the results endpoint
    setSearchResults(matchedSchools)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

