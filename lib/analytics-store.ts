import { supabase } from "./supabase";

interface Evaluation {
  id: string;
  timestamp: string;
  persona_id: string;
  persona_name: string;
  resonance_score: number;
  content_type: "image" | "text";
  reverse_mode: boolean;
  user_id?: string;
}

interface User {
  id: string;
  first_seen: string;
  last_active: string;
  total_evaluations: number;
}

export async function trackEvaluation(
  personaId: string,
  personaName: string,
  resonanceScore: number,
  contentType: "image" | "text",
  reverseMode: boolean,
  userId?: string
): Promise<string> {
  const id = `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();

  // Insert evaluation
  const { error: evalError } = await supabase.from("evaluations").insert({
    id,
    timestamp,
    persona_id: personaId,
    persona_name: personaName,
    resonance_score: resonanceScore,
    content_type: contentType,
    reverse_mode: reverseMode,
    user_id: userId,
  });

  if (evalError) {
    console.error("Error inserting evaluation:", evalError);
  }

  // Track user if userId provided
  if (userId) {
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (existingUser) {
      await supabase
        .from("users")
        .update({
          last_active: timestamp,
          total_evaluations: existingUser.total_evaluations + 1,
        })
        .eq("id", userId);
    } else {
      await supabase.from("users").insert({
        id: userId,
        first_seen: timestamp,
        last_active: timestamp,
        total_evaluations: 1,
      });
    }
  }

  return id;
}

export async function getTotalEvaluations(): Promise<number> {
  const { count, error } = await supabase
    .from("evaluations")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error getting total evaluations:", error);
    return 0;
  }
  return count || 0;
}

export async function getTotalUsers(): Promise<number> {
  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error getting total users:", error);
    return 0;
  }
  return count || 0;
}

export async function getAverageScore(): Promise<number> {
  const { data, error } = await supabase
    .from("evaluations")
    .select("resonance_score");

  if (error || !data || data.length === 0) {
    return 0;
  }

  const sum = data.reduce((acc, evaluation) => acc + evaluation.resonance_score, 0);
  return sum / data.length;
}

export async function getEvaluationsToday(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("evaluations")
    .select("*", { count: "exact", head: true })
    .gte("timestamp", today.toISOString());

  if (error) {
    console.error("Error getting evaluations today:", error);
    return 0;
  }
  return count || 0;
}

export async function getEvaluationsThisWeek(): Promise<number> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { count, error } = await supabase
    .from("evaluations")
    .select("*", { count: "exact", head: true })
    .gte("timestamp", weekAgo.toISOString());

  if (error) {
    console.error("Error getting evaluations this week:", error);
    return 0;
  }
  return count || 0;
}

export async function getTopPersona(): Promise<string> {
  const { data, error } = await supabase
    .from("evaluations")
    .select("persona_name");

  if (error || !data || data.length === 0) {
    return "N/A";
  }

  const personaCounts = new Map<string, number>();
  data.forEach((evaluation) => {
    const count = personaCounts.get(evaluation.persona_name) || 0;
    personaCounts.set(evaluation.persona_name, count + 1);
  });

  let topPersona = "";
  let maxCount = 0;
  personaCounts.forEach((count, persona) => {
    if (count > maxCount) {
      maxCount = count;
      topPersona = persona;
    }
  });

  return topPersona || "N/A";
}

export async function getEvaluationsByPersona(): Promise<{ persona: string; count: number }[]> {
  const { data, error } = await supabase
    .from("evaluations")
    .select("persona_name");

  if (error || !data) {
    return [];
  }

  const personaCounts = new Map<string, number>();
  data.forEach((evaluation) => {
    const count = personaCounts.get(evaluation.persona_name) || 0;
    personaCounts.set(evaluation.persona_name, count + 1);
  });

  return Array.from(personaCounts.entries())
    .map(([persona, count]) => ({ persona, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getRecentActivity(limit: number = 10): Promise<{
  id: string;
  type: string;
  timestamp: string;
  details: string;
}[]> {
  const { data, error } = await supabase
    .from("evaluations")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data.map((evaluation) => ({
    id: evaluation.id,
    type: "evaluation",
    timestamp: evaluation.timestamp,
    details: evaluation.reverse_mode
      ? `Reverse mode evaluation completed - Best match: ${evaluation.persona_name}`
      : `Evaluation completed for ${evaluation.persona_name}`,
  }));
}

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("users").select("*");

  if (error || !data) {
    return [];
  }

  return data;
}

export async function getEvaluations(): Promise<Evaluation[]> {
  const { data, error } = await supabase.from("evaluations").select("*");

  if (error || !data) {
    return [];
  }

  return data;
}
