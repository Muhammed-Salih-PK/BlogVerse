import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import { rolesAuth } from "@/lib/rolesAuth";
import mongoose from "mongoose";
import { ROLES, STATUS_CODES, MESSAGES } from "@/lib/constants";
import { categorySchema } from "@/zod/schemas/categorySchema";

export const GET = async (req, { params }) => {
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
    const { id } = await params;

    // First find the category by slug
    const category = await Category.findById(id).lean();

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: STATUS_CODES.NOT_FOUND }
      );
    }

    // Find all published posts in this category
    const categories = await Category.findById(id).lean();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching category articles:", error);
    return NextResponse.json(
      { message: MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
};

export const PUT = async (req, { params }) => {
  try {
    await connectToDatabase();

    const { id } = await params;
    // Await and check admin authorization
    const [currentUser, error] = await rolesAuth(req, [ROLES.ADMIN]);
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }
    // First find the category by id
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: STATUS_CODES.NOT_FOUND }
      );
    }

    const body = await req.json();

    // ✅ Validate body with Zod
    const parsed = categorySchema.safeParse(body);
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

    const { name, description, featuredImage } = validatedData;
    const slugify = (name) =>
      name
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-");

    category.name = name;
    category.description = description;
    category.featuredImage = featuredImage;
    category.slug = slugify(name);

    await category.save();

    return NextResponse.json(
      {
        message: "Category updated successfully",
        category,
      },
      { status: STATUS_CODES.CREATED }
    );
  } catch (error) {
    console.error("Error updating category: ", error);
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
        { message: "Invalid Category ID" },
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
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: STATUS_CODES.NOT_FOUND }
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting Category:", error);
    return NextResponse.json(
      { message: MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
}
