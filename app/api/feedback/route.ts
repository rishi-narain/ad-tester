import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

interface Feedback {
  id: string;
  type: "thumbs" | "written";
  timestamp: string;
  page: "results" | "insights";
  data: {
    // For thumbs votes
    category?: string;
    item?: string;
    vote?: "up" | "down";
    // For written feedback
    feedback?: string;
    email?: string;
  };
  evaluationId?: string;
  personaId?: string;
}

// In-memory storage - in production, use a database
let feedbackStore: Feedback[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, page, data, evaluationId, personaId } = body;

    if (!type || !page || !data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const feedback: Feedback = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date().toISOString(),
      page,
      data,
      evaluationId,
      personaId,
    };

    feedbackStore.push(feedback);

    return NextResponse.json({ success: true, feedback }, { status: 201 });
  } catch (error: any) {
    console.error("Error storing feedback:", error);
    return NextResponse.json(
      { error: "Failed to store feedback", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = requireAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const type = searchParams.get("type");

    let filteredFeedback = feedbackStore;

    if (page) {
      filteredFeedback = filteredFeedback.filter((f) => f.page === page);
    }

    if (type) {
      filteredFeedback = filteredFeedback.filter((f) => f.type === type);
    }

    // Sort by timestamp, newest first
    filteredFeedback.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({ feedback: filteredFeedback });
  } catch (error: any) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback", message: error.message },
      { status: 500 }
    );
  }
}

