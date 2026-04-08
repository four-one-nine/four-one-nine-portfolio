import { buildConfig } from 'payload/config';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: '@payloadcms/auth',
    meta: {
      titleSuffix: '- Four One Nine Portfolio',
    },
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost:27017/four-one-nine-portfolio',
  }),
  editor: slateEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'payload-secret-change-in-production',
  collections: [
    {
      slug: 'media',
      upload: {
        staticDir: path.resolve(dirname, 'public/media'),
        imageSizes: [
          { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
          { name: 'card', width: 800, height: 600, position: 'centre' },
          { name: 'square', width: 1024, height: 1024, position: 'centre' },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*'],
      },
      fields: [
        { name: 'alt', type: 'text', required: true },
      ],
      access: {
        read: () => true,
      },
    },
    {
      slug: 'categories',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          admin: { readOnly: true },
        },
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
      access: {
        read: () => true,
      },
    },
    {
      slug: 'projects',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          admin: { readOnly: true },
        },
        { name: 'description', type: 'text', required: true },
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
        },
        {
          name: 'tags',
          type: 'array',
          fields: [{ name: 'tag', type: 'text' }],
        },
        { name: 'externalUrl', type: 'text' },
        { name: 'hasBlogPost', type: 'checkbox', defaultValue: false },
        {
          name: 'blogContent',
          type: 'richText',
          editor: slateEditor({}),
          admin: {
            description: 'Rich text content for blog posts',
          },
        },
        { name: 'publishedAt', type: 'date' },
        {
          name: 'status',
          type: 'select',
          options: ['draft', 'published'],
          defaultValue: 'draft',
          admin: { position: 'sidebar' },
        },
      ],
      access: {
        read: () => true,
      },
    },
    {
      slug: 'about',
      singleton: true,
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        { name: 'blurb', type: 'textarea', required: true },
        { name: 'contactLink', type: 'text', required: true },
      ],
      access: {
        read: () => true,
      },
    },
    {
      slug: 'contact',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'subject', type: 'text', required: true },
        { name: 'message', type: 'textarea', required: true },
        { name: 'status', type: 'select', options: ['new', 'read', 'replied'] },
        { name: 'createdAt', type: 'date' },
      ],
      access: {
        create: () => true,
        read: () => true,
        update: () => true,
        delete: () => true,
      },
    },
  ],
  globals: [
    {
      slug: 'site-settings',
      fields: [
        { name: 'siteName', type: 'text', defaultValue: 'Four One Nine Portfolio' },
        { name: 'footerText', type: 'text' },
      ],
    },
  ],
  endpoints: [
    {
      path: '/api/contact',
      method: 'post',
      handler: async (req) => {
        const { name, email, subject, message } = req.json();
        console.log('Contact form submission:', { name, email, subject, message });
        return Response.json({ success: true, message: 'Contact form submitted successfully' });
      },
    },
  ],
});
