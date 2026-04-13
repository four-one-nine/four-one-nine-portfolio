import { defineCollection, z } from 'astro:content'

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    featuredImage: z.string(),
    category: z.enum(['software', 'media', 'engineering']),
    tags: z.array(z.string()).default([]),
    externalUrl: z.string().optional(),
    publishedAt: z.date(),
    status: z.enum(['draft', 'published']).default('draft'),
  }),
})

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    heroImage: z.string().optional(),
    publishedAt: z.date(),
    categories: z.array(z.enum(['software', 'media', 'engineering'])).default([]),
    status: z.enum(['draft', 'published']).default('draft'),
  }),
})

export const collections = { projects, posts }