import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const GROK_API_KEY = "xai-njlcLxwLbsMo91Vm49dK9BPtwj5ynAfoI397yzeJahFU9ZEraGIRdDHR0gxgm1mVfK89qb124GWhPKH3"

export async function analyzePersonalityFit(
  personality: string,
  curriculum: string,
  features: string,
  teachingMethods: string,
  learningExperience: string,
): Promise<{ isMatch: boolean; matchPercentage: number; explanation: string }> {
  try {
    const prompt = `
      Analyze if a child with the following personality: "${personality}" 
      would be a good fit for a school with these characteristics:
      
      Curriculum: ${curriculum}
      Features: ${features}
      Teaching Methods: ${teachingMethods}
      Learning Experience: ${learningExperience}
      
      Provide a match percentage (0-100) and a brief explanation of why this is or isn't a good match.
      Format your response as JSON with the following structure:
      {
        "isMatch": boolean,
        "matchPercentage": number,
        "explanation": string
      }
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    try {
      return JSON.parse(text)
    } catch (e) {
      console.error("Failed to parse AI response:", e)
      return {
        isMatch: false,
        matchPercentage: 0,
        explanation: "Failed to analyze personality fit.",
      }
    }
  } catch (error) {
    console.error("Error calling Grok AI:", error)
    return {
      isMatch: false,
      matchPercentage: 0,
      explanation: "Failed to analyze personality fit due to an error.",
    }
  }
}

