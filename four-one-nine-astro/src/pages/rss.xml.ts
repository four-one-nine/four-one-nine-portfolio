import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context: { site: URL }) {
  const posts = await getCollection('posts', ({ data }) => data.status === 'published')
  const sortedPosts = posts.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())

  return rss({
    title: 'four.one.nine Blog',
    description: 'Creative developer & designer blog',
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedAt,
      description: post.data.description || '',
      link: `/posts/${post.slug}/`,
    })),
    customData: '<language>en-us</language>',
  })
}