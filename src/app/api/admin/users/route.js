import { rolesAuth } from "@/lib/rolesAuth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { ROLES, STATUS_CODES, MESSAGES } from "@/lib/constants";

export async function GET(req) {
  try {
    await connectToDatabase();

    // Await and check admin authorization
    const [currentUser, error] = await rolesAuth(req, [ROLES.ADMIN]);
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }
    // Fetch users with only necessary fields
    const users = await User.find({})
      .select("_id username name email role isLocked") // Only select these fields
      .lean();

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        _id: user._id,
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
        isLocked: user.isLocked || false,
      })),
    });
  } catch (error) {
    console.error("Error in GET /api/admin/users:", error);
    return NextResponse.json(
      { success: false, message: error.message || MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
}
