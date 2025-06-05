import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import Category from "@/models/Category";
import User from "@/models/User";
import { hasAccess, verifyJwtToken } from "@/lib/auth";
import { getTokenFromRequest } from "@/lib/getTokenFromRequest";
import { rolesAuth } from "@/lib/rolesAuth";
import { ROLES, STATUS_CODES, MESSAGES } from "@/lib/constants";
import { postSchema } from "@/zod/schemas/postSchema";

// Escape regex input to prevent ReDoS attacks
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// Helper function to estimate read time
function calculateReadTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export const GET = async (request) => {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "newest";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    let query = { status: "published" };

    // Filter by category
    if (category && category.toLowerCase() !== "all") {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.categories = categoryDoc._id;
      }
    }

    // Search query
    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { excerpt: { $regex: safeSearch, $options: "i" } },
        { tags: { $regex: safeSearch, $options: "i" } },
      ];
    }

    // Sorting options
    let sortOption = { publishedAt: -1 };
    if (sort === "oldest") sortOption = { publishedAt: 1 };
    if (sort === "popular") sortOption = { "meta.likes": -1 };

    // Fetch filtered & paginated posts
    const [articles, totalCount] = await Promise.all([
      Post.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate("authorId", "username avatar")
        .populate("categories", "name slug")
        .lean(),
      Post.countDocuments(query),
    ]);

    // Fetch category list with article counts
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "categories",
          as: "posts",
        },
      },
      {
        $project: {
          name: 1,
          slug: 1,
          count: {
            $size: {
              $filter: {
                input: "$posts",
                as: "post",
                cond: { $eq: ["$$post.status", "published"] },
              },
            },
          },
        },
      },
    ]);

    // Fetch all unique tags
    const allTags = await Post.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags" } },
      { $project: { name: "$_id", _id: 0 } },
    ]);

    return NextResponse.json(
      {
        articles,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        categories: [
          {
            name: "All",
            slug: "all",
            count: await Post.countDocuments({ status: "published" }),
          },
          ...categories,
        ],
        tags: allTags.map((t) => t.name),
      },
      { status: STATUS_CODES.OK }
    );
  } catch (error) {
    console.error("Error fetching articles:", error);
    return new NextResponse(
      JSON.stringify({ message: MESSAGES.SERVER_ERROR }),
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
};

// Post request
export async function POST(req) {
  try {
    await connectToDatabase();

    // Verify user token
    const [currentUser, error] = await rolesAuth(req, [ROLES.AUTHOR]);
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }
    const userId = currentUser._id;
    const body = await req.json();

    // ✅ Validate body with Zod
    const parsed = postSchema.safeParse(body);
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
      authorId: userId,
      status: ["draft", "published"].includes(validatedData.status)
        ? validatedData.status
        : "draft",
      featuredImage: validatedData.featuredImage || "",
      readTime,
      seo: {
        title: validatedData.title,
        description: validatedData.excerpt || "",
        keywords: validatedData.tags
      },
    });

    // Set publishedAt if status is published
    if (body.status === "published") {
      newPost.publishedAt = new Date();
    }

    await newPost.save();

    return NextResponse.json(
      newPost,
      { message: "Post created successfully!" },
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
