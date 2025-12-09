import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getTotalEvaluations,
  getTotalUsers,
  getAverageScore,
  getEvaluationsToday,
  getEvaluationsThisWeek,
  getTopPersona,
  getEvaluationsByPersona,
  getRecentActivity,
} from "@/lib/analytics-store";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      );
    }

    // Fetch real data from analytics store (now async)
    const [
      totalEvaluations,
      totalUsers,
      averageScore,
      evaluationsToday,
      evaluationsThisWeek,
      topPersona,
      evaluationsByPersona,
      recentActivity,
    ] = await Promise.all([
      getTotalEvaluations(),
      getTotalUsers(),
      getAverageScore(),
      getEvaluationsToday(),
      getEvaluationsThisWeek(),
      getTopPersona(),
      getEvaluationsByPersona(),
      getRecentActivity(10),
    ]);

    const stats = {
      totalEvaluations,
      totalUsers,
      averageScore,
      evaluationsToday,
      evaluationsThisWeek,
      topPersona,
      evaluationsByPersona,
      recentActivity,
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats", message: error.message },
      { status: 500 }
    );
  }
}
