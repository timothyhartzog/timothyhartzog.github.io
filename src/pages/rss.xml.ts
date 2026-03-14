import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const blog = await getCollection('blog', ({ data }) => !data.draft);
  const analysis = await getCollection('analysis', ({ data }) => !data.draft);

  const items = [...blog, ...analysis]
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((post) => {
      const section = blog.includes(post) ? 'blog' : 'analysis';
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/${section}/${post.id}/`,
        categories: post.data.tags,
      };
    });

  return rss({
    title: 'Hartzog.ai',
    description: 'AI-powered data analysis, research, and educational resources.',
    site: context.site!,
    items,
    customData: '<language>en-us</language>',
  });
}
