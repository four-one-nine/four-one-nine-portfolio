# Technical Overview

## Project Overview

**four.one.nine** is a personal portfolio website built with a modern stack: Payload CMS (headless) + Next.js (frontend). The site showcases a variety of work (creative and software) in a media‑forward grid layout with a yellow (#DDD92A) and dark gray (#373737) color scheme. Content is managed via Payload, enabling easy updates.

The project can be scaffolded using `npx create-payload-app`, which sets up a Next.js + Payload monorepo with all necessary configuration.

## Tech Stack

| Layer          | Technology                       |
|----------------|----------------------------------|
| Frontend       | Next.js 14 (App Router)          |
| Styling        | Tailwind CSS                     |
| CMS            | Payload 3.x                      |
| Database       | MongoDB (Payload default)        |
| Hosting        | DreamHost (static frontend) + Render/Fly (CMS) |
| Package Manager| pnpm (recommended)               |
| Language       | TypeScript                       |

## Monorepo Structure

```
four-one-nine-portfolio/
├── apps/
│   ├── web/          # Next.js frontend (public site)
│   └── cms/          # Payload CMS (admin + API)
├── packages/
│   ├── ui/           # Shared React component library (optional)
│   ├── eslint-config/
│   └── typescript-config/
├── package.json      # Root workspace config
├── pnpm-workspace.yaml
└── turbo.json        # Optional: Turborepo for builds
```

### `apps/web` (Next.js)

```
apps/web/
├── app/
│   ├── layout.tsx          # Root layout (sidebar + main)
│   ├── page.tsx            # Homepage (project grid)
│   ├── projects/
│   │   └── [slug]/
│   │       └── page.tsx    # Project detail (blog post)
│   ├── about/
│   │   └── page.tsx        # About page (optional – could be sidebar only)
│   └── contact/
│       └── page.tsx        # Contact form page
├── components/
│   ├── Sidebar.tsx
│   ├── ProjectGrid.tsx
│   ├── ProjectCard.tsx
│   ├── ContactForm.tsx
│   └── ui/                # Reusable UI primitives
├── lib/
│   ├── payload.ts         # Payload API client
│   └── utils.ts
├── public/
│   └── images/
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

### `apps/cms` (Payload)

```
apps/cms/
├── src/
│   ├── collections/
│   │   ├── Projects.ts
│   │   ├── Categories.ts
│   │   ├── About.ts
│   │   ├── Contact.ts
│   │   └── Media.ts
│   ├── globals/
│   │   └── SiteSettings.ts   # Optional: site‑wide settings
│   ├── access/
│   ├── hooks/
│   ├── endpoints/
│   │   └── contact.ts        # Custom contact‑form endpoint
│   ├── payload.config.ts
│   └── server.ts
├── .env
└── tsconfig.json
```

## Key Dependencies

### Frontend (`apps/web`)

```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "tailwindcss": "^3.4.0",
  "payload": "^3.0.0",
  "graphql": "^16.8.0",
  "@payloadcms/next": "^3.0.0"
}
```

### CMS (`apps/cms`)

```json
{
  "payload": "^3.0.0",
  "@payloadcms/db-mongodb": "^3.0.0",
  "@payloadcms/email-nodemailer": "^3.0.0",
  "dotenv": "^16.3.0"
}
```

## Environment Variables

### `apps/web/.env.local`

```env
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3001
PAYLOAD_SECRET=your‑secret‑here
```

### `apps/cms/.env`

```env
PAYLOAD_SECRET=your‑secret‑here
MONGODB_URI=mongodb://localhost:27017/four-one-nine
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASS=pass
```

## Data Flow

1. Admin creates **Projects** in Payload (with images, categories, blog content).
2. Next.js fetches data via **Payload REST/GraphQL API** (server‑side in Next.js).
3. Frontend renders grid; clicking a project routes to `/projects/[slug]`.
4. Contact form submits to a custom Payload endpoint → sends email via SMTP.

## Development Scripts

```bash
# Root (turbo)
pnpm dev          # runs both apps in parallel
pnpm build        # builds all packages
pnpm lint         # runs eslint across monorepo

# Individual apps
pnpm --filter web dev
pnpm --filter cms dev
```

## Deployment

1. **CMS**: Deploy the Payload CMS as a standalone Node.js service (Render, Fly.io, or similar). Alternatively, if using a single app, ensure CMS API routes are hosted on a Node.js server.
2. **Frontend**: Export as static site and upload to DreamHost static hosting. Use `next export` or configure `output: 'export'` in `next.config.js`. Since DreamHost lacks a command line, upload files via SFTP or Git integration.
3. Set environment variables for CMS deployment.
4. Ensure `NEXT_PUBLIC_PAYLOAD_URL` points to the deployed CMS URL (or use relative paths if CMS is on same domain).

## Additional Notes

- The monorepo is optional; you can also keep both apps in a single repo without workspaces.
- Payload 3.x uses the App Router pattern, so CMS admin is served from `/admin`.
- All images are stored locally via Payload’s Media collection; Next.js `<Image>` handles optimization.
- The sidebar (25%) and project grid (75%) layout is implemented via CSS Grid with Tailwind.
- Responsive breakpoints are defined in `STYLE_GUIDE.md`.