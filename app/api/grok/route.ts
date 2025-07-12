import { NextResponse } from "next/server"

// Use environment variable for API key
const GROK_API_KEY = process.env.XAI_API_KEY
const GROK_MODEL = "grok-3" // Updated to use grok-3 model

export async function POST(request: Request) {
  try {
    const { prompt, temperature = 0.7 } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    if (!GROK_API_KEY) {
      console.error("XAI_API_KEY environment variable is not configured")
      return NextResponse.json(
        {
          error: "xAI API key is not configured. Please add the XAI_API_KEY environment variable.",
        },
        { status: 503 },
      )
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
        temperature: temperature,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Grok API error:", errorText)
      return NextResponse.json({ error: `xAI API request failed: ${errorText}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in Grok API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
