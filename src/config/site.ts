
import type { CollectionKey } from 'astro:content';

export const siteConfig = {
  blog: {
    postsPerPage: 5,
  },
};

export const blogCollectionLocales: Record<string, CollectionKey> = {
  en: 'blog',
  cy: 'blogCy',
} as const;