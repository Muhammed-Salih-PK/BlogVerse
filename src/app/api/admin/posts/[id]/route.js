import { rolesAuth } from "@/lib/rolesAuth";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { ROLES, STATUS_CODES, MESSAGES } from "@/lib/constants";
import { adminPostSchema } from "@/zod/schemas/postSchema";

function calculateReadTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// === GET ===
export const GET = async (req, { params }) => {
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
    const article = await Post.findById(id)
      .populate("authorId", "username avatar")
      .populate("categories", "name slug")
      .lean();

    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { message: MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
};

// === PUT ===
export const PUT = async (req, { params }) => {
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

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: STATUS_CODES.NOT_FOUND }
      );
    }

    const body = await req.json();

    // ✅ Validate body with Zod
    const parsed = adminPostSchema.safeParse(body);
    if (!parsed.success) {
      const validationErrors = parsed.error.errors.map(
        (err) => `${err.path[0]}: ${err.message}`
      );
      return NextResponse.json(
        { message: "Validation Error", errors: validationErrors },
        { status: 400 }
      );
    }
    const validatedData = parsed.data;

    const { title, excerpt, content, categories, tags, status, featuredImage } =
      validatedData;
    const readTime = calculateReadTime(content);

    post.title = title;
    post.excerpt = excerpt;
    post.content = content;
    post.categories = categories || [];
    post.tags = tags;
    post.status = ["draft", "published"].includes(status) ? status : "draft";
    post.featuredImage = featuredImage || "";
    post.readTime = readTime;

    await post.save();

    return NextResponse.json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { message: MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
};

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

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: STATUS_CODES.NOT_FOUND }
      );
    }

    await Post.findByIdAndDelete(id);

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { message: MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
}
