import { z } from "zod";

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(
      /^[a-zA-Z0-9 ]+$/,
      "Username can only contain letters, numbers, and spaces"
    ),

  email: z.string().email("Please enter a valid email address"),

  avatar: z
    .string()
    .url("Avatar must be a valid URL")
    .optional()
    .or(z.literal("")),

  bio: z
    .string()
    .max(250, "Bio must not exceed 250 characters")
    .optional()
    .or(z.literal("")),

  socialLinks: z.object({
    twitter: z
      .string()
      .regex(
        /^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]+$/i,
        "Please enter a valid Twitter URL"
      )
      .optional()
      .or(z.literal("")),
    github: z
      .string()
      .regex(
        /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+$/i,
        "Please enter a valid GitHub URL"
      )
      .optional()
      .or(z.literal("")),
    website: z
      .string()
      .regex(
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/\S*)?$/i,
        "Please enter a valid website URL"
      )
      .optional()
      .or(z.literal("")),
  }),
});
