import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { ROLES, STATUS_CODES, MESSAGES } from "@/lib/constants";


export const GET = async (request) => {
  try {
    await connectToDatabase();

    // Get all tags with article counts
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
    ]);
    return new Response(JSON.stringify(tagsWithCounts), { status: STATUS_CODES.OK });
  } catch (error) {
    return new Response("Failed to fetch tags", {
      status: STATUS_CODES.SERVER_ERROR,
    });
  }
};
