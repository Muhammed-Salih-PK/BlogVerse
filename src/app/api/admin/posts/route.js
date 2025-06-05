import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";

import { rolesAuth } from "@/lib/rolesAuth";
import { ROLES, MESSAGES, STATUS_CODES } from "@/lib/constants";
import { adminPostSchema } from "@/zod/schemas/postSchema";

function calculateReadTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

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
    // Fetch all posts and populate author info
    const allPosts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate("authorId", "username email role") // Only select necessary fields
      .lean();

    // Group posts by status
    const published = [];
    const drafts = [];

    allPosts.forEach((post) => {
      const formattedPost = {
        id: post._id,
        title: post.title,
        excerpt: post.excerpt,
        meta: post.meta,
        status: post.status,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,
        author: {
          id: post.authorId?._id,
          name: post.authorId?.username,
          email: post.authorId?.email,
          role: post.authorId?.role,
        },
      };
      if (post.status === "published") {
        published.push(formattedPost);
      } else if (post.status === "draft") {
        drafts.push(formattedPost);
      }
    });

    return NextResponse.json({
      posts: {
        published,
        drafts,
      },
    });
  } catch (error) {
    console.error("Error fetching posts for admin:", error);
    return NextResponse.json(
      { message: MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
}

// Post request
export async function POST(req) {
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

    const body = await req.json();

    // ✅ Validate body with Zod
    const parsed = adminPostSchema.safeParse(body);
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
    // Automatically calculate read time
    const readTime = calculateReadTime(body.content);
    // Create new post
    const newPost = new Post({
      title: validatedData.title,
      excerpt: validatedData.excerpt || "",
      content: validatedData.content,
      categories: validatedData.categories || [],
      tags: validatedData.tags,

      authorId: validatedData.authorId,
      status: ["draft", "published"].includes(validatedData.status)
        ? validatedData.status
        : "draft",
      featuredImage: validatedData.featuredImage || "",
      readTime,
      seo: {
        title: validatedData.title,
        description: validatedData.excerpt || "",
        keywords: validatedData.tags,
      },
    });

    // Set publishedAt if status is published
    if (validatedData.status === "published") {
      newPost.publishedAt = new Date();
    }

    await newPost.save();

    return NextResponse.json(
      { message: "Successfully created Post", data: newPost },
      { status: STATUS_CODES.CREATED }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
}
