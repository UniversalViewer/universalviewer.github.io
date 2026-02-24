
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const blog = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      language: z.enum(['en']),
      author: z.string().optional(),
      description: z.string().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
    }),
});

const blogCy = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/blog/cy" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      language: z.enum(['cy']),
      author: z.string().optional(),
      description: z.string().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
    }),
});

export const collections = {
  blog,
  blogCy,
};
