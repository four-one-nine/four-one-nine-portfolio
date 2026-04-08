# Frontend Architecture (Next.js 14 App Router)

## App Structure

```
apps/web/app/
├── layout.tsx                # Root layout (sidebar + main)
├── page.tsx                  # Homepage (project grid)
├── globals.css               # Tailwind imports & global styles
├── projects/
│   └── [slug]/
│       └── page.tsx          # Project detail (blog post)
├── contact/
│   └── page.tsx              # Contact page (optional, may be modal only)
└── not-found.tsx             # 404 page
```

## Root Layout (`app/layout.tsx`)

Splits viewport into sidebar (25%) and main content (75%). On mobile, stacks vertically.

```tsx
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { ContactModal } from '@/components/ContactModal';

export const metadata = {
  title: 'four.one.nine | Portfolio',
  description: 'Creative developer & designer portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-light font-sans text-dark">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Sidebar (25% on desktop, full width on mobile) */}
          <aside className="w-full lg:w-1/4 bg-dark text-white p-6 lg:p-8 lg:sticky lg:top-0 lg:h-screen overflow-y-auto">
            <Sidebar />
          </aside>

          {/* Main content (75% on desktop) */}
          <main className="w-full lg:w-3/4 p-4 lg:p-8">
            {children}
          </main>
        </div>

        {/* Contact modal (shown when triggered) */}
        <ContactModal />
      </body>
    </html>
  );
}
```

## Sidebar Component (`components/Sidebar.tsx`)

Fetches About data from Payload CMS.

```tsx
import { getPayload } from '@/lib/payload';
import { About } from '@/types/payload-types';
import Image from 'next/image';
import Link from 'next/link';

export async function Sidebar() {
  const payload = await getPayload();
  const aboutData = await payload.findGlobal({ slug: 'about' });

  return (
    <div className="space-y-8">
      {/* Logo & site name */}
      <div className="space-y-2">
        <h1 className="text-primary font-mono text-2xl lg:text-3xl font-bold tracking-tight">
          four.one.nine
        </h1>
        <div className="text-muted text-sm">419</div>
      </div>

      {/* Photo */}
      <div className="relative aspect-square rounded-2xl overflow-hidden">
        <Image
          src={aboutData.photo.url}
          alt={aboutData.name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 25vw"
          priority
        />
      </div>

      {/* Bio */}
      <div className="space-y-4">
        <p className="text-sm leading-relaxed">{aboutData.blurb}</p>
      </div>

      {/* Contact link */}
      <div>
        <Link
          href="/contact"
          className="inline-block text-primary font-mono text-sm hover:underline"
        >
          Get in touch →
        </Link>
      </div>
    </div>
  );
}
```

## Homepage (`app/page.tsx`)

Displays project grid with category filter.

```tsx
import { getPayload } from '@/lib/payload';
import { ProjectGrid } from '@/components/ProjectGrid';
import { CategoryFilter } from '@/components/CategoryFilter';

export default async function Home() {
  const payload = await getPayload();
  
  const projects = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50,
  });

  const categories = await payload.find({
    collection: 'categories',
    sort: 'name',
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h2 className="font-mono text-3xl font-bold">Projects</h2>
        <p className="text-muted">A selection of creative and software work.</p>
      </header>

      {/* Category filter */}
      <CategoryFilter categories={categories.docs} />

      {/* Project grid */}
      <ProjectGrid projects={projects.docs} />
    </div>
  );
}
```

## Project Grid (`components/ProjectGrid.tsx`)

Renders a 3‑column grid with varying column spans.

```tsx
import { Project } from '@/types/payload-types';
import { ProjectCard } from './ProjectCard';

const columnSpans = [2, 1, 1, 2, 1, 2, 1, 2, 1]; // repeat as needed

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => {
        const span = columnSpans[index % columnSpans.length];
        return (
          <div
            key={project.id}
            className={`col-span-1 ${span === 2 ? 'lg:col-span-2' : ''}`}
          >
            <ProjectCard project={project} />
          </div>
        );
      })}
    </div>
  );
}
```

## Project Card (`components/ProjectCard.tsx`)

Hover effect: image fades, text overlay appears.

```tsx
import { Project } from '@/types/payload-types';
import Image from 'next/image';
import Link from 'next/link';

export function ProjectCard({ project }: { project: Project }) {
  const hasExternalLink = !!project.externalUrl;
  const linkHref = hasExternalLink ? project.externalUrl : `/projects/${project.slug}`;

  return (
    <div className="project-card group relative aspect-[4/3] rounded-2xl overflow-hidden">
      {/* Featured image */}
      <Image
        src={project.featuredImage.url}
        alt={project.title}
        fill
        className="project-image object-cover transition-opacity duration-300"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Hover overlay */}
      <div className="project-overlay absolute inset-0 bg-dark/80 p-6 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="space-y-3">
          <h3 className="text-primary font-mono text-xl font-semibold">
            {project.title}
          </h3>
          <p className="text-white/90 text-sm line-clamp-3">
            {project.description}
          </p>
          {/* Category tag */}
          <div className="text-primary/80 text-xs font-mono uppercase tracking-wider">
            {project.category?.name}
          </div>
          {/* Link */}
          <Link
            href={linkHref}
            className="inline-block text-primary text-sm font-medium hover:underline"
            target={hasExternalLink ? '_blank' : undefined}
            rel={hasExternalLink ? 'noopener noreferrer' : undefined}
          >
            {hasExternalLink ? 'View external site' : 'Read case study'} →
          </Link>
        </div>
      </div>
    </div>
  );
}
```

## Category Filter (`components/CategoryFilter.tsx`)

Client component for filtering projects by category.

```tsx
'use client';

import { Category } from '@/types/payload-types';
import { useRouter, useSearchParams } from 'next/navigation';

export function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  const handleFilter = (categorySlug: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (categorySlug) {
      params.set('category', categorySlug);
    } else {
      params.delete('category');
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleFilter(null)}
        className={`px-4 py-2 rounded-xl text-sm font-mono transition-colors ${
          !activeCategory
            ? 'bg-primary text-dark'
            : 'bg-dark/10 text-dark hover:bg-dark/20'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleFilter(category.slug)}
          className={`px-4 py-2 rounded-xl text-sm font-mono transition-colors ${
            activeCategory === category.slug
              ? 'bg-primary text-dark'
              : 'bg-dark/10 text-dark hover:bg-dark/20'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
```

## Project Detail Page (`app/projects/[slug]/page.tsx`)

Desktop layout: 25% left (featured image + title), 75% right (blog content).

```tsx
import { getPayload } from '@/lib/payload';
import { Project } from '@/types/payload-types';
import Image from 'next/image';
import Link from 'next/link';
import { RichText } from '@payloadcms/richtext-lexical/react';

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const payload = await getPayload();
  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: params.slug } },
    limit: 1,
  });

  if (!projects.length) {
    return <div>Project not found</div>;
  }

  const project = projects[0];

  return (
    <article className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Left column (25%): featured image + title */}
      <aside className="w-full lg:w-1/4 space-y-6">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
          <Image
            src={project.featuredImage.url}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 25vw"
            priority
          />
        </div>
        <div className="space-y-4">
          <h1 className="font-mono text-3xl font-bold">{project.title}</h1>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-xl text-sm font-mono">
              {project.category?.name}
            </span>
            {project.tags?.map((tagItem) => (
              <span
                key={tagItem.id}
                className="px-3 py-1 bg-dark/10 text-dark rounded-xl text-sm font-mono"
              >
                {tagItem.tag}
              </span>
            ))}
          </div>
          {project.externalUrl && (
            <Link
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-primary font-medium hover:underline"
            >
              Visit external site →
            </Link>
          )}
        </div>
      </aside>

      {/* Right column (75%): blog content */}
      <div className="w-full lg:w-3/4 space-y-8">
        <div className="prose prose-lg max-w-none">
          {project.hasBlogPost && project.blogContent ? (
            <RichText data={project.blogContent} />
          ) : (
            <p className="text-muted">
              No detailed case study available for this project.
            </p>
          )}
        </div>

        {/* Back link */}
        <div className="pt-8 border-t border-dark/10">
          <Link
            href="/"
            className="text-primary font-mono hover:underline inline-flex items-center"
          >
            ← Back to projects
          </Link>
        </div>
      </div>
    </article>
  );
}
```

## Contact Modal (`components/ContactModal.tsx`)

Client component triggered by sidebar link.

```tsx
'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Open modal when URL is /contact
  if (pathname === '/contact' && !isOpen) {
    setIsOpen(true);
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          setSubmitted(false);
          router.push('/');
        }, 3000);
      }
    } catch (error) {
      console.error('Contact submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-dark/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 space-y-6">
        {/* Close button */}
        <button
          onClick={() => {
            setIsOpen(false);
            router.push('/');
          }}
          className="absolute top-4 right-4 text-dark/50 hover:text-dark"
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center space-y-4">
            <h3 className="font-mono text-2xl font-bold text-primary">
              Thank you!
            </h3>
            <p>Your message has been sent successfully.</p>
          </div>
        ) : (
          <>
            <h3 className="font-mono text-2xl font-bold">Get in touch</h3>
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-dark/20 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-dark/20 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-dark/20 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-dark/20 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-dark font-mono font-bold py-3 rounded-xl hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send message'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
```

## Payload Client (`lib/payload.ts`)

Helper to connect to Payload CMS.

```typescript
import { getPayload } from 'payload';
import config from '@payload-config';

export const payload = getPayload({ config });
```

## Next.js Configuration (`next.config.js`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // For static export on DreamHost, uncomment the following line:
  // output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/media/**',
      },
      // Add your production CMS domain
      {
        protocol: 'https',
        hostname: 'cms.four-one-nine.com',
        pathname: '/media/**',
      },
    ],
  },
  // Note: rewrites are not supported with static export. Remove this block if using output: 'export'.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/:path*`,
      },
      {
        source: '/admin',
        destination: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/admin`,
      },
      {
        source: '/admin/:path*',
        destination: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/admin/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

## Routing Summary

| Path              | Page Component           | Description                 |
|-------------------|--------------------------|-----------------------------|
| `/`               | `app/page.tsx`           | Homepage (project grid)     |
| `/projects/[slug]`| `app/projects/[slug]/page.tsx` | Project detail (blog) |
| `/contact`        | Modal (ContactModal)     | Contact form overlay        |
| `/admin`          | Payload admin (rewritten) | CMS admin panel            |

## Data Fetching Strategy

- **Server Components**: Fetch data at component level (async components).
- **Caching**: Use Next.js `cache` or `unstable_cache` for Payload queries.
- **ISR**: Consider incremental static regeneration for project pages.

## TypeScript Types

Generated by Payload:

```typescript
// apps/web/types/payload-types.ts (auto‑generated)
import { Payload } from 'payload';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  featuredImage: Media;
  category: Category;
  tags?: { id: string; tag: string }[];
  externalUrl?: string;
  hasBlogPost: boolean;
  blogContent?: any; // RichText
  publishedAt: string;
  status: 'draft' | 'published';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Media {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  sizes?: {
    thumbnail?: { url: string };
    card?: { url: string };
  };
}
```

## Performance Considerations

- **Image Optimization**: Next.js `<Image>` with `sizes` prop.
- **Lazy Loading**: Images below fold use `loading="lazy"`.
- **Prefetching**: Next.js Link prefetches on hover.
- **Bundle Splitting**: Automatic with App Router.

## Accessibility

- **Semantic HTML**: `<aside>`, `<main>`, `<article>`, etc.
- **Focus Management**: Modal traps focus.
- **Alt Text**: Required for all images.
- **Color Contrast**: Primary yellow on dark meets WCAG AA.

## Deployment Checklist

1. Set `NEXT_PUBLIC_PAYLOAD_URL` to production CMS URL.
2. Configure `remotePatterns` for production domain.
3. For static export on DreamHost: uncomment `output: 'export'` in `next.config.js` and remove rewrites block.
4. Run `npm run build` and `npm run export` (or `next export`) to generate static files.
5. Upload the `out` directory to DreamHost via SFTP or Git.
6. Set up analytics (e.g., Plausible, Google Analytics).