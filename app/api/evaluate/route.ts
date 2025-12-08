import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { getPersonaById, personas } from "@/lib/personas";
import { BASE_SYSTEM_PROMPT } from "@/lib/system-prompt";
import { getEvaluationPrompt } from "@/lib/prompts";

async function evaluatePersona(
  persona: any,
  content: string,
  contentType: "text" | "image"
) {
  const evaluationPrompt = getEvaluationPrompt(
    persona,
    content,
    contentType
  );

  const messages: any[] = [
    {
      role: "system",
      content: BASE_SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: [],
    },
  ];

  messages[1].content.push({
    type: "text",
    text: evaluationPrompt,
  });

  if (contentType === "image") {
    // Ensure the image URL is properly formatted
    // OpenAI accepts data URLs in the format: data:image/<type>;base64,<data>
    let imageUrl = content;
    
    // Validate that we have image data
    if (!imageUrl || imageUrl.length === 0) {
      throw new Error("No image data provided");
    }
    
    // Ensure proper data URL format
    if (!imageUrl.startsWith("data:image/")) {
      // If it's just base64, add the data URL prefix
      // Try to detect image type from the base64 string or default to jpeg
      imageUrl = `data:image/jpeg;base64,${imageUrl.replace(/^data:image\/[a-z]+;base64,/, "")}`;
    }
    
    // Log image info for debugging (without the actual base64 data)
    const imageSizeKB = Math.round(imageUrl.length / 1024);
    console.log(`Processing image: size=${imageSizeKB}KB, format=${imageUrl.substring(5, imageUrl.indexOf(";"))}`);
    
    // Check if image is too large (OpenAI has limits)
    if (imageUrl.length > 20 * 1024 * 1024) { // 20MB limit
      throw new Error("Image is too large. Please use an image smaller than 20MB.");
    }
    
    messages[1].content.push({
      type: "image_url",
      image_url: {
        url: imageUrl,
      },
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      console.error("OpenAI response structure:", JSON.stringify(completion, null, 2));
      throw new Error("No response content from OpenAI. The API call succeeded but returned no content.");
    }

    let evaluationResult;
    try {
      evaluationResult = JSON.parse(responseContent);
    } catch (parseError) {
      const jsonMatch = responseContent.match(/```json\n([\s\S]*?)\n```/) || 
                       responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluationResult = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        throw new Error("Failed to parse JSON response");
      }
    }

    if (
      typeof evaluationResult.resonanceScore !== "number" ||
      !Array.isArray(evaluationResult.strengths) ||
      !Array.isArray(evaluationResult.weaknesses) ||
      !Array.isArray(evaluationResult.suggestedFixes) ||
      typeof evaluationResult.quote !== "string"
    ) {
      throw new Error("Invalid response structure from OpenAI");
    }

    evaluationResult.resonanceScore = Math.max(
      0,
      Math.min(100, Math.round(evaluationResult.resonanceScore))
    );

    return {
      ...evaluationResult,
      persona: persona.title,
      personaId: persona.id,
    };
  } catch (apiError: any) {
    console.error("OpenAI API error:", {
      message: apiError.message,
      status: apiError.status,
      code: apiError.code,
      type: apiError.type,
    });
    
    // Provide more specific error messages
    if (apiError.status === 401) {
      throw new Error("Invalid OpenAI API key. Please check your API key configuration.");
    } else if (apiError.status === 429) {
      throw new Error("OpenAI API rate limit exceeded. Please try again later.");
    } else if (apiError.status === 400) {
      throw new Error(`Invalid request to OpenAI: ${apiError.message || "Bad request"}`);
    } else if (apiError.message?.includes("image")) {
      throw new Error(`Image processing error: ${apiError.message}`);
    } else {
      throw new Error(`OpenAI API error: ${apiError.message || "Unknown error"}`);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { persona: personaId, content, contentType, reverseMode } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Reverse mode: evaluate against all personas
    if (reverseMode) {
      const results = await Promise.all(
        personas.map((persona) => evaluatePersona(persona, content, contentType))
      );

      // Find the persona with the highest score
      const bestMatch = results.reduce((best, current) =>
        current.resonanceScore > best.resonanceScore ? current : best
      );

      return NextResponse.json({
        reverseMode: true,
        bestMatch,
        allResults: results,
        resonanceScore: bestMatch.resonanceScore,
        strengths: bestMatch.strengths,
        weaknesses: bestMatch.weaknesses,
        suggestedFixes: bestMatch.suggestedFixes,
        quote: bestMatch.quote,
        persona: bestMatch.persona,
        personaId: bestMatch.personaId,
      });
    }

    // Normal mode: evaluate against single persona
    if (!personaId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const persona = getPersonaById(personaId);
    if (!persona) {
      return NextResponse.json(
        { error: "Invalid persona" },
        { status: 400 }
      );
    }

    const result = await evaluatePersona(persona, content, contentType);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in evaluation API:", error);
    return NextResponse.json(
      {
        error: "Failed to evaluate ad",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

