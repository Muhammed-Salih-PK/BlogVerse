import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import { rolesAuth } from "@/lib/rolesAuth";

import { ROLES, STATUS_CODES, MESSAGES } from "@/lib/constants";
import { profileSchema } from "@/zod/schemas/profileSchema";

export async function GET(req) {
  try {
    await connectToDatabase();
    const [currentUser, error] = await rolesAuth(req, [ROLES.AUTHOR]);
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    const userId = currentUser._id;

    // Fetch both published and drafted posts
    const [publishedPosts, draftedPosts] = await Promise.all([
      Post.find({ authorId: userId, status: "published" })
        .sort({ publishedAt: -1 })
        .lean(),
      Post.find({ authorId: userId, status: "draft" })
        .sort({ updatedAt: -1 })
        .lean(),
    ]);

    // Calculate profile completion percentage
    const requiredFields = ["username", "email", "bio", "avatar"];
    const socialFields = ["twitter", "github", "website"];

    const completedFields = requiredFields.filter(
      (field) => currentUser[field]
    ).length;
    const completedSocialFields = socialFields.filter(
      (field) => currentUser.socialLinks?.[field]
    ).length;

    const totalFields = requiredFields.length + socialFields.length;
    const completedTotal = completedFields + completedSocialFields;
    const completionPercentage = Math.round(
      (completedTotal / totalFields) * 100
    );

    return NextResponse.json({
      user: {
        id: currentUser._id,
        username: currentUser.username,
        email: currentUser.email,
        bio: currentUser.bio,
        avatar: currentUser.avatar,
        socialLinks: currentUser.socialLinks,
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

export async function PUT(req) {
  try {
    await connectToDatabase();
    const [currentUser, error] = await rolesAuth(req, [ROLES.AUTHOR]);
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }
    const userId = currentUser._id;

    const body = await req.json();
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
    if (!username || !email) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
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
