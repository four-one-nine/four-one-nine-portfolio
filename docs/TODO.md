# Development Todo List

## Current Status (March 2026)

**Phase 1: Project Setup** ✅ COMPLETED
- Monorepo structure established with npm workspaces
- Next.js 15 frontend working with mock data
- Payload 3.x CMS configured (requires MongoDB for full functionality)
- Tailwind CSS configured with custom theme

**Phase 3: Frontend Development** ✅ MOSTLY COMPLETED
- Layout, components, and pages implemented
- Mock data system for offline development
- Responsive design implemented (testing needed)
- Contact modal and filtering working

**Current Status (March 2026):**

1. ✅ Frontend is fully functional with mock data (run `npm run dev:web`)
2. ⚠️ CMS collections are implemented but need MongoDB to run
3. 🔧 Next steps: Set up MongoDB and fix CMS module issues

**Immediate Next Steps:**
1. Set up MongoDB (local or Atlas) for CMS
2. Fix Payload 3.x module compatibility
3. Connect frontend to real CMS API
4. Test end-to-end functionality
5. Deploy both frontend and CMS

## Development Phases

## Phase 1: Project Setup

### 1.1 Initialize Monorepo
- [x] Create root directory `four-one-nine-portfolio`
- [x] Initialize git repository
- [x] Create `package.json` with workspaces
- [x] Create `pnpm-workspace.yaml` (converted to npm workspaces)
- [x] Create `turbo.json` (optional)
- [x] Create `apps/web` directory
- [x] Create `apps/cms` directory
- [ ] Alternatively, use `npx create-payload-app` to scaffold the project

### 1.2 Frontend Setup (Next.js)
- [x] Initialize Next.js 15 with TypeScript in `apps/web`
- [x] Configure Tailwind CSS
- [x] Set up path aliases (`@/components`, `@/lib`)
- [x] Create `next.config.js` with image domains and rewrites
- [x] Install dependencies: `payload`, `@payloadcms/next`, `graphql`
- [x] Create `lib/payload.ts` helper (with mock data fallback)
- [x] Create `types/payload-types.ts` (placeholder)

### 1.3 CMS Setup (Payload)
- [x] Initialize Payload 3.x in `apps/cms`
- [x] Configure MongoDB adapter (in config)
- [x] Set up Nodemailer email plugin (in config)
- [x] Create `.env` files for both apps
- [x] Install dependencies: `@payloadcms/db-mongodb`, `@payloadcms/email-nodemailer`
- [x] Create `payload.config.ts` with collections and globals (placeholder)

## Phase 2: CMS Development

### 2.1 Collections
- [x] Create `Media` collection with image sizes
- [x] Create `Categories` collection (flat list)
- [x] Create `Projects` collection with all fields:
  - Title, slug (auto‑generated)
  - Description, featuredImage (upload)
  - Category (relationship), tags (array)
  - externalUrl, hasBlogPost, blogContent (richText)
  - publishedAt, status
- [x] Create `About` singleton with fields:
  - Name, photo (upload), blurb, contactLink
- [x] Create `Contact` collection for form submissions

### 2.2 Globals
- [x] Create `SiteSettings` global (optional)

### 2.3 Custom Endpoints
- [x] Create contact form submission endpoint (`/api/contact`)
- [x] Implement email sending via Payload plugin

### 2.4 Access Control
- [x] Set public read access for Projects, Categories, About, Media
- [x] Set admin‑only write access for all collections
- [x] Set public create access for Contact, admin‑only read

### 2.5 Hooks & Validation
- [x] Slug generation hooks for Projects and Categories
- [x] Image validation for Media collection

### 2.6 Seed Data
- [x] Create placeholder media (images)
- [x] Create 4 categories: Software, Photography, Design, Video
- [x] Create 8 placeholder projects with varied data
- [x] Create About singleton data
- [x] Write seed script (`seed.ts`)

**Status**: All collection files have been created. However, there are issues with running the Payload 3.x CMS due to module compatibility and MongoDB requirements. The CMS is configured but needs additional setup to run.

**Next Steps for CMS**:
1. Install and configure MongoDB (or use MongoDB Atlas)
2. Fix module compatibility issues (ESM/CommonJS)
3. Set up proper development environment
4. Test the CMS admin interface

## Phase 3: Frontend Development

### 3.1 Global Layout
- [x] Create root layout with sidebar + main structure
- [x] Import Google Fonts (JetBrains Mono, Inter)
- [x] Configure Tailwind theme with colors, fonts
- [x] Create `globals.css` with base styles

### 3.2 Sidebar Component
- [x] Create `Sidebar.tsx` (server component)
- [x] Fetch About data from Payload (with mock fallback)
- [x] Render logo, photo, blurb, contact link
- [x] Style with sticky positioning on desktop

### 3.3 Homepage
- [x] Create `app/page.tsx` (server component)
- [x] Fetch published projects from Payload (mock data)
- [x] Fetch categories for filter (mock data)
- [x] Render page header and category filter

### 3.4 Project Grid
- [x] Create `ProjectGrid.tsx` component
- [x] Implement 3‑column grid with varying spans (2/1 pattern)
- [x] Create `ProjectCard.tsx` with hover effect
- [x] Implement image fade + text overlay on hover
- [x] Add "Learn more" link logic (external vs internal)

### 3.5 Category Filter
- [x] Create `CategoryFilter.tsx` (client component)
- [x] Implement filtering via URL search params
- [x] Style active/inactive states

### 3.6 Project Detail Page
- [x] Create `app/projects/[slug]/page.tsx`
- [x] Fetch project by slug (mock data)
- [x] Implement 25/75 layout (image + title left, content right)
- [ ] Render rich text blog content (placeholder only)
- [x] Display tags and category badges
- [x] Add external link if present
- [x] Add back navigation

### 3.7 Contact Modal
- [x] Create `ContactModal.tsx` (client component)
- [x] Implement modal open/close based on URL (`/contact`)
- [x] Create form with name, email, subject, message
- [x] Handle form submission (mock)
- [x] Show success/error states
- [x] Auto‑close after success

### 3.8 Responsive Design
- [x] Implement mobile layout (stacked sidebar, 1‑column grid)
- [ ] Test breakpoints: 640px, 768px, 1024px, 1280px
- [ ] Adjust typography and spacing for mobile

### 3.9 404 Page
- [x] Create `not-found.tsx` with styled 404 message

## Phase 4: Integration & Testing

### 4.1 Data Fetching
- [ ] Test Payload API connectivity from Next.js
- [ ] Implement caching strategy (ISR or cache)
- [ ] Handle loading states (skeleton screens)

### 4.2 Form Handling
- [ ] Test contact form submission end‑to‑end
- [ ] Verify email delivery
- [ ] Add validation and error handling

### 4.3 Image Optimization
- [ ] Test Next.js Image with Payload media
- [ ] Configure proper `sizes` prop for grid
- [ ] Verify lazy loading for below‑fold images

### 4.4 Accessibility Audit
- [ ] Check color contrast ratios
- [ ] Test keyboard navigation
- [ ] Add ARIA labels where needed
- [ ] Verify focus management in modal

### 4.5 Performance
- [ ] Run Lighthouse audit
- [ ] Optimize bundle size
- [ ] Implement dynamic imports for heavy components

## Phase 5: Deployment

### 5.1 CMS Deployment
- [ ] Choose hosting (Render, Fly.io, Vercel)
- [ ] Set up MongoDB (Atlas or self‑hosted)
- [ ] Configure environment variables
- [ ] Run seed script on production
- [ ] Set up admin account

### 5.2 Frontend Deployment
- [ ] Export as static site and upload to DreamHost static hosting
- [ ] Set `NEXT_PUBLIC_PAYLOAD_URL` to production CMS
- [ ] Configure custom domain (optional)
- [ ] Set up SSL

### 5.3 Production Configuration
- [ ] Update `next.config.js` image domains
- [ ] Configure CORS on Payload (if needed)
- [ ] Set up logging and monitoring
- [ ] Implement backups for CMS data

## Phase 6: Content Population

### 6.1 Initial Content
- [ ] Upload real project images (replace placeholders)
- [ ] Write actual project descriptions
- [ ] Create real blog posts for select projects
- [ ] Update About section with real bio and photo
- [ ] Set up contact email address

### 6.2 SEO & Metadata
- [ ] Set page titles and descriptions
- [ ] Add Open Graph tags
- [ ] Create sitemap.xml
- [ ] Add robots.txt

## Phase 7: Polish & Launch

### 7.1 UI Refinements
- [ ] Fine‑tune hover animations
- [ ] Adjust spacing and typography
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices

### 7.2 Documentation
- [ ] Write README with setup instructions
- [ ] Document CMS usage for content updates
- [ ] Create deployment guide

### 7.3 Launch Checklist
- [ ] Remove all placeholder content
- [ ] Test all links and forms
- [ ] Verify analytics setup
- [ ] Share with beta users for feedback
- [ ] Launch! 🚀

## Optional Enhancements (Future)

- [ ] Dark mode toggle
- [ ] Search functionality
- [ ] Project filtering by tags
- [ ] Related projects suggestions
- [ ] Newsletter subscription
- [ ] Social media links in sidebar
- [ ] Project archive by year
- [ ] RSS feed for blog posts
- [ ] Comments on blog posts
- [ ] Performance monitoring (Vercel Analytics)

## Time Estimates

| Phase | Estimated Time |
|-------|----------------|
| 1. Project Setup | 2‑3 hours |
| 2. CMS Development | 4‑6 hours |
| 3. Frontend Development | 8‑12 hours |
| 4. Integration & Testing | 3‑5 hours |
| 5. Deployment | 2‑4 hours |
| 6. Content Population | 2‑4 hours |
| 7. Polish & Launch | 3‑5 hours |
| **Total** | **24‑39 hours**