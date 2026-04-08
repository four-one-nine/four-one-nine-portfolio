// Helper to resolve image URLs for static builds
// During static export, images are exported to /public/images and referenced from /images/

const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true' || process.env.STATIC_EXPORT === 'true'
const PAYLOAD_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

function extractFilename(url: string): string | null {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname.split('/').pop() || null
  } catch {
    return null
  }
}

export function getImageUrl(image: any): string | null {
  if (!image) return null
  
  // If it's already a string, process it
  if (typeof image === 'string') {
    if (STATIC_EXPORT) {
      const filename = extractFilename(image)
      if (filename) {
        return `/images/${filename}`
      }
    }
    return image
  }
  
  // If it's an object with a URL property
  if (typeof image === 'object' && 'url' in image && image.url) {
    const url = image.url
    
    // For static export, convert Payload URLs to static paths
    if (STATIC_EXPORT) {
      const filename = extractFilename(url)
      if (filename) {
        return `/images/${filename}`
      }
    }
    
    return url
  }
  
  return null
}

export function getImageUrls(images: any[]): string[] {
  return images
    .map(img => getImageUrl(img))
    .filter((url): url is string => url !== null)
}