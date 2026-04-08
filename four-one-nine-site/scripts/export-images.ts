import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { config } from 'dotenv'

// Load environment variables from .env file
config()

const PUBLIC_DIR = path.join(process.cwd(), 'public', 'images')
const PAYLOAD_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

async function fetchJSON(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    
    protocol.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    
    const dir = path.dirname(filepath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    const file = fs.createWriteStream(filepath)
    
    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location
        if (redirectUrl) {
          downloadImage(redirectUrl, filepath).then(resolve).catch(reject)
          return
        }
      }
      
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(filepath, () => {})
      reject(err)
    })
  })
}

async function exportImages() {
  console.log('📦 Starting image export...')
  console.log(`📡 Connecting to Payload at: ${PAYLOAD_URL}`)
  
  // Ensure public/images directory exists
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true })
  }
  
  try {
    // Fetch all projects via REST API
    console.log('📥 Fetching projects...')
    const projectsData = await fetchJSON(`${PAYLOAD_URL}/api/projects?limit=1000&depth=1`)
    
    const projects = projectsData.docs || []
    console.log(`   Found ${projects.length} projects`)
    
    const imageUrls = new Set<string>()
    
    // Collect all image URLs from projects
    for (const project of projects) {
      // Featured image
      if (project.featuredImage && typeof project.featuredImage === 'object' && project.featuredImage.url) {
        imageUrls.add(project.featuredImage.url)
      }
      // Hero image
      if (project.heroImage && typeof project.heroImage === 'object' && project.heroImage.url) {
        imageUrls.add(project.heroImage.url)
      }
    }
    
    // Fetch media collection
    console.log('📥 Fetching media...')
    const mediaData = await fetchJSON(`${PAYLOAD_URL}/api/media?limit=1000`)
    
    const media = mediaData.docs || []
    for (const item of media) {
      if (item.url) {
        imageUrls.add(item.url)
      }
      // Include different sizes if available
      if (item.sizes) {
        for (const size of Object.values(item.sizes)) {
          if ((size as any)?.url) {
            imageUrls.add((size as any).url)
          }
        }
      }
    }
    
    console.log(`\n📸 Found ${imageUrls.size} unique images to download`)
    
    // Download images
    let downloaded = 0
    let skipped = 0
    let failed = 0
    
    for (const url of imageUrls) {
      try {
        // Make URL absolute if it's relative
        const absoluteUrl = url.startsWith('http') ? url : `${PAYLOAD_URL}${url.startsWith('/') ? '' : '/'}${url}`
        
        // Extract filename from URL
        const urlObj = new URL(absoluteUrl)
        const filename = path.basename(urlObj.pathname)
        const filepath = path.join(PUBLIC_DIR, filename)
        
        // Skip if already exists
        if (fs.existsSync(filepath)) {
          console.log(`  ✓ Skipping: ${filename}`)
          skipped++
          continue
        }
        
        console.log(`  ↓ Downloading: ${filename}`)
        await downloadImage(absoluteUrl, filepath)
        downloaded++
      } catch (error) {
        console.error(`  ✗ Failed: ${url}`)
        console.error(`    ${error instanceof Error ? error.message : error}`)
        failed++
      }
    }
    
    console.log('\n✅ Image export complete!')
    console.log(`   Downloaded: ${downloaded}`)
    console.log(`   Skipped: ${skipped}`)
    console.log(`   Failed: ${failed}`)
    console.log(`   Location: ${PUBLIC_DIR}`)
    
    if (failed > 0) {
      console.log('\n⚠️  Some images failed to download.')
    }
    
  } catch (error) {
    console.error('Error exporting images:', error)
    console.error('\n⚠️  Make sure Payload is running:')
    console.error('   1. Run `pnpm dev` in another terminal')
    console.error('   2. Make sure MongoDB is running')
    console.error('   3. Check .env file has correct values')
    process.exit(1)
  }
}

exportImages()