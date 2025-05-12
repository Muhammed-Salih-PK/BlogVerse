import { NextResponse } from 'next/server';
import { serialize } from 'cookie'; // Optional: only if you're handling cookies manually

export async function POST() {
  // Clear the cookie by setting it to empty and expiring it
  const response = NextResponse.json({ message: 'Logged out' });

  response.cookies.set({
    name: 'adminToken',
    value: '',
    path: '/',
    httpOnly: true,
    expires: new Date(0), // Expire it immediately
  });

  return response;
}
