import { getPayload } from 'payload'
import config from '@payload-config'

const STATIC_EXPORT = process.env.STATIC_EXPORT === 'true'
const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// For static export, we use the REST API with a running Payload server
// For development/build, we use the local API

export async function getServerPayload() {
  return await getPayload({ config })
}

export async function fetchFromAPI<T>(collection: string, options: {
  where?: Record<string, unknown>
  sort?: string
  limit?: number
  depth?: number
} = {}) {
  const params = new URLSearchParams()
  
  if (options.where) {
    params.append('where', JSON.stringify(options.where))
  }
  if (options.sort) {
    params.append('sort', options.sort)
  }
  if (options.limit) {
    params.append('limit', options.limit.toString())
  }
  if (options.depth !== undefined) {
    params.append('depth', options.depth.toString())
  }
  
  const response = await fetch(`${PAYLOAD_API_URL}/api/${collection}?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${collection}: ${response.statusText}`)
  }
  
  return response.json() as Promise<{ docs: T[]; totalDocs: number }>
}