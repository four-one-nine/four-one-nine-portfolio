# CMS Schema (Payload 3.x)

## Collections Overview

| Collection | Purpose                     | Singleton | Access Control |
|------------|-----------------------------|-----------|----------------|
| Projects   | Portfolio projects          | No        | Public read, admin write |
| Categories | Project categorization      | No        | Public read, admin write |
| About      | Sidebar bio & photo         | Yes       | Public read, admin write |
| Contact    | Form submissions            | No        | Admin only      |
| Media      | Image uploads               | No        | Public read, admin write |

## Global Settings (Optional)

```typescript
// apps/cms/src/globals/SiteSettings.ts
import { GlobalConfig } from 'payload/types';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'four.one.nine',
    },
    {
      name: 'tagline',
      type: 'text',
    },
    {
      name: 'contactEmail',
      type: 'email',
      required: true,
    },
  ],
};
```

## Collection: Projects

**File**: `apps/cms/src/collections/Projects.ts`

```typescript
import { CollectionConfig } from 'payload/types';

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'status'],
  },
  access: {
    read: () => true, // public
    create: ({ req: { user } }) => !!user, // admin only
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      maxLength: 500,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      hasMany: false,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'External URL (optional)',
      admin: {
        description: 'Link to external project site. If empty, will link to internal blog post.',
      },
    },
    {
      name: 'hasBlogPost',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable to add an internal blog post for this project.',
      },
    },
    {
      name: 'blogContent',
      type: 'richText',
      admin: {
        condition: (_, { hasBlogPost } = {}) => !!hasBlogPost,
        description: 'Full blog post content. Only shown if "Has Blog Post" is checked.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          displayFormat: 'MM/dd/yyyy',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
};
```

## Collection: Categories

**File**: `apps/cms/src/collections/Categories.ts`

```typescript
import { CollectionConfig } from 'payload/types';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
};
```

## Collection: About (Singleton)

**File**: `apps/cms/src/collections/About.ts`

```typescript
import { CollectionConfig } from 'payload/types';

export const About: CollectionConfig = {
  slug: 'about',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Your Name',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'blurb',
      type: 'textarea',
      required: true,
      maxLength: 1000,
      admin: {
        description: 'Short bio displayed in sidebar.',
      },
    },
    {
      name: 'contactLink',
      type: 'text',
      defaultValue: '/contact',
      admin: {
        description: 'URL for contact link (can be # for modal).',
      },
    },
  ],
};
```

## Collection: Contact (Form Submissions)

**File**: `apps/cms/src/collections/Contact.ts`

```typescript
import { CollectionConfig } from 'payload/types';

export const Contact: CollectionConfig = {
  slug: 'contact',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => !!user, // admin only
    create: () => true, // public can submit
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [({ req }) => req.headers['x-forwarded-for'] || req.socket.remoteAddress],
      },
    },
  ],
  timestamps: true,
};
```

## Collection: Media

**File**: `apps/cms/src/collections/Media.ts`

```typescript
import { CollectionConfig } from 'payload/types';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
        height: 600,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
};
```

## Email Plugin Configuration

**File**: `apps/cms/src/payload.config.ts`

```typescript
import { buildConfig } from 'payload/config';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import path from 'path';
import { Projects } from './collections/Projects';
import { Categories } from './collections/Categories';
import { About } from './collections/About';
import { Contact } from './collections/Contact';
import { Media } from './collections/Media';
import { SiteSettings } from './globals/SiteSettings';

export default buildConfig({
  admin: {
    user: 'users', // if you add a Users collection; otherwise remove
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI,
  }),
  email: nodemailerAdapter({
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
    fromName: 'four.one.nine Contact Form',
    fromAddress: 'noreply@example.com',
  }),
  collections: [Projects, Categories, About, Contact, Media],
  globals: [SiteSettings],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
});
```

## Custom Endpoint: Contact Form Submission

**File**: `apps/cms/src/endpoints/contact.ts`

```typescript
import { Endpoint } from 'payload/config';
import { Contact } from '../collections/Contact';

export const contactEndpoint: Endpoint = {
  path: '/contact',
  method: 'post',
  handler: async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // Validate
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    try {
      // Create submission
      const submission = await req.payload.create({
        collection: 'contact',
        data: { name, email, subject, message },
      });
      
      // Send email notification
      await req.payload.sendEmail({
        to: process.env.CONTACT_EMAIL || 'your-email@example.com',
        subject: `Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
      
      return res.status(201).json({ success: true });
    } catch (error) {
      console.error('Contact form error:', error);
      return res.status(500).json({ error: 'Failed to submit form' });
    }
  },
};
```

## Seed Data (6‑9 Placeholder Projects)

**File**: `apps/cms/src/seed.ts`

```typescript
import payload from 'payload';

export const seed = async () => {
  // Create categories
  const software = await payload.create({
    collection: 'categories',
    data: { name: 'Software', slug: 'software' },
  });
  const photography = await payload.create({
    collection: 'categories',
    data: { name: 'Photography', slug: 'photography' },
  });
  const design = await payload.create({
    collection: 'categories',
    data: { name: 'Design', slug: 'design' },
  });
  const video = await payload.create({
    collection: 'categories',
    data: { name: 'Video', slug: 'video' },
  });

  // Create placeholder media
  const placeholderImage = await payload.create({
    collection: 'media',
    data: { alt: 'Placeholder project image' },
    filePath: path.resolve(__dirname, 'seed/placeholder.jpg'),
  });

  // Create 8 placeholder projects
  const projects = [
    {
      title: 'E‑Commerce Platform',
      slug: 'e‑commerce‑platform',
      description: 'Full‑stack Next.js store with Stripe integration.',
      category: software.id,
      tags: [{ tag: 'Next.js' }, { tag: 'Stripe' }, { tag: 'React' }],
      externalUrl: 'https://example.com/ecommerce',
      hasBlogPost: true,
      blogContent: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Detailed blog post about building the e‑commerce platform...' }],
            },
          ],
        },
      },
      publishedAt: '2025-01-15',
      status: 'published',
    },
    {
      title: 'Portfolio Website',
      slug: 'portfolio-website',
      description: 'This very site, built with Payload CMS and Next.js.',
      category: software.id,
      tags: [{ tag: 'Next.js' }, { tag: 'Payload' }, { tag: 'TypeScript' }],
      hasBlogPost: false,
      publishedAt: '2025-02-01',
      status: 'published',
    },
    {
      title: 'Mountain Landscape Series',
      slug: 'mountain‑landscape‑series',
      description: 'Photography series capturing alpine sunrises.',
      category: photography.id,
      tags: [{ tag: 'Landscape' }, { tag: 'Alpine' }],
      externalUrl: 'https://instagram.com/p/...',
      publishedAt: '2024-11-20',
      status: 'published',
    },
    {
      title: 'Brand Identity Design',
      slug: 'brand‑identity‑design',
      description: 'Logo, typography, and color system for a tech startup.',
      category: design.id,
      tags: [{ tag: 'Branding' }, { tag: 'Logo' }],
      hasBlogPost: true,
      blogContent: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Case study on the brand identity design process...' }],
            },
          ],
        },
      },
      publishedAt: '2024-10-05',
      status: 'published',
    },
    {
      title: 'Documentary Short Film',
      slug: 'documentary‑short‑film',
      description: '10‑minute documentary about local artists.',
      category: video.id,
      tags: [{ tag: 'Documentary' }, { tag: 'Film' }],
      externalUrl: 'https://vimeo.com/...',
      publishedAt: '2024-09-12',
      status: 'published',
    },
    {
      title: 'Task Management App',
      slug: 'task‑management‑app',
      description: 'React Native app for personal productivity.',
      category: software.id,
      tags: [{ tag: 'React Native' }, { tag: 'Mobile' }],
      hasBlogPost: false,
      publishedAt: '2024-08-30',
      status: 'published',
    },
    {
      title: 'Street Photography',
      slug: 'street‑photography',
      description: 'Urban scenes and candid moments in the city.',
      category: photography.id,
      tags: [{ tag: 'Street' }, { tag: 'Urban' }],
      externalUrl: 'https://flickr.com/photos/...',
      publishedAt: '2024-07-18',
      status: 'published',
    },
    {
      title: 'UI Kit & Design System',
      slug: 'ui‑kit‑design‑system',
      description: 'Comprehensive Figma component library.',
      category: design.id,
      tags: [{ tag: 'UI/UX' }, { tag: 'Figma' }],
      hasBlogPost: true,
      blogContent: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'How I built a scalable design system from scratch...' }],
            },
          ],
        },
      },
      publishedAt: '2024-06-25',
      status: 'published',
    },
  ];

  for (const project of projects) {
    await payload.create({
      collection: 'projects',
      data: {
        ...project,
        featuredImage: placeholderImage.id,
      },
    });
  }

  // Create About singleton
  await payload.create({
    collection: 'about',
    data: {
      name: 'Your Name',
      photo: placeholderImage.id,
      blurb: 'Creative developer and designer building digital experiences. Passionate about clean code, bold visuals, and seamless user journeys.',
    },
  });

  console.log('Seed completed!');
};
```

## Access Control Details

- **Public read**: All collections except Contact allow public read access.
- **Admin write**: Only authenticated users (via Payload admin) can create/update/delete.
- **Contact**: Public can create (submit form), only admin can read/update/delete.

## Hooks & Validation

- **Slug generation**: Automatic from title.
- **Image sizes**: Thumbnail (400×300) and card (800×600) generated automatically.
- **Email validation**: Built‑in for email fields.

## GraphQL & REST Endpoints

Payload automatically generates:

- **REST**: `GET /api/projects`, `GET /api/projects/:id`, etc.
- **GraphQL**: `query { Projects { docs { title slug } } }`

## Next.js Integration

Use `@payloadcms/next` to fetch data:

```typescript
// apps/web/lib/payload.ts
import { getPayload } from 'payload';

const payload = await getPayload({ config: payloadConfig });

export const getProjects = async () => {
  return await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
  });
};
```