import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import { ROLES, STATUS_CODES, MESSAGES } from "@/lib/constants";

export const GET = async (request, { params }) => {
  try {
    await connectToDatabase();

    const { slug } = await params;

    // First find the category by slug
    const category = await Category.findOne({ slug }).lean();

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: STATUS_CODES.NOT_FOUND }
      );
    }

    // Find all published posts in this category
    const articles = await Post.find({
      status: "published",
      categories: category._id,
    })
      .populate("authorId", "username avatar")
      .populate("categories", "name slug")
      .sort({ publishedAt: -1 })
      .lean();

    return NextResponse.json({
      category,
      articles,
      count: articles.length,
    });
  } catch (error) {
    console.error("Error fetching category articles:", error);
    return NextResponse.json(
      { message: MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
};
