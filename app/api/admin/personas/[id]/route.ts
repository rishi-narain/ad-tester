import { NextRequest, NextResponse } from "next/server";
import { Persona } from "@/lib/personas";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getPersonaById,
  updatePersona,
  deletePersona,
} from "@/lib/personas-store";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = requireAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { title, description, systemPrompt } = body;

    if (!title || !description || !systemPrompt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const success = updatePersona(id, { title, description, systemPrompt });
    if (!success) {
      return NextResponse.json(
        { error: "Persona not found" },
        { status: 404 }
      );
    }

    const updatedPersona = getPersonaById(id);
    // In production, update in database
    return NextResponse.json({ persona: updatedPersona });
  } catch (error: any) {
    console.error("Error updating persona:", error);
    return NextResponse.json(
      { error: "Failed to update persona", message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = requireAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      );
    }

    const { id } = params;

    const success = deletePersona(id);
    if (!success) {
      return NextResponse.json(
        { error: "Persona not found" },
        { status: 404 }
      );
    }

    // In production, delete from database
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting persona:", error);
    return NextResponse.json(
      { error: "Failed to delete persona", message: error.message },
      { status: 500 }
    );
  }
}

