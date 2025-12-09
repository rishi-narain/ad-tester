import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllUsers, getEvaluations } from "@/lib/analytics-store";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      );
    }

    // Get users from analytics store (now async)
    const [users, evaluations] = await Promise.all([
      getAllUsers(),
      getEvaluations(),
    ]);

    // Map users to the expected format
    const usersWithStats = users.map((user) => {
      return {
        id: user.id,
        email: user.id.includes("@") ? user.id : `${user.id}@anonymous.local`,
        name: user.id.includes("@") ? user.id.split("@")[0] : "Anonymous User",
        createdAt: user.first_seen,
        totalEvaluations: user.total_evaluations,
        lastActive: user.last_active,
        status: new Date(user.last_active) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
          ? "active" as const 
          : "inactive" as const,
      };
    });

    return NextResponse.json({ users: usersWithStats });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", message: error.message },
      { status: 500 }
    );
  }
}
