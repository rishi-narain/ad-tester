import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

// Mock settings - in production, this would come from a database
let settings = {
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  maxFileSize: 4,
  allowedFileTypes: ["jpg", "png", "gif", "webp"],
  enableAnalytics: true,
  maintenanceMode: false,
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

    // Return settings without exposing the actual API key
    return NextResponse.json({
      ...settings,
      openaiApiKey: settings.openaiApiKey
        ? `${settings.openaiApiKey.substring(0, 7)}...`
        : "",
    });
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings", message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = requireAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      openaiApiKey,
      maxFileSize,
      allowedFileTypes,
      enableAnalytics,
      maintenanceMode,
    } = body;

    // Update settings
    if (openaiApiKey !== undefined) {
      // Only update if a new key is provided (not masked)
      if (openaiApiKey && !openaiApiKey.includes("...")) {
        settings.openaiApiKey = openaiApiKey;
        // In production, securely store this (e.g., encrypted in database)
      }
    }
    if (maxFileSize !== undefined) settings.maxFileSize = maxFileSize;
    if (allowedFileTypes !== undefined)
      settings.allowedFileTypes = allowedFileTypes;
    if (enableAnalytics !== undefined)
      settings.enableAnalytics = enableAnalytics;
    if (maintenanceMode !== undefined)
      settings.maintenanceMode = maintenanceMode;

    // In production, save to database
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings", message: error.message },
      { status: 500 }
    );
  }
}

