import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { ROLES, STATUS_CODES, MESSAGES } from "@/lib/constants";

export const GET = async () => {
  try {
    await connectToDatabase();

    // Get all tags with article counts
    const tagsWithCounts = await Post.aggregate([
      { $unwind: "$tags" }, // Split arrays of tags into individual documents
      { $group: { _id: "$tags", count: { $sum: 1 } } }, // Count occurrences of each tag
      {
        $project: {
          name: "$_id", // Return tag name
          slug: "$_id", // Optional slug
          articleCount: "$count", // Number of posts with that tag
          _id: 0,
        },
      },
      { $sort: { articleCount: -1 } }, // Sort by most used
      { $limit: 5 }, // Return top 5
    ]);

    return new Response(JSON.stringify(tagsWithCounts), {
      status: STATUS_CODES.OK,
    });
  } catch (error) {
    return new Response("Failed to fetch tags", {
      status: STATUS_CODES.SERVER_ERROR,
    });
  }
};
