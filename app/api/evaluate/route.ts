import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { getPersonaById } from "@/lib/personas";
import { BASE_SYSTEM_PROMPT } from "@/lib/system-prompt";
import { getEvaluationPrompt } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { persona: personaId, content, contentType } = body;

    if (!personaId || !content) {
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

    // Build the evaluation prompt using the prompts module
    const evaluationPrompt = getEvaluationPrompt(
      persona,
      content,
      contentType as "text" | "image"
    );

    // Prepare messages for OpenAI
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

    // Add text content
    messages[1].content.push({
      type: "text",
      text: evaluationPrompt,
    });

    // Add image if provided
    if (contentType === "image") {
      messages[1].content.push({
        type: "image_url",
        image_url: {
          url: content,
        },
      });
    }

    // Call OpenAI GPT-4o
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    let evaluationResult;
    try {
      evaluationResult = JSON.parse(responseContent);
    } catch (parseError) {
      // Try to extract JSON from the response if it's wrapped in markdown
      const jsonMatch = responseContent.match(/```json\n([\s\S]*?)\n```/) || 
                       responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluationResult = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        throw new Error("Failed to parse JSON response");
      }
    }

    // Validate the response structure
    if (
      typeof evaluationResult.resonanceScore !== "number" ||
      !Array.isArray(evaluationResult.strengths) ||
      !Array.isArray(evaluationResult.weaknesses) ||
      !Array.isArray(evaluationResult.suggestedFixes)
    ) {
      throw new Error("Invalid response structure from OpenAI");
    }

    // Ensure score is between 0-100
    evaluationResult.resonanceScore = Math.max(
      0,
      Math.min(100, Math.round(evaluationResult.resonanceScore))
    );

    return NextResponse.json({
      ...evaluationResult,
      persona: persona.title,
      personaId: persona.id,
    });
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

