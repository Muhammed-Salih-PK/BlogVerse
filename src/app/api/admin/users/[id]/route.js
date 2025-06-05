import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import mongoose from "mongoose";
import { rolesAuth } from "@/lib/rolesAuth";
import { ROLES, STATUS_CODES, MESSAGES } from "@/lib/constants";
import { profileSchema } from "@/zod/schemas/profileSchema";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    // Await and check admin authorization
    const [currentUser, error] = await rolesAuth(req, [ROLES.ADMIN]);
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid article ID" },
        { status: STATUS_CODES.SERVER_ERROR }
      );
    }

    const user = await User.findById(id).lean();

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: STATUS_CODES.NOT_FOUND }
      );
    }

    // Fetch both published and drafted posts
    const [publishedPosts, draftedPosts] = await Promise.all([
      Post.find({ authorId: id, status: "published" })
        .sort({ publishedAt: -1 })
        .lean(),
      Post.find({ authorId: id, status: "draft" })
        .sort({ updatedAt: -1 })
        .lean(),
    ]);

    // Calculate profile completion percentage
    const requiredFields = ["username", "email", "bio", "avatar"];
    const socialFields = ["twitter", "github", "website"];

    const completedFields = requiredFields.filter(
      (field) => user[field]
    ).length;
    const completedSocialFields = socialFields.filter(
      (field) => user.socialLinks?.[field]
    ).length;

    const totalFields = requiredFields.length + socialFields.length;
    const completedTotal = completedFields + completedSocialFields;
    const completionPercentage = Math.round(
      (completedTotal / totalFields) * 100
    );

    return NextResponse.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        socialLinks: user.socialLinks,
        profileComplete: completionPercentage === 100,
      },
      posts: {
        published: publishedPosts.map((post) => ({
          id: post._id,
          title: post.title,
          publishedAt: post.publishedAt,
          excerpt: post.excerpt,
          meta: post.meta,
          status: post.status,
        })),
        drafts: draftedPosts.map((post) => ({
          id: post._id,
          title: post.title,
          updatedAt: post.updatedAt,
          excerpt: post.excerpt,
          status: post.status,
        })),
      },
      completionPercentage,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { message: MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    // Await and check admin authorization
    const [currentUser, error] = await rolesAuth(req, [ROLES.ADMIN]);
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: STATUS_CODES.NOT_FOUND }
      );
    }

    const body = await req.json();

    // ✅ Validate body with Zod
    const parsed = profileSchema.safeParse(body);
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

    const { username, email, bio, avatar, socialLinks } = validatedData;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, bio, avatar, socialLinks },
      { new: true } // returns updated document
    ).lean(); // optional: if you want a plain JS object

    return NextResponse.json({
      message: "User details updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        socialLinks: updatedUser.socialLinks,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
}

// === DELETE ===
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid article ID" },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }
    // Await and check admin authorization
    const [currentUser, error] = await rolesAuth(req, [ROLES.ADMIN]);
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: STATUS_CODES.NOT_FOUND }
      );
    }
    await Post.deleteMany({ authorId: id });
    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting User:", error);
    return NextResponse.json(
      { message: MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
}
