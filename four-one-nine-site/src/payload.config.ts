import { mongooseAdapter } from '@payloadcms/db-mongodb'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest, Endpoint } from 'payload'
import { fileURLToPath } from 'url'

const migratePostsToProjects: Endpoint = {
  path: '/migrate-posts-to-projects',
  method: 'post',
  handler: async (req) => {
    const { payload } = req

    payload.logger.info('Starting migration: posts to projects')

    const posts = await payload.find({
      collection: 'posts',
      limit: 1000,
      depth: 1,
    })

    payload.logger.info(`Found ${posts.docs.length} posts to migrate`)

    let migrated = 0
    let skipped = 0

    for (const post of posts.docs) {
      try {
        const projectData: any = {
          title: post.title,
          description: post.title,
          status: post._status === 'published' ? 'published' : 'draft',
          publishedAt: post.publishedAt,
          slug: post.slug,
        }

        if (post.heroImage) {
          projectData.featuredImage = typeof post.heroImage === 'object' ? post.heroImage.id : post.heroImage
        }

        if (post.categories && post.categories.length > 0) {
          const cat = post.categories[0]
          projectData.category = typeof cat === 'object' ? cat.id : cat
        }

        if (post.content) {
          projectData.hasBlogPost = true
          projectData.blogContent = post.content
        }

        await payload.create({
          collection: 'projects',
          data: projectData,
          depth: 0,
          context: { disableRevalidate: true },
        })

        migrated++
      } catch (error) {
        payload.logger.error(`Failed to migrate post ${post.id}: ${error}`)
        skipped++
      }
    }

    payload.logger.info(`Migration complete: ${migrated} migrated, ${skipped} skipped`)

    return Response.json({
      success: true,
      migrated,
      skipped,
    })
  },
}

import { About } from './globals/About'
import { Categories } from './collections/Categories'
import { Contact } from './collections/Contact'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  collections: [Pages, Posts, Media, Categories, Projects, Contact, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, About],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
  endpoints: [migratePostsToProjects],
})
