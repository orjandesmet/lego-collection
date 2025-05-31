import { z, defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';

const legoThemes = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: './src/content/themes' }),
  schema: z.object({
    source: z.literal('rebrickable'),
    id: z.string(),
    name: z.string(),
    parentId: reference('themes').optional(),
  }),
});

const legoSets = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: './src/content/sets' }),
  schema: ({ image }) =>
    z.object({
      source: z.literal('rebrickable'),
      setNumber: z.string(),
      img: image(),
      name: z.string(),
      year: z.number(),
      themeId: reference('themes'),
      themes: z.array(reference('themes')),
      parts: z.number(),
      wishlist: z.boolean(),
      dateStarted: z.string().optional(),
      dateFinished: z.string().optional(),
      totalTimeSpent: z
        .object({
          hours: z.number().optional(),
          minutes: z.number(),
          seconds: z.number(),
        })
        .optional(),
    }),
});

const legoMinifigures = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.json',
    base: './src/content/minifigures',
  }),
  schema: ({ image }) =>
    z.object({
      source: z.literal('rebrickable'),
      setNumber: z.string(),
      img: image(),
      name: z.string(),
      year: z.number(),
      themeId: reference('themes'),
      themes: z.array(reference('themes')),
      parts: z.number(),
      wishlist: z.boolean(),
      dateStarted: z.string().optional(),
      dateFinished: z.string().optional(),
      totalTimeSpent: z
        .object({
          hours: z.number().optional(),
          minutes: z.number(),
          seconds: z.number(),
        })
        .optional(),
    }),
});


export const collections = {
  'sets': legoSets,
  'themes': legoThemes,
  'minifigures': legoMinifigures,
};
