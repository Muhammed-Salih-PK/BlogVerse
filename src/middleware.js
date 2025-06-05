import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/auth";
import { getTokenFromRequest } from "./lib/getTokenFromRequest";
import { ROLES, STATUS_CODES } from "./lib/constants";

export async function middleware(req) {
  const url = req.nextUrl;
  const path = url.pathname;
  const token = getTokenFromRequest(req);
  const res = NextResponse.next();

  try {
    // Block direct browser access to API routes
    if (path.startsWith("/api") && isBrowserRequest(req)) {
      return apiAccessForbiddenResponse();
    }

    // Handle unauthenticated users first
    if (!token) {
      return handleUnauthenticatedAccess(path, req);
    }

    // Verify token and get user role
    const decoded = await verifyJwtToken(token);
    if (!decoded) throw new Error("Invalid token");
    const { role } = decoded;

    // Handle authenticated user access
    return handleAuthenticatedAccess(path, role, req, res);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] JWT verification failed at ${path}:`,
      error
    );
    return handleAuthError(path, req, res);
  }
}

// Helper functions
function isBrowserRequest(req) {
  const acceptHeader = req.headers.get("accept") || "";
  return acceptHeader.includes("text/html");
}

function apiAccessForbiddenResponse() {
  return NextResponse.json(
    { message: "Unauthorized direct API access is forbidden." },
    { status: STATUS_CODES.FORBIDDEN }
  );
}

function handleUnauthenticatedAccess(path, req) {
  if (
    path.startsWith("/admin") ||
    (path.startsWith("/profile") && path !== "/login")
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

function handleAuthenticatedAccess(path, role, req, res) {
  // Prevent logged-in users from accessing login page
  if (path === "/login") {
    return redirectLoggedInUser(role, req);
  }

  // Admin route protection
  if (path.startsWith("/admin")) {
    if (role !== ROLES.ADMIN) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (path === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return res;
  }

  // Profile route protection
  if (path.startsWith("/profile")) {
    if (role !== ROLES.AUTHOR) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return res;
  }

  return res;
}

function redirectLoggedInUser(role, req) {
  if (role === ROLES.ADMIN) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }
  if (role === ROLES.AUTHOR) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }
  return NextResponse.next();
}

function handleAuthError(path, req, res) {
  if (
    path.startsWith("/admin") ||
    (path.startsWith("/profile") && path !== "/login")
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return res;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    "/profile",
    "/profile/:path*",
    "/api/:path*",
    "/login",
  ],
};
