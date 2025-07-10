import { NextResponse } from "next/server"

// Grok AI API configuration
const GROK_API_KEY = "xai-njlcLxwLbsMo91Vm49dK9BPtwj5ynAfoI397yzeJahFU9ZEraGIRdDHR0gxgm1mVfK89qb124GWhPKH3"
const GROK_MODEL = "grok-3-beta"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.6,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Grok API error:", errorText)
      return NextResponse.json(
        { error: `API request failed with status ${response.status}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in Grok API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
