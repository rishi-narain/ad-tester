import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";

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

    const feedback = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date().toISOString(),
      page,
      category: data.category || null,
      item: data.item || null,
      vote: data.vote || null,
      feedback_text: data.feedback || null,
      email: data.email || null,
      evaluation_id: evaluationId || null,
      persona_id: personaId || null,
    };

    const { error } = await supabase.from("feedback").insert(feedback);

    if (error) {
      console.error("Error storing feedback:", error);
      return NextResponse.json(
        { error: "Failed to store feedback", message: error.message },
        { status: 500 }
      );
    }

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

    let query = supabase.from("feedback").select("*");

    if (page) {
      query = query.eq("page", page);
    }

    if (type) {
      query = query.eq("type", type);
    }

    const { data, error } = await query.order("timestamp", { ascending: false });

    if (error) {
      console.error("Error fetching feedback:", error);
      return NextResponse.json(
        { error: "Failed to fetch feedback", message: error.message },
        { status: 500 }
      );
    }

    // Transform data back to original format for frontend compatibility
    const feedback = (data || []).map((f) => ({
      id: f.id,
      type: f.type,
      timestamp: f.timestamp,
      page: f.page,
      data: {
        category: f.category,
        item: f.item,
        vote: f.vote,
        feedback: f.feedback_text,
        email: f.email,
      },
      evaluationId: f.evaluation_id,
      personaId: f.persona_id,
    }));

    return NextResponse.json({ feedback });
  } catch (error: any) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback", message: error.message },
      { status: 500 }
    );
  }
}
