import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const newsCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    published: z.boolean().default(true),
  }),
});

const programsCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/programs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().default('book'),
    order: z.number().default(0),
    published: z.boolean().default(true),
  }),
});

const galleryCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    image: z.string(),
    category: z.enum(['activities', 'facilities', 'events']),
    published: z.boolean().default(true),
  }),
});

const educationCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/education' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    level: z.string(),
    image: z.string().optional(),
    slug: z.string(),
    published: z.boolean().default(true),
  }),
});

export const collections = {
  news: newsCollection,
  programs: programsCollection,
  gallery: galleryCollection,
  education: educationCollection,
};
