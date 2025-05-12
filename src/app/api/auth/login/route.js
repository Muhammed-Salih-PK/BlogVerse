import { connectToDatabase } from "@/lib/db";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import { signJwtToken } from "@/lib/auth";
import bcrypt from "bcryptjs";


export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await signJwtToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    });

    // ✅ Create response and set cookie
    const response = NextResponse.json({
      message: "Login successful",
      admin: { email: admin.email, id: admin._id, role: admin.role },
    });

    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error("Error during login process:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
