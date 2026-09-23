import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/posts" }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updates: z
        .array(
          z.object({
            date: z.coerce.date(),
            note: z.string().optional(),
          }),
        )
        .default([]),
      image: z.string().default("/static/blog-placeholder.png"),
      draft: z.boolean().default(false),
    })
    .refine(
      ({ date, updates }) => updates.every((update) => update.date > date),
      { message: "Each update date must be after the post date" },
    ),
});

export const collections = { posts };
