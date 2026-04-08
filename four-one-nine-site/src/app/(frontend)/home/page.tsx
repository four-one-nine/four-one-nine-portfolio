import type { Metadata } from 'next'

import { getServerPayload } from '@/lib/payload'
import { ProjectGrid } from '@/components/portfolio/ProjectGrid'
import { CategoryFilter } from '@/components/portfolio/CategoryFilter'

export const metadata: Metadata = {
  title: 'four.one.nine | Portfolio',
  description: 'Creative developer & designer portfolio',
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const payload = await getServerPayload()
  const params = await searchParams
  const categorySlug = params.category

  const query: any = {
    collection: 'projects',
    limit: 50,
  }

  const where: any = {
    status: { equals: 'published' },
  }

  if (categorySlug) {
    where['category.slug'] = { equals: categorySlug }
  }

  query.where = where
  query.sort = '-publishedAt'

  const projects = await payload.find(query)

  const categories = await payload.find({
    collection: 'categories',
    sort: 'title',
  })

  return (
    <div className="pt-4 lg:pt-8">
      <header className="space-y-2 pb-6 px-4 lg:px-8" style={{ borderBottom: '1px solid rgba(55, 55, 55, 0.5)' }}>
        <h2 className="font-mono text-3xl font-bold">projects</h2>
      </header>

      <div className="px-4 lg:px-8" style={{ borderBottom: '1px solid rgba(55, 55, 55, 0.5)' }}>
        <CategoryFilter categories={categories.docs} />
      </div>

      <div className="-mt-px lg:-ml-px" style={{ borderTop: '1px solid rgba(55, 55, 55, 0.5)', borderLeft: '1px solid rgba(55, 55, 55, 0.5)' }}>
        <ProjectGrid projects={projects.docs} />
      </div>
    </div>
  )
}
