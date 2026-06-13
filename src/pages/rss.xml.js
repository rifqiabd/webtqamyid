import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../config';

export async function GET(context) {
  const posts = await getCollection('news', ({ data }) => data.published !== false);
  return rss({
    title: `${SITE.shortName} — Berita`,
    description: 'Berita terbaru dari Pondok Pesantren Thibbil Qulub Assimbani',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/news/${post.id}/`,
    })),
  });
}
