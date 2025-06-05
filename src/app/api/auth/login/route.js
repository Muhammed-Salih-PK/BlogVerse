import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { signJwtToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { ROLES, STATUS_CODES, MESSAGES } from "@/lib/constants";
import { loginSchema } from "@/zod/schemas/loginSchema";

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // ✅ Validate body with Zod
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const validationErrors = parsed.error.errors.map(
        (err) => `${err.path[0]}: ${err.message}`
      );
      return NextResponse.json(
        { message: "Validation Error", errors: validationErrors },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }
    const validatedData = parsed.data;
    const { email, password } = validatedData;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: STATUS_CODES.UNAUTHORIZED }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: STATUS_CODES.UNAUTHORIZED }
      );
    }

    if (user.isLocked) {
      return NextResponse.json(
        { message: "Account is locked" },
        { status: STATUS_CODES.FORBIDDEN }
      );
    }

    user.loginAttempts = 0;
    user.lastLogin = new Date();
    await user.save();

    const token = await signJwtToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        email: user.email,
        id: user._id,
        role: user.role,
        avatar: user.avatar,
      },
    });

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("Error during login process:", err);
    return NextResponse.json(
      { message: MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
}
