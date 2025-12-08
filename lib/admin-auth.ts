import { NextRequest } from "next/server";

/**
 * Simple admin authentication check
 * In production, implement proper authentication (JWT, session, etc.)
 */
export function isAdmin(request: NextRequest): boolean {
  // Check for admin header or cookie
  // In production, verify JWT token or session
  const adminToken = request.headers.get("x-admin-token");
  const adminCookie = request.cookies.get("admin-token");

  // For development, allow access if ADMIN_TOKEN env var is set
  // In production, implement proper authentication
  if (process.env.NODE_ENV === "development") {
    return true; // Allow in development
  }

  // Check against environment variable or session
  const expectedToken = process.env.ADMIN_TOKEN;
  return (
    adminToken === expectedToken ||
    adminCookie?.value === expectedToken ||
    false
  );
}

export function requireAdmin(request: NextRequest): { authorized: boolean; error?: string } {
  if (!isAdmin(request)) {
    return {
      authorized: false,
      error: "Unauthorized: Admin access required",
    };
  }
  return { authorized: true };
}

