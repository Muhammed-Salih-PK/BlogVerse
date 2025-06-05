import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Category from "@/models/Category";
import Post from "@/models/Post";
import { rolesAuth } from "@/lib/rolesAuth";
import { ROLES, MESSAGES, STATUS_CODES } from "@/lib/constants";
import { categorySchema } from "@/zod/schemas/categorySchema";

export const GET = async (req) => {
  try {
    await connectToDatabase();
    /// Await and check admin authorization
    const [currentUser, error] = await rolesAuth(req, [ROLES.ADMIN]);
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "posts",
          let: { categoryId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$$categoryId", "$categories"] }, // This checks if categoryId exists in the post's categoryId array
                status: "published",
              },
            },
            { $sort: { publishedAt: -1 } }, // Sort posts by publishedAt in descending order
          ],
          as: "posts",
        },
      },
      {
        $project: {
          name: 1,
          slug: 1,
          description: 1,
          articleCount: { $size: "$posts" }, // Count the number of posts per category
        },
      },
      { $sort: { articleCount: -1 } }, // Sort categories by article count in descending order
    ]);

    return NextResponse.json(categories, { status: STATUS_CODES.OK });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
};

export const POST = async (req) => {
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
    const slugify = (name) =>
      name
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-");

    const newcategory = new Category({
      name: validatedData.name,
      slug: slugify(validatedData.name),
      description: validatedData.description || "",
      featuredImage: validatedData.featuredImage || "",
    });
    await newcategory.save();

    return NextResponse.json(
      { data: newcategory, message: "Category created successfully!" },
      { status: STATUS_CODES.CREATED }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: MESSAGES.SERVER_ERROR },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
};
