import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { signJwtToken } from "@/lib/auth";
import { ROLES, STATUS_CODES, MESSAGES } from "@/lib/constants";
import { signupSchema } from "@/zod/schemas/loginSchema";

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    // ✅ Validate body with Zod
    const parsed = signupSchema.safeParse(body);
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

    const { username, email, password } = validatedData;

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    const token = await signJwtToken({
      id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    const response = NextResponse.json({
      message: "Signup successful",
      user: {
        email: newUser.email,
        id: newUser._id,
        role: newUser.role,
        avatar: newUser.avatar,
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
    console.error("Error during signup:", err);
    return NextResponse.json(
      { message: MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
}
