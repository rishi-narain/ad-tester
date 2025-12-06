import { Persona, getPersonaSystemMessage } from "./personas";

/**
 * Generate the evaluation prompt for a given ad content
 */
export function getEvaluationPrompt(
  persona: Persona,
  content: string,
  contentType: "text" | "image"
): string {
  const personaContext = getPersonaSystemMessage(persona);

  return `You are an expert marketing analyst specializing in ad resonance evaluation. Your task is to evaluate how well an ad will resonate with a specific target persona.

${personaContext}

Evaluate the following ad and provide a detailed analysis based on the persona's characteristics and perspective. Consider:
1. How well the ad resonates with the persona's key characteristics
2. Whether it triggers the right emotional responses
3. Alignment with their behavior and motivations
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
}

