import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { getPersonaById } from "@/lib/personas";

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

    // Build the evaluation prompt
    const personaContext = `
Persona: ${persona.name}
Description: ${persona.description}

Motivations:
${persona.motivations.map((m) => `- ${m}`).join("\n")}

Pain Points:
${persona.painPoints.map((p) => `- ${p}`).join("\n")}

Emotional Triggers:
${persona.emotionalTriggers.map((t) => `- ${t}`).join("\n")}

Buying Behavior:
${persona.buyingBehavior}
`;

    const evaluationPrompt = `You are an expert marketing analyst specializing in ad resonance evaluation. Your task is to evaluate how well an ad will resonate with a specific target persona.

${personaContext}

Evaluate the following ad and provide a detailed analysis. Consider:
1. How well the ad addresses the persona's motivations and pain points
2. Whether it triggers the right emotional responses
3. Alignment with their buying behavior
4. Overall resonance and likelihood of engagement

Ad Content:
${contentType === "image" ? "[Image provided]" : content}

Provide your evaluation in the following JSON format:
{
  "resonanceScore": <number between 0-100>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "suggestedFixes": ["fix 1", "fix 2", "fix 3"]
}

Be specific and actionable. Focus on what would make this persona respond positively or negatively to this ad.`;

    // Prepare messages for OpenAI
    const messages: any[] = [
      {
        role: "system",
        content:
          "You are an expert marketing analyst. Always respond with valid JSON only, no additional text.",
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
      persona: persona.name,
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

