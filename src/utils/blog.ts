import { blogCollectionLocales, siteConfig } from '@config/site';
import { getCollection } from 'astro:content';

export async function getBlogPosts({ locale, sort }: { locale?: string; sort?: boolean } = {}) {
  const defaultPosts = await getCollection(blogCollectionLocales['en']);

  const postsMap = new Map();

  for (const post of defaultPosts) {
    postsMap.set(post.id, post);
  }

  if (locale) {
    const localePosts = await getCollection(blogCollectionLocales[locale]);

    for (const post of localePosts) {
      postsMap.set(post.id, post);
    }
  }

  const posts = Array.from(postsMap.values());

  if (sort) {
    posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  }

  return posts;
}
