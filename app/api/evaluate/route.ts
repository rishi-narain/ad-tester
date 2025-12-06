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
    messages[1].content.push({
      type: "image_url",
      image_url: {
        url: content,
      },
    });
  }

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
    !Array.isArray(evaluationResult.suggestedFixes)
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

