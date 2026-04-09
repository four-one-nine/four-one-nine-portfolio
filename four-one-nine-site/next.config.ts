import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

import { redirects } from './redirects'

// Resolve path to @payloadcms/ui package and then to its scss directory
let payloadScssPath: string
try {
  const payloadUiEntry = require.resolve('@payloadcms/ui')
  const normalized = payloadUiEntry.split(path.sep).join('/')
  const match = normalized.match(/(.+@payloadcms\/ui)/)
  if (match) {
    payloadScssPath = path.join(match[1].split('/').join(path.sep), 'dist', 'scss')
  } else {
    payloadScssPath = path.join(path.dirname(payloadUiEntry), '..', '..', 'scss')
  }
} catch {
  payloadScssPath = path.join(process.cwd(), 'node_modules', '@payloadcms', 'ui', 'dist', 'scss')
}

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL || ''

const imageHostnames = [NEXT_PUBLIC_SERVER_URL]
if (S3_PUBLIC_URL) {
  imageHostnames.push(S3_PUBLIC_URL)
}

const nextConfig: NextConfig = {
  output: 'standalone',

  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    remotePatterns: imageHostnames.map((item) => {
      const url = new URL(item)
      return {
        hostname: url.hostname,
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
      }
    }),
  },

  sassOptions: {
    includePaths: [payloadScssPath],
  },

  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },

  reactStrictMode: true,
  redirects,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: blob: https: http:; connect-src 'self' https: http:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; frame-src 'self';",
          },
          {
            key: 'X-Content-Security-Policy',
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: blob: https: http:; connect-src 'self' https: http:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; frame-src 'self';",
          },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })