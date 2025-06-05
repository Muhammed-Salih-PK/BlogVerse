import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { hasAccess, verifyJwtToken } from "@/lib/auth";
import { getTokenFromRequest } from "@/lib/getTokenFromRequest";
import { ROLES, STATUS_CODES, MESSAGES } from "@/lib/constants";

export const PATCH = async (req, { params }) => {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid Post ID" },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }
    // Verify user token
    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json(
        { message: MESSAGES.UNAUTHORIZED },
        { status: STATUS_CODES.UNAUTHORIZED }
      );
    }

    const decoded = await verifyJwtToken(token);

    if (!hasAccess(decoded, [ROLES.AUTHOR])) {
      return NextResponse.json(
        { message: MESSAGES.FORBIDDEN },
        { status:STATUS_CODES.FORBIDDEN }
      );
    }

    const userId = decoded?.id;
    if (!userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: STATUS_CODES.FORBIDDEN });
    }

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: STATUS_CODES.NOT_FOUND }
      );
    }

    const liked = post.meta.likes.includes(userId);

    if (liked) {
      // Unlike
      post.meta.likes.pull(userId);
    } else {
      // Like
      post.meta.likes.push(userId);
    }

    await post.save();

    return NextResponse.json({
      message: liked ? "Post unliked" : "Post liked",
      likesCount: post.meta.likes.length,
      liked: !liked,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { message: MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
};
