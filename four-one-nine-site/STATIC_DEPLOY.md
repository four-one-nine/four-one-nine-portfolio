# Static Deployment Guide

This setup allows you to run Payload CMS locally for content management while deploying a static version of your site to DreamHost or other static hosts.

## Workflow

1. **Local Development**: Run Payload locally to manage content
2. **Content Updates**: Make changes in the admin panel at `http://localhost:3000/admin`
3. **Build Static Site**: Export images and build static HTML
4. **Deploy**: Upload `out/` folder to DreamHost

## Setup

### 1. Prerequisites

- MongoDB running locally or accessible remotely
- Node.js 18+ and pnpm

### 2. Environment Variables

Create `.env` file:
```
DATABASE_URL=mongodb://127.0.0.1/your-database
PAYLOAD_SECRET=your-secret-here
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### 3. Running Locally

```bash
# Start Payload (requires MongoDB)
pnpm dev
```

Access:
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin

## Building Static Site

### Step 1: Start Payload

```bash
# In terminal 1
pnpm dev
```

### Step 2: Export images and build

```bash
# In terminal 2
pnpm run deploy:static
```

This runs:
1. `export:images` - Downloads all images from Payload to `public/images/`
2. `build:static` - Builds static HTML with `STATIC_EXPORT=true`

### Output

The static site is in the `out/` directory:
```
out/
├── index.html
├── images/
│   ├── image1.jpg
│   └── ...
├── posts/
│   └── [slug]/
│       └── index.html
├── projects/
│   └── [slug]/
│       └── index.html
├── _next/
│   └── static/
└── ...
```

## Deploying to DreamHost

### Option 1: FTP Upload

1. Connect via FTP to your DreamHost server
2. Upload contents of `out/` to your web directory
3. Navigate to your domain to see the site

### Option 2: SSH/rsync (Recommended)

```bash
rsync -avz --delete out/ user@yourserver.com:path/to/webroot/
```

## Updating Content

When you make content changes:

1. Update content in local Payload admin panel
2. Run `pnpm run deploy:static`
3. Upload new `out/` folder to DreamHost

## Troubleshooting

### Images not showing

- Run `pnpm run export:images` before building
- Check images exist in `public/images/`
- Verify `NEXT_PUBLIC_SERVER_URL` is set correctly

### Build fails

- Ensure Payload is running on localhost:3000
- Check MongoDB connection
- Verify all environment variables are set

### Missing pages

- Run `pnpm run generate:types` after schema changes
- Check that all projects have required fields (title, description, featuredImage)

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Local Machine  │     │   DreamHost     │
├─────────────────┤     ├─────────────────┤
│ MongoDB         │     │                 │
│ Payload CMS     │     │  Static HTML    │
│ Admin Panel     │────▶│  CSS/JS        │
│ Content API     │     │  Images         │
└─────────────────┘     └─────────────────┘
        │
        ▼
   Build Process
   - Fetch data
   - Export images
   - Generate HTML
```

## Notes

- The admin panel is NOT accessible on the static site
- All content changes require a rebuild and redeploy
- Images are stored in static files, not served from Payload