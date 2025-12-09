import { NextRequest } from "next/server";

/**
 * Admin authentication check
 * Validates admin token from header or cookie
 */
export function isAdmin(request: NextRequest): boolean {
  // Check for admin header or cookie
  const adminToken = request.headers.get("x-admin-token");
  const adminCookie = request.cookies.get("admin-token");

  // Check against environment variable
  const expectedToken = process.env.ADMIN_TOKEN;
  
  // If no ADMIN_TOKEN is set, deny access in production
  if (!expectedToken) {
    console.warn("ADMIN_TOKEN environment variable is not set");
    return false;
  }

  return (
    adminToken === expectedToken ||
    adminCookie?.value === expectedToken
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
