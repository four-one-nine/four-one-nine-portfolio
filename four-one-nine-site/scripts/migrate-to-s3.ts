/**
 * Migration script: uploads existing local media files to Cloudflare R2/S3
 * and updates the MongoDB documents with the new S3 URLs.
 *
 * Run with: npx tsx scripts/migrate-to-s3.ts
 *
 * Required env vars (in addition to your normal .env):
 *   S3_ENDPOINT, S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_PUBLIC_URL
 *   DATABASE_URI or DATABASE_URL
 */

import { S3Client, PutObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3'
import { MongoClient, ObjectId } from 'mongodb'
import fs from 'fs'
import path from 'path'
import mime from 'mime-types'

;(async () => {
  const S3_ENDPOINT = process.env.S3_ENDPOINT || ''
  const S3_BUCKET = process.env.S3_BUCKET || ''
  const S3_REGION = process.env.S3_REGION || 'auto'
  const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || ''
  const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || ''
  const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL || ''
  const DATABASE_URI = process.env.DATABASE_URI || process.env.DATABASE_URL || ''

  const missing = [
    ['S3_ENDPOINT', S3_ENDPOINT],
    ['S3_BUCKET', S3_BUCKET],
    ['S3_ACCESS_KEY_ID', S3_ACCESS_KEY_ID],
    ['S3_SECRET_ACCESS_KEY', S3_SECRET_ACCESS_KEY],
    ['S3_PUBLIC_URL', S3_PUBLIC_URL],
    ['DATABASE_URI/DATABASE_URL', DATABASE_URI],
  ]
    .filter(([, v]) => !v)
    .map(([k]) => k)

  if (missing.length > 0) {
    console.error(`Missing required env vars: ${missing.join(', ')}`)
    process.exit(1)
  }

  const s3 = new S3Client({
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
    credentials: {
      accessKeyId: S3_ACCESS_KEY_ID,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
  })

  console.log('Checking S3 bucket access...')
  try {
    await s3.send(new HeadBucketCommand({ Bucket: S3_BUCKET }))
    console.log(`Bucket "${S3_BUCKET}" is accessible.`)
  } catch (err) {
    console.error(`Cannot access bucket "${S3_BUCKET}". Make sure it exists and credentials are correct.`)
    console.error(err)
    process.exit(1)
  }

  const mongoClient = new MongoClient(DATABASE_URI)
  await mongoClient.connect()
  const db = mongoClient.db()

  const mediaCollection = db.collection('media')
  const mediaDocs = await mediaCollection.find({}).toArray()

  console.log(`Found ${mediaDocs.length} media documents in MongoDB.`)

  const MEDIA_DIR = path.resolve(__dirname, '../public/media')

  let uploaded = 0
  let skipped = 0
  let errors = 0

  for (const doc of mediaDocs) {
    const filename = doc.filename
    if (!filename) {
      console.warn(`Document ${doc._id} has no filename, skipping.`)
      skipped++
      continue
    }

    const sizes: Record<string, any> = doc.sizes || {}
    const allFiles: { key: string; localPath: string }[] = []

    allFiles.push({ key: `media/${filename}`, localPath: path.join(MEDIA_DIR, filename) })

    for (const [sizeName, sizeData] of Object.entries(sizes)) {
      if (sizeData && typeof sizeData === 'object' && 'filename' in sizeData) {
        const sizeFilename = (sizeData as any).filename
        if (sizeFilename) {
          allFiles.push({
            key: `media/${sizeFilename}`,
            localPath: path.join(MEDIA_DIR, sizeFilename),
          })
        }
      }
    }

    for (const { key, localPath } of allFiles) {
      if (!fs.existsSync(localPath)) {
        console.warn(`File not found locally: ${localPath}, skipping upload.`)
        skipped++
        continue
      }

      const fileBuffer = fs.readFileSync(localPath)
      const contentType = mime.lookup(localPath) || 'application/octet-stream'

      try {
        await s3.send(
          new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: key,
            Body: fileBuffer,
            ContentType: contentType,
            CacheControl: 'public, max-age=31536000, immutable',
          }),
        )
        console.log(`  Uploaded: ${key} (${contentType})`)
      } catch (err) {
        console.error(`  Failed to upload ${key}:`, err)
        errors++
      }
    }

    const publicUrl = S3_PUBLIC_URL.replace(/\/$/, '')
    const updateFields: Record<string, any> = {}

    updateFields['url'] = `${publicUrl}/media/${filename}`
    updateFields['thumbnailURL'] = doc.thumbnailURL
      ? `${publicUrl}/media/${doc.thumbnailURL}`
      : undefined

    for (const [sizeName, sizeData] of Object.entries(sizes)) {
      if (sizeData && typeof sizeData === 'object' && 'filename' in sizeData) {
        const sizeFilename = (sizeData as any).filename
        if (sizeFilename) {
          updateFields[`sizes.${sizeName}.url`] = `${publicUrl}/media/${sizeFilename}`
        }
      }
    }

    try {
      await mediaCollection.updateOne(
        { _id: doc._id },
        { $set: updateFields },
      )
      console.log(`  Updated MongoDB doc ${doc._id}`)
      uploaded++
    } catch (err) {
      console.error(`  Failed to update MongoDB doc ${doc._id}:`, err)
      errors++
    }
  }

  await mongoClient.close()

  console.log('\n--- Migration Summary ---')
  console.log(`Uploaded and updated: ${uploaded}`)
  console.log(`Skipped: ${skipped}`)
  console.log(`Errors: ${errors}`)
  console.log('Done!')
})()