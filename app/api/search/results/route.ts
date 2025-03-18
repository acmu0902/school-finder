import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getSearchResults } from "@/lib/search-store"

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ schools: getSearchResults() })
  } catch (error) {
    console.error("Error fetching results:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

