import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://419.software',
  output: 'static',
  integrations: [
    mdx(),
    sitemap(),
  ],
  image: {
    domains: ['cdn.419.software'],
  },
})