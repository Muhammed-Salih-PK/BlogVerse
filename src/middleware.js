import { NextResponse } from "next/server";
import { verifyJwtToken } from '@/lib/auth';


export async function middleware(req) {
  const url = req.nextUrl;
  const token = req.cookies.get("adminToken")?.value;

  try {
    if (!token && url.pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    if (token) {
      await verifyJwtToken(token); // use jose instead of jsonwebtoken
    }

    if (url.pathname === "/admin/login" && token) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] JWT failed at ${url.pathname}:`, error.message);
    if (url.pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin","/admin/:path*"],
};
