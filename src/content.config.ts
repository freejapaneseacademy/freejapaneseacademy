import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    level: z.enum(['l0', 'n5', 'n4', 'n3', 'n2', 'n1']),
    module: z.string(),
    chapter: z.string(),
    order: z.number().int().nonnegative(),
    minutes: z.number().int().positive(),
    objectives: z.array(z.string()),
    prerequisites: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
    version: z.number().int().positive().default(1),
    isDemo: z.boolean().default(false),
    lessonId: z.string().optional(),
    publicationStatus: z.enum(['draft', 'reviewed', 'published']).default('draft')
  })
});

export const collections = { lessons };
