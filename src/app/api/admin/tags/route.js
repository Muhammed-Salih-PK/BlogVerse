import { rolesAuth } from "@/lib/rolesAuth";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { ROLES, STATUS_CODES } from "@/lib/constants";
import { NextResponse } from "next/server";

// GET all tags with counts
export const GET = async (req) => {
  try {
    await connectToDatabase();
    const [currentUser, error] = await rolesAuth(req, [ROLES.ADMIN]);
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    const tagsWithCounts = await Post.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      {
        $project: {
          name: "$_id",
          slug: "$_id",
          articleCount: "$count",
          _id: 0,
        },
      },
      { $sort: { articleCount: -1 } },
    ]);

    return NextResponse.json(tagsWithCounts, { status: STATUS_CODES.CREATED });
  } catch (error) {
    return NextResponse({ message: "Failed to fetch tags" }, { status: STATUS_CODES.SERVER_ERROR });
  }
};

// POST create new tag
export const POST = async (req) => {
  try {
    await connectToDatabase();
    const [currentUser, error] = await rolesAuth(req, [ROLES.ADMIN]);
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    const { name } = await req.json();
    if (!name) {
      return NextResponse.json(
        { message: "Tag name is required" },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    // Check if tag already exists
    const existingTag = await Post.findOne({ tags: name });
    if (existingTag) {
      return NextResponse.json(
        { message: "Tag already exists" },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    // No need to save since tags are embedded in posts
    return NextResponse.json(
      { name, slug: name, articleCount: 0 },
      {
        status: STATUS_CODES.CREATED,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create tag" },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
};
