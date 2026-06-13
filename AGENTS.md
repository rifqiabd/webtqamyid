# AGENTS.md — Pondok Pesantren Thibbil Qulub Assimbani

Greenfield Astro + TypeScript + Tailwind project. This file captures decisions that are **not obvious from tooling defaults**.

## Stack & Commands

| Action | Command |
|---|---|
| dev server | `npm run dev` |
| build (static) | `npm run build` |
| preview build | `npm run preview` |
| typecheck | `npx astro check` |
| lint | `npx eslint . --ext .ts,.astro` |
| format | `npx prettier --write .` |

**Build output** goes to `dist/`. Serv00 expects files at `dist/` — deploy by rsync/SFTP `dist/*` to Serv00's `public_html/`.

## Architecture

```
src/
  content/          # Astro Content Collections (MDX)
    news/           #   news-*.mdx
    programs/       #   program-*.mdx
    gallery/        #   gallery-*.mdx
    education/      #   education-unit-*.mdx
  components/       # Reusable Astro components
    ui/             #   Design-system primitives
    layout/         #   Header, Footer, Navigation
    sections/       #   Page section components
    content/        #   MDX rendering wrappers
  layouts/          # Base layouts (BaseLayout, NewsLayout, etc.)
  pages/            # File-based routing (all .astro, no SSR)
  styles/           # globals.css (Tailwind layers + custom tokens)
  config.ts         # Site-wide config (title, description, SEO)
  content.config.ts # Content Collections schemas
docs/               # Design documentation (created before implementation)
```

## Design Influence Synthesis

| Source | Weight | What it contributes |
|---|---|---|
| **Notion** | 50% | Warm neutrals (#37352f text, #f6f5f4 surfaces), generous body leading (1.55), 4px base spacing, 8px button radius (rectangles not pills), 12px card radius, pastel tinted surface variants, content-first minimal chrome, borders over shadows |
| **Vercel** | 30% | Monochrome precision, aggressive negative letter-spacing on displays (-2px to -0.5px), tight display leading (1.05–1.15), generous section spacing (96–120px), stacked subtle shadows, high contrast, no decorative color |
| **MongoDB** | 20% | Dual-mode dark hero + light content, accent color reserved for primary CTAs only, 500-weight display headings (lighter voice), pill-shaped CTAs for admission buttons, dark teal footer |

**Critical rule**: Color appears ONLY when carrying meaning (CTAs, links, status). No decorative color. The brand green appears on primary buttons only; warm gold on accents only.

## Design Tokens (Tailwind Theme Extension)

```js
// tailwind.config.mjs — these override defaults
colors: {
  brand: {
    green:  { DEFAULT: '#1a7a4c', light: '#e8f5ee', dark: '#0d4d2e' },
    gold:   { DEFAULT: '#c8a45c', light: '#faf3e4', dark: '#8a6e34' },
  },
  neutral: {
    50:  '#fafaf9',  // canvas (warm off-white — Notion principle)
    100: '#f6f5f4',  // surface
    200: '#ede9e4',  // hairline soft
    300: '#e5e3df',  // hairline
    400: '#c8c4be',  // hairline strong
    500: '#a4a097',  // muted
    600: '#787671',  // stone / steel
    700: '#5d5b54',  // slate
    800: '#37352f',  // charcoal / body — Notion's signature warm charcoal
    900: '#1a1a1a',  // ink
    950: '#0a0a0a',  // ink deep
  },
}
```

**Typography scale** (extend `fontSize`):

| Token | Size/LineH | LtrSpacing | Use |
|---|---|---|---|
| `display-xl` | `4rem/1.05` | `-2px` | Hero headline |
| `display-lg` | `3rem/1.10` | `-1px` | Section openers |
| `heading-1` | `2.5rem/1.15` | `-0.5px` | Page H1 |
| `heading-2` | `2rem/1.20` | `-0.5px` | Section H2 |
| `heading-3` | `1.5rem/1.25` | `0` | Card titles |
| `body` | `1rem/1.55` | `0` | Body — generous leading |
| `body-sm` | `0.875rem/1.50` | `0` | Secondary text |
| `caption` | `0.8125rem/1.40` | `0` | Labels |

**Spacing**: 4px base → `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96, 120, 192`.
**Sections**: `py-24` (96px) default, `py-16` (64px) on dense pages, `py-32` (128px) on hero.

## Non-Obvious Conventions

- **All `.astro` files use TypeScript** — `<script lang="ts">`, `---` frontmatter with TS.
- **No `.jsx`/`.tsx`** — use Astro components only. Interactive islands use `client:load` with minimal vanilla JS.
- **MDX in Content Collections** — schema lives in `src/content.config.ts` (not `astro:content` deprecated pattern). Each collection has `title`, `description`, `date`, `image`, `slug`, `tags`.
- **Dark mode**: `class` strategy on `<html>` via Tailwind `darkMode: 'class'`. Toggle stored in `localStorage`, respected as `prefers-color-scheme`.
- **All images** use Astro's `<Image />` or `<Picture />` components via `@astrojs/image`. No raw `<img>` tags.
- **CSS**: Tailwind utility-first. Custom CSS only for `@layer base` typography defaults. No CSS modules, no styled-components.
- **Font**: Inter (Notion principle — humanist geometric) loaded via `@fontsource/inter`. Mono: JetBrains Mono for code blocks.

## Content Collections Schemas (src/content.config.ts)

```ts
// ALL collections use this pattern — no exceptions
import { defineCollection, z } from 'astro:content'

const newsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    published: z.boolean().default(true),
  }),
})
```

## SEO Requirements (Every Page)

- `<title>`: `{pageTitle} — Pondok Pesantren Thibbil Qulub Assimbani`
- `<meta name="description">`: unique per page (no shared default)
- `og:title`, `og:description`, `og:image`, `og:type`
- JSON-LD structured data (`EducationalOrganization` for institution, `Article` for news, `Course` for programs)
- `<link rel="canonical">`
- Sitemap auto-generated via `@astrojs/sitemap`
- RSS feed for news via `@astrojs/rss`

## Component Architecture

```
components/
  ui/         # Atoms — Button, Card, Badge, Input, Icon, Tag
  layout/     # Molecules — Header (sticky, blur), Footer (dark teal), Navigation (mobile hamburger + desktop)
  sections/   # Organisms — HeroSection, ValuesSection, StatsSection, NewsGrid, GalleryGrid
  content/    # Content renderers — MDXRenderer, NewsCard, ProgramCard, GalleryItem
```

Every UI component:
- Uses `interface Props` with TypeScript in `---` frontmatter
- Supports `class:` passthrough for parent override
- Has `data-` attributes for testing
- Exports nothing; each is a single `.astro` file

## Page Structure & Sections

| Page | Required Sections |
|---|---|
| `/` (Home) | Hero, Introduction, Core Values (4 values as cards), Education Units, Programs overview, Statistics counters, Latest News (3 items), Gallery preview (6 items), Admission CTA |
| `/about` | Hero (small), History, Founder bio, Vision & Mission (list), Organizational structure (tree/cards) |
| `/education` | Unit cards (3), each linking to `/education/:slug` |
| `/programs` | Program grid (6 cards: Tahfidz, Kajian Kitab, Bahasa Arab, Bahasa Inggris, TI, Kepemimpinan) |
| `/news` | Content Collections list with pagination, category filters |
| `/gallery` | Filterable grid (categories: activities, facilities, events), lightbox on click |
| `/ppdb` | Requirements list, process steps, fee table, download links, registration CTA |
| `/contact` | Address card, WhatsApp link (wa.me), email, Google Maps embed, social icons |

## Avoid (Anti-Patterns)

- **No Bootstrap** — Tailwind only, no `container`, `row`, `col-*` classes
- **No heavy gradients** — no multi-stop gradient backgrounds (anti-Vercel principle applied differently)
- **No excessive shadows** — use `shadow-sm` at most; prefer `border` for card definition (Notion principle)
- **No decorative Islamic ornaments** — typography IS the ornament
- **No generic stock photos** — use real institution photos or nothing
- **No carousels/autoplay sliders** — static grid layouts only
- **No corporate buzzwords** — "synergy", "leverage", "cutting-edge" are banned

## Institution Values → Visual Translation

| Value | Design Manifestation |
|---|---|
| Religius | Deep Islamic green primary, gold accent for sacred elements |
| Cinta Sholawat | Warm gold used sparingly for call-to-action and highlights |
| Berkualitas | Premium typography, generous whitespace, careful alignment |
| Santun | Rounded but not playful, calm color scheme, polite tone of voice |

## Serv00 Deployment

- Static output only (`output: 'static'` in `astro.config.mjs`)
- No SSR, no Astro islands requiring Node server
- `npm run build` → `dist/` → SFTP/rsync to Serv00 `~/public_html/`
- Serv00 runs Apache — ensure `dist/.htaccess` is generated for clean URLs (or use `404.html` fallback)
- No environment variables needed for production; all public content

## First-Time Setup

```bash
npm create astro@latest -- --template minimal --typescript
npm install @astrojs/tailwind @astrojs/mdx @astrojs/sitemap @astrojs/rss
npm install @fontsource/inter @fontsource/jetbrains-mono
npm install tailwindcss @tailwindcss/typography
```

Then: `src/content.config.ts` → `src/config.ts` → Tailwind theme → design docs → layouts → components → pages → content.
