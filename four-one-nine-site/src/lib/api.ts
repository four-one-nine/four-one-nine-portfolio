// Payload REST API client for static builds
// Use this when building static site from a remote Payload instance

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

interface FetchOptions {
  collection: string
  where?: Record<string, unknown>
  sort?: string
  limit?: number
  depth?: number
}

export async function fetchFromAPI<T = unknown>({
  collection,
  where,
  sort,
  limit = 100,
  depth = 2,
}: FetchOptions): Promise<{ docs: T[]; totalDocs: number }> {
  const params = new URLSearchParams()
  
  if (where) {
    params.append('where', JSON.stringify(where))
  }
  if (sort) {
    params.append('sort', sort)
  }
  if (limit) {
    params.append('limit', limit.toString())
  }
  if (depth !== undefined) {
    params.append('depth', depth.toString())
  }
  
  const response = await fetch(`${PAYLOAD_API_URL}/api/${collection}?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${collection}: ${response.statusText}`)
  }
  
  return response.json()
}

export async function fetchDocBySlug<T = unknown>(
  collection: string,
  slug: string,
  depth = 2
): Promise<T | null> {
  const result = await fetchFromAPI<T>({
    collection,
    where: {
      slug: { equals: slug },
    },
    limit: 1,
    depth,
  })
  
  return result.docs?.[0] || null
}