'use client'

import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/lib/static-images'
import './project-card.css'

function getCategoryName(category: any): string | null {
  if (!category) return null
  if (typeof category === 'string') return null
  if (typeof category === 'object' && 'title' in category) return category.title
  return null
}

export function ProjectCard({ project, isWide }: { project: any; isWide: boolean }) {
  const externalUrl = project.externalUrl
  const linkHref = externalUrl || `/posts/${project.slug}`
  const isExternal = !!externalUrl

  const categoryName = getCategoryName(project.categories?.[0])
  const imageUrl = getImageUrl(project.heroImage || project.featuredImage)
  const blurb = project.description

  const linkProps = isExternal 
    ? { href: linkHref, target: '_blank', rel: 'noopener noreferrer' } as const
    : { href: linkHref } as const

  const infoContent = (
    <div className="space-y-2">
      <h3 className="font-mono text-lg font-semibold">{project.title}</h3>
      {blurb && (
        <p className="text-sm line-clamp-4" style={{ color: '#373737' }}>{blurb}</p>
      )}
      {categoryName && (
        <div className="text-xs font-mono uppercase tracking-wider" style={{ color: '#373737', opacity: 0.7 }}>
          {categoryName}
        </div>
      )}
      <Link
        {...linkProps}
        className="inline-block text-sm font-medium hover:underline"
        style={{ color: '#373737' }}
      >
        {isExternal ? 'View project →' : 'Read case study →'}
      </Link>
    </div>
  )

  const borderStyle = { borderRight: '1px solid rgba(55, 55, 55, 0.5)', borderBottom: '1px solid rgba(55, 55, 55, 0.5)' }

  return (
    <div className="flex flex-col h-full">
      <div 
        className="project-card group relative overflow-hidden aspect-[3/2]" 
        style={borderStyle}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            className="project-image object-cover transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        {isWide && (
          <div className="project-overlay hidden lg:flex absolute inset-0 bg-dark/80 p-6 flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="space-y-3">
              <h3 className="text-primary font-mono text-xl font-semibold">{project.title}</h3>
              {blurb && (
                <p className="text-white/90 text-sm line-clamp-4">{blurb}</p>
              )}
              {categoryName && (
                <div className="text-primary/80 text-xs font-mono uppercase tracking-wider">
                  {categoryName}
                </div>
              )}
              <Link
                {...linkProps}
                className="inline-block text-primary text-sm font-medium hover:underline"
              >
                {isExternal ? 'View project →' : 'Read case study →'}
              </Link>
            </div>
          </div>
        )}
      </div>
      <div 
        className="flex-grow p-4 lg:hidden" 
        style={borderStyle}
      >
        {infoContent}
      </div>
      {!isWide && (
        <div 
          className="flex-grow p-4 hidden lg:block" 
          style={borderStyle}
        >
          {infoContent}
        </div>
      )}
    </div>
  )
}