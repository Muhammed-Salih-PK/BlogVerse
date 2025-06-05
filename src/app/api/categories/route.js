import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Category from "@/models/Category";
import Post from "@/models/Post";
import { STATUS_CODES } from "@/lib/constants";

export const GET = async (req) => {
  try {
    await connectToDatabase();

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
          latestArticle: { $arrayElemAt: ["$posts", 0] }, // Get the latest article
        },
      },
      { $sort: { articleCount: -1 } }, // Sort categories by article count in descending order
    ]);

    return NextResponse.json(categories, { status: STATUS_CODES.OK });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch" },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
};
