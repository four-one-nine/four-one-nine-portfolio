import type { Metadata } from 'next'

import { getServerPayload } from '@/lib/payload'
import { getImageUrl } from '@/lib/static-images'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const payload = await getServerPayload()
  
  const projects = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    limit: 1000,
    select: { slug: true },
  })
  
  return projects.docs.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getServerPayload()
  
  const projects = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  
  const project = projects.docs[0]
  
  if (!project) {
    return { title: 'Project Not Found' }
  }
  
  return {
    title: `${project.title} | four.one.nine`,
    description: project.description,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getServerPayload()
  
  const projects = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  
  const project = projects.docs[0]
  
  if (!project) {
    notFound()
  }
  
  const categoryName = typeof project.category === 'object' ? project.category?.title : project.category
  const imageUrl = getImageUrl(project.featuredImage)
  
  return (
    <article className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      <aside className="w-full lg:w-1/4 space-y-6">
        {imageUrl && (
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 25vw"
              priority
            />
          </div>
        )}
        <div className="space-y-4">
          <h1 className="font-mono text-3xl font-bold">{project.title}</h1>
          <div className="flex flex-wrap gap-2">
            {categoryName && (
              <span className="px-3 py-1 bg-primary/20 text-dark rounded-xl text-sm font-mono">
                {categoryName}
              </span>
            )}
            {project.tags?.map((tagItem, index) => (
              <span
                key={index}
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

      <div className="w-full lg:w-3/4 space-y-8">
        <div className="prose prose-lg max-w-none">
          {project.hasBlogPost && project.blogContent ? (
            <div className="rich-text-content">
              {/* Rich text content would be rendered here with Payload's RichText component */}
              <p>{project.description}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No detailed case study available for this project.
            </p>
          )}
        </div>

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
  )
}
