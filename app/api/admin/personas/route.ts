import { NextRequest, NextResponse } from "next/server";
import { Persona } from "@/lib/personas";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getPersonas,
  addPersona,
  getPersonaById,
} from "@/lib/personas-store";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      );
    }

    return NextResponse.json({ personas: getPersonas() });
  } catch (error: any) {
    console.error("Error fetching personas:", error);
    return NextResponse.json(
      { error: "Failed to fetch personas", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, description, systemPrompt } = body;

    if (!id || !title || !description || !systemPrompt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if persona with this ID already exists
    if (getPersonaById(id)) {
      return NextResponse.json(
        { error: "Persona with this ID already exists" },
        { status: 400 }
      );
    }

    const newPersona: Persona = {
      id,
      title,
      description,
      systemPrompt,
    };

    addPersona(newPersona);

    // In production, save to database
    return NextResponse.json({ persona: newPersona }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating persona:", error);
    return NextResponse.json(
      { error: "Failed to create persona", message: error.message },
      { status: 500 }
    );
  }
}

