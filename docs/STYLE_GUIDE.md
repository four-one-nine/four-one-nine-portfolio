# Style Guide

## Colors

| Name         | Hex       | Usage                              |
|--------------|-----------|------------------------------------|
| Primary      | `#DDD92A` | Accents, borders, highlights       |
| Dark         | `#373737` | Backgrounds, text, sidebar         |
| Light        | `#DDD92A` | Main background, card backgrounds, hover states     |
| White        | `#FFFFFF` | Text on dark backgrounds           |
| Muted Gray   | `#888888` | Secondary text, placeholder        |

**Default palette in Tailwind:**

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#DDD92A',
        dark: '#373737',
        light: '#DDD92A',
        muted: '#888888',
      },
    },
  },
}
```

## Typography

| Element   | Font Family          | Weight | Size        | Line Height | Color  |
|-----------|----------------------|--------|-------------|-------------|--------|
| H1        | `'JetBrains Mono'`   | 700    | 2.5rem      | 1.2         | Dark   |
| H2        | `'JetBrains Mono'`   | 600    | 2rem        | 1.25        | Dark   |
| H3        | `'JetBrains Mono'`   | 600    | 1.5rem      | 1.3         | Dark   |
| Body      | `'Inter'`            | 400    | 1rem        | 1.6         | Dark   |
| Small     | `'Inter'`            | 400    | 0.875rem    | 1.5         | Muted  |

**Google Fonts import:**

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
```

**Tailwind config:**

```typescript
export default {
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
}
```

## Layout Grid

### Desktop (≥1024px)

- **Sidebar**: 25% width (`w-1/4`), fixed height (`h-screen`), dark background.
- **Main**: 75% width (`w-3/4`), light background.
- **Project Grid**: 3 columns (`grid-cols-3`), 1‑2 column spans per item.

```css
/* Layout classes */
<div class="flex min-h-screen">
  <aside class="w-1/4 bg-dark text-white p-6 flex flex-col">
    <!-- Logo, photo, blurb, contact link -->
  </aside>
  <main class="w-3/4 bg-light p-8">
    <!-- Project grid -->
  </main>
</div>
```

### Mobile (<1024px)

- **Sidebar**: Stacked above main, 100% width.
- **Project Grid**: 1 column (`grid-cols-1`).

```css
@media (max-width: 1023px) {
  .flex { flex-direction: column; }
  aside, main { width: 100%; }
  .grid { grid-template-columns: 1fr; }
}
```

## Project Grid

### Desktop Grid

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Some items span 2 columns -->
  <div class="col-span-1 lg:col-span-2">...</div>
  <!-- Others span 1 -->
  <div class="col-span-1">...</div>
</div>
```

### Varying Sizes (Random Pattern)

Use a predefined array of spans (e.g., `[2,1,1,2,1,2]`) to create a visual rhythm. In code:

```typescript
const spans = [2, 1, 1, 2, 1, 2, 1, 2, 1]; // repeat as needed
<div
  className={`col-span-1 ${spans[index % spans.length] === 2 ? 'lg:col-span-2' : ''}`}
>
  <ProjectCard project={project} />
</div>
```

## Hover Effect

**Desktop**: On hover, project image fades out and text overlay appears.

```css
.project-card:hover .project-image {
  opacity: 0;
}
.project-card:hover .project-overlay {
  opacity: 1;
}
```

**Tailwind classes:**

```html
<div class="project-card relative overflow-hidden rounded-xl">
  <img class="project-image transition-opacity duration-300" />
  <div class="project-overlay absolute inset-0 bg-dark bg-opacity-80 p-6 flex flex-col justify-center opacity-0 transition-opacity duration-300">
    <h3 class="text-primary font-mono text-xl mb-2">Project Title</h3>
    <p class="text-white text-sm mb-4">Short description...</p>
    <a href="/projects/slug" class="text-primary underline">Learn more</a>
  </div>
</div>
```

## Rounded Borders (Neo‑Aesthetic)

Use large rounded corners for images and cards:

```css
rounded-2xl   /* 1rem (16px) */
rounded-3xl   /* 1.5rem (24px) */
```

**Border styling** between sections:

```css
border border-primary/20   /* thin yellow border */
```

## Contact Modal

**Overlay**: Semi‑transparent dark background.

```html
<div class="fixed inset-0 bg-dark bg-opacity-90 z-50 flex items-center justify-center">
  <div class="bg-white rounded-2xl p-8 w-full max-w-md">
    <!-- Form -->
  </div>
</div>
```

## Responsive Breakpoints

Tailwind default breakpoints are sufficient:

| Prefix | Min Width | Typical Use         |
|--------|-----------|---------------------|
| `sm`   | 640px     | Mobile landscape    |
| `md`   | 768px     | Tablet              |
| `lg`   | 1024px    | Desktop sidebar     |
| `xl`   | 1280px    | Large desktop       |
| `2xl`  | 1536px    | Extra large         |

**Custom breakpoint** (optional):

```typescript
export default {
  theme: {
    screens: {
      'sidebar': '1024px', // when sidebar becomes 25%
    },
  },
}
```

## Animation & Transitions

- **Hover transitions**: `transition-all duration-300 ease-in-out`
- **Page transitions**: Use Next.js built‑in `loading.tsx` and `error.tsx`.
- **Scroll animations**: Consider `framer-motion` for entrance animations (optional).

## Dark Mode

Not required; site uses fixed colors. If needed later, extend Tailwind's `darkMode` strategy.

## Example Component: Project Card

```tsx
export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="project-card relative overflow-hidden rounded-2xl aspect-[4/3]">
      <img
        src={project.featuredImage.url}
        alt={project.title}
        className="project-image w-full h-full object-cover transition-opacity duration-300"
      />
      <div className="project-overlay absolute inset-0 bg-dark bg-opacity-80 p-6 flex flex-col justify-center opacity-0 transition-opacity duration-300">
        <h3 className="text-primary font-mono text-xl mb-2">{project.title}</h3>
        <p className="text-white text-sm mb-4 line-clamp-3">{project.description}</p>
        <a href={`/projects/${project.slug}`} className="text-primary underline font-medium">
          Learn more
        </a>
      </div>
    </div>
  );
}
```

## Spacing Scale

Tailwind default spacing is used. Key values:

- **Section padding**: `p-8` (2rem) on desktop, `p-4` (1rem) on mobile.
- **Grid gap**: `gap-6` (1.5rem).
- **Sidebar internal gaps**: `space-y-8` (2rem) between subsections.

## Focus & Accessibility

- **Focus rings**: `focus:outline-none focus:ring-2 focus:ring-primary`
- **Contrast**: Ensure text meets WCAG AA (dark on light, light on dark).
- **Alt text**: Required for all images.

## Code Snippets for Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#DDD92A',
        dark: '#373737',
        light: '#DDD92A',
        muted: '#888888',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
export default config
```

## Next.js Global CSS

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

body {
  @apply font-sans text-dark bg-light;
}

h1, h2, h3, h4, h5, h6 {
  @apply font-mono font-bold;
}
```