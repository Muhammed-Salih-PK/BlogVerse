import { NextResponse } from "next/server";

export async function POST(req) {
  // Clear the cookie by setting it to empty and expiring it
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("authToken", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
  });

  return response;
}
