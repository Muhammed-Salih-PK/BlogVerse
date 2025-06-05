import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long.")
    .max(150, "Title not exceed more than 150 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters long."),
  content: z.string().min(50, "Content must be at least 50 characters long."),
  status: z.enum(["draft", "published"]),
  categories: z.array(z.string()).optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  featuredImage: z
    .string()
    .url("Featured image must be a valid URL")
    .optional(),
});

export const adminPostSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long.")
    .max(150, "Title not Exceed 150 characters."),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters long."),
  content: z.string().min(50, "Content must be at least 50 characters long."),
  status: z.enum(["draft", "published"]),
  categories: z.array(z.string()).optional(),
  tags: z
    .preprocess((val) => {
      if (typeof val === "string") {
        return val
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }
      return Array.isArray(val) ? val.map((tag) => tag.trim()) : [];
    }, z.array(z.string()))
    .optional(),
  featuredImage: z
    .string()
    .url("Featured image must be a valid URL")
    .optional(),

  authorId: z.string().min(1, "Author is required"),
});
