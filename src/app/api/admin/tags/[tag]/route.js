import { rolesAuth } from "@/lib/rolesAuth";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { ROLES, MESSAGES, STATUS_CODES } from "@/lib/constants";
import { NextResponse } from "next/server";

// PATCH update a tag (rename)
export const PATCH = async (req, { params }) => {
  try {
    await connectToDatabase();
    const [currentUser, error] = await rolesAuth(req, [ROLES.ADMIN]);
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    const { tag } = await params;
    const { newName } = await req.json();

    if (!newName) {
      return NextResponse.json(
        { message: "New tag name is required" },
        {
          status: STATUS_CODES.BAD_REQUEST,
        }
      );
    }

    // Check if new tag already exists
    const existingTag = await Post.findOne({ tags: newName });
    if (existingTag) {
      return NextResponse.json(
        { message: "New tag name already exists" },
        {
          status: STATUS_CODES.BAD_REQUEST,
        }
      );
    }

    // Update all posts with the old tag
    const result = await Post.updateMany(
      { tags: tag },
      { $set: { "tags.$": newName } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Tag not found or no changes made" },
        { status: STATUS_CODES.NOT_FOUND }
      );
    }

    return new Response(
      JSON.stringify({
        oldName: tag,
        newName,
        updatedPosts: result.modifiedCount,
      }),
      { status: STATUS_CODES.OK }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update tag" },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
};

// DELETE a tag
export const DELETE = async (req, { params }) => {
  try {
    await connectToDatabase();
    const [currentUser, error] = await rolesAuth(req, [ROLES.ADMIN]);
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    const { tag } = await params;

    // Remove tag from all posts
    const result = await Post.updateMany(
      { tags: tag },
      { $pull: { tags: tag } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Tag not found or already removed" },
        { status: STATUS_CODES.NOT_FOUND }
      );
    }

    return NextResponse.json(
      {
        deletedTag: tag,
        affectedPosts: result.modifiedCount,
      },
      { status: STATUS_CODES.OK }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete tag" },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
};
