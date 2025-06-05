import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name must not exceed 20 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(250, "Description must not exceed 250 characters"),

  featuredImage: z
    .string()
    .url("Featured image must be a valid URL")
    .optional()
    .or(z.literal("")), // allow empty string too
});
