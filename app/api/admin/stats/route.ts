import { NextRequest, NextResponse } from "next/server";
import { personas } from "@/lib/personas";
import { requireAdmin } from "@/lib/admin-auth";

// Mock data - in production, this would come from a database
const mockStats = {
  totalEvaluations: 1247,
  totalUsers: 342,
  averageScore: 72.5,
  evaluationsToday: 23,
  evaluationsThisWeek: 156,
  topPersona: "Busy Professional",
  evaluationsByPersona: [
    { persona: "Busy Professional", count: 312 },
    { persona: "ADHD Achiever", count: 289 },
    { persona: "Budget-Conscious Shopper", count: 245 },
    { persona: "Fitness-Focused Millennial", count: 198 },
    { persona: "New Parent", count: 112 },
    { persona: "Early Tech Adopter", count: 91 },
  ],
  recentActivity: [
    {
      id: "1",
      type: "evaluation",
      timestamp: new Date().toISOString(),
      details: "New evaluation completed for Busy Professional",
    },
    {
      id: "2",
      type: "user",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      details: "New user registered",
    },
    {
      id: "3",
      type: "evaluation",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      details: "Evaluation completed for ADHD Achiever",
    },
    {
      id: "4",
      type: "evaluation",
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      details: "Reverse mode evaluation completed",
    },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const auth = requireAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      );
    }

    // In production, fetch real data from database
    // For now, return mock data
    return NextResponse.json(mockStats);
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats", message: error.message },
      { status: 500 }
    );
  }
}

