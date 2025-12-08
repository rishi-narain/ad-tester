import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

// Mock user data - in production, this would come from a database
const mockUsers = [
  {
    id: "1",
    email: "user1@example.com",
    name: "John Doe",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    totalEvaluations: 45,
    lastActive: new Date().toISOString(),
    status: "active" as const,
  },
  {
    id: "2",
    email: "user2@example.com",
    name: "Jane Smith",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    totalEvaluations: 23,
    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active" as const,
  },
  {
    id: "3",
    email: "user3@example.com",
    name: "Bob Johnson",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    totalEvaluations: 12,
    lastActive: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "inactive" as const,
  },
  {
    id: "4",
    email: "user4@example.com",
    name: "Alice Williams",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalEvaluations: 8,
    lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active" as const,
  },
];

export async function GET(request: NextRequest) {
  try {
    const auth = requireAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      );
    }

    // In production, fetch real users from database
    return NextResponse.json({ users: mockUsers });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", message: error.message },
      { status: 500 }
    );
  }
}

