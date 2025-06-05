import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import { ROLES, STATUS_CODES, MESSAGES } from "@/lib/constants";

export const GET = async (request, { params }) => {
  try {
    await connectToDatabase();

    const { tag } = await params;

    // Find all published posts that include this tag
    const articles = await Post.find({
      status: "published",
      tags: { $regex: new RegExp(`^${tag}$`, "i") }, // Case-insensitive exact match
    })
      .populate("authorId", "username avatar")
      .populate("categories", "name slug")
      .sort({ publishedAt: -1 })
      .lean();

    return NextResponse.json({
      tag,
      articles,
      count: articles.length,
    });
  } catch (error) {
    console.error("Error fetching tag articles:", error);
    return NextResponse.json(
      { message: MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
};
