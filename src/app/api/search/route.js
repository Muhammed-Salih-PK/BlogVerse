import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Post from "@/models/Post";
import Category from "@/models/Category"; // Import Category model
import { connectToDatabase } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  
  // Get all search parameters
  const q = searchParams.get("q") || "";
  const sortBy = searchParams.get("sortBy") || "relevance";
  const timeRange = searchParams.get("timeRange") || "all";
  const tags = searchParams.get("tags") || "";
  const contentType = searchParams.get("contentType") || "all";
  const featuredOnly = searchParams.get("featuredOnly") === "true";
  const minReadTime = parseInt(searchParams.get("minReadTime")) || 0;
  const maxReadTime = parseInt(searchParams.get("maxReadTime")) || 60;

  try {
    await connectToDatabase();

    // Build query
    const query = {};
    
    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { excerpt: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
        { "tags.name": { $regex: q, $options: "i" } },
      ];
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(",").filter(tag => tag.trim());
      if (tagArray.length > 0) {
        query.tags = { $in: tagArray };
      }
    }

    // Content type filter
    if (contentType && contentType !== "all") {
      query.contentType = contentType;
    }

    // Featured only filter
    if (featuredOnly) {
      query.featured = true;
    }

    // Read time filter
    if (minReadTime > 0 || maxReadTime < 60) {
      query.readTime = {};
      if (minReadTime > 0) query.readTime.$gte = minReadTime;
      if (maxReadTime < 60) query.readTime.$lte = maxReadTime;
    }

    // Time range filter
    if (timeRange && timeRange !== "all") {
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        query.publishedAt = { $gte: startDate };
      }
    }

    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case "newest":
        sortOptions = { publishedAt: -1 };
        break;
      case "popular":
        sortOptions = { views: -1 };
        break;
      case "trending":
        // You might want to calculate trending score differently
        sortOptions = { views: -1, likes: -1 };
        break;
      case "likes":
        sortOptions = { "meta.likes": -1 };
        break;
      case "readTime":
        sortOptions = { readTime: 1 };
        break;
      default: // relevance
        // For relevance, we could use text score if we had a text index
        sortOptions = { publishedAt: -1 };
    }

    // Execute query
    const results = await Post.find(query)
      .select("title slug excerpt featuredImage publishedAt readTime views tags categories authorId featured meta")
      .populate({
        path: "categories",
        model: Category, // Explicitly specify the model
        select: "name slug"
      })
      .populate({
        path: "authorId",
        select: "username avatar"
      })
      .sort(sortOptions)
      .limit(20);

    // Calculate stats
    const total = results.length;
    const categories = [...new Set(results.flatMap(post => 
      post.categories?.map(cat => cat?.name) || []
    ).filter(Boolean))];
    const authors = [...new Set(results.map(post => 
      post.authorId?.username
    ).filter(Boolean))];
    const avgReadTime = results.length > 0 
      ? results.reduce((sum, post) => sum + (post.readTime || 5), 0) / results.length
      : 0;

    return NextResponse.json({
      results,
      total,
      categories: categories.length,
      authors: authors.length,
      avgReadTime: Math.round(avgReadTime * 10) / 10,
    });

  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}