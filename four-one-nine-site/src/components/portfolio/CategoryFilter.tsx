'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/payload-types'
import './category-filter.css'

export function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category')

  const handleFilter = (categorySlug: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (categorySlug) {
      params.set('category', categorySlug)
    } else {
      params.delete('category')
    }
    router.push(`/?${params.toString()}`)
  }

  const allCategories = [
    { id: 'all', title: 'All', slug: null },
    ...categories.map(c => ({ id: c.id, title: c.title, slug: c.slug }))
  ]

  return (
    <div className="filter-buttons">
      {allCategories.map((category, index) => {
        const isFirst = index === 0
        const isLast = index === allCategories.length - 1
        const isActive = (category.slug === null && !activeCategory) || activeCategory === category.slug
        
        return (
          <button
            key={category.id}
            onClick={() => handleFilter(category.slug)}
            className={`filter-btn ${isActive ? 'active' : ''} ${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}`}
          >
            <span className="btn-text">{category.title}</span>
            <span className="btn-bg"></span>
          </button>
        )
      })}
    </div>
  )
}
