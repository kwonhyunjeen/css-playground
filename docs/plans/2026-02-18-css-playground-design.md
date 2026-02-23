# css-playground Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Next.js portfolio site that showcases CSS/JS animation learning projects, organized by category, with a live demo viewer.

**Architecture:** App Router with static generation (`generateStaticParams`) from a TypeScript data file. Left sidebar for categories, right card grid with GIF hover previews. Each project's demo files live in `public/demos/` and are served via iframe.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, pnpm, Vercel

---

## Context

- Project location: `~/Desktop/projects/css-playground`
- Each demo project = `public/demos/{category}/{project}/index.html` + `style.css` + `script.js`
- All project metadata lives in `data/categories.ts` — adding a project = adding an object to the array
- Dark mode default, light mode toggle via `localStorage`
- No external state management library needed

---

### Task 1: Create the Next.js project

**Files:**
- Create: `~/Desktop/projects/css-playground/` (new project)

**Step 1: Scaffold the project**

```bash
cd ~/Desktop/projects
pnpm create next-app@latest css-playground \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-turbopack
cd css-playground
```

**Step 2: Verify it runs**

```bash
pnpm dev
```

Expected: Server starts at http://localhost:3000

**Step 3: Stop the server (Ctrl+C), then clean boilerplate**

Remove the default content from `app/page.tsx` and `app/globals.css`.

`app/page.tsx`:
```tsx
export default function Home() {
  return <main>css-playground</main>
}
```

`app/globals.css` — keep only Tailwind directives:
```css
@import "tailwindcss";
```

**Step 4: Verify clean start**

```bash
pnpm dev
```

Expected: Page shows "css-playground"

**Step 5: Create docs directory and move plan file**

```bash
mkdir -p docs/plans
```

Copy this plan file into `docs/plans/2026-02-18-css-playground-design.md`.

**Step 6: Initial commit**

```bash
git add .
git commit -m "chore: scaffold Next.js project"
```

---

### Task 2: Create project structure

**Files:**
- Create: `types/index.ts`
- Create: `data/categories.ts`
- Create: `public/demos/.gitkeep`
- Create: `public/thumbnails/.gitkeep`

**Step 1: Create TypeScript types**

`types/index.ts`:
```ts
export interface Project {
  slug: string
  title: string
  description: string
  thumbnail: string // path relative to /public, e.g. "/thumbnails/circle-reveal.gif"
  tags: string[]
}

export interface Category {
  slug: string
  title: string
  description: string
  projects: Project[]
}
```

**Step 2: Create data file with sample entries**

`data/categories.ts`:
```ts
import type { Category } from "@/types"

export const categories: Category[] = [
  {
    slug: "clip-path",
    title: "CSS Clip Path",
    description: "clip-path 속성을 활용한 다양한 시각 효과",
    projects: [
      {
        slug: "circle-reveal",
        title: "Circle Reveal",
        description: "clip-path: circle()을 활용한 이미지 공개 효과",
        thumbnail: "/thumbnails/placeholder.png",
        tags: ["clip-path", "hover", "transition"],
      },
      {
        slug: "polygon-gallery",
        title: "Polygon Gallery",
        description: "다각형 클리핑으로 만든 이미지 갤러리",
        thumbnail: "/thumbnails/placeholder.png",
        tags: ["clip-path", "polygon"],
      },
    ],
  },
  {
    slug: "card-effects",
    title: "Card Effects",
    description: "CSS transform과 perspective를 활용한 카드 효과",
    projects: [
      {
        slug: "flip-card",
        title: "3D Flip Card",
        description: "perspective와 rotateY를 활용한 카드 뒤집기",
        thumbnail: "/thumbnails/placeholder.png",
        tags: ["transform", "perspective", "hover"],
      },
    ],
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function getProjectBySlug(
  categorySlug: string,
  projectSlug: string
): Project | undefined {
  return getCategoryBySlug(categorySlug)?.projects.find(
    (p) => p.slug === projectSlug
  )
}
```

**Step 3: Add a placeholder thumbnail**

Create a 400x300 placeholder image at `public/thumbnails/placeholder.png`.
(Any small PNG works for now — replace with real GIFs later)

**Step 4: Create placeholder demo directories**

```bash
mkdir -p public/demos/clip-path/circle-reveal
touch public/demos/clip-path/circle-reveal/index.html
touch public/demos/clip-path/circle-reveal/style.css
touch public/demos/clip-path/circle-reveal/script.js
```

`public/demos/clip-path/circle-reveal/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Circle Reveal</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>Circle Reveal Demo</h1>
  <script src="script.js"></script>
</body>
</html>
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add types, sample data, and placeholder demo"
```

---

### Task 3: Theme system (dark/light toggle)

**Files:**
- Create: `components/ThemeProvider.tsx`
- Create: `hooks/useTheme.ts`
- Modify: `app/layout.tsx`

**Step 1: Create theme hook**

`hooks/useTheme.ts`:
```ts
"use client"

import { useEffect, useState } from "react"

type Theme = "dark" | "light"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored) setTheme(stored)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"))

  return { theme, toggle }
}
```

**Step 2: Create ThemeProvider (sets initial class before hydration)**

`components/ThemeProvider.tsx`:
```tsx
"use client"

import { useEffect } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = localStorage.getItem("theme") ?? "dark"
    document.documentElement.classList.toggle("dark", stored === "dark")
  }, [])

  return <>{children}</>
}
```

**Step 3: Configure Tailwind for dark mode**

In `app/globals.css`, add:
```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

**Step 4: Wrap layout with ThemeProvider**

`app/layout.tsx`:
```tsx
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/ThemeProvider"
import "./globals.css"

export const metadata: Metadata = {
  title: "css-playground",
  description: "CSS & JS 애니메이션 학습 포트폴리오",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

**Step 5: Verify dark mode class toggles**

```bash
pnpm dev
```

Open browser console and run:
```js
document.documentElement.classList.contains('dark') // should be true
```

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add dark/light theme system"
```

---

### Task 4: Header component

**Files:**
- Create: `components/Header.tsx`
- Modify: `app/layout.tsx`

**Step 1: Create Header with title and theme toggle**

`components/Header.tsx`:
```tsx
"use client"

import { useTheme } from "@/hooks/useTheme"

export function Header() {
  const { theme, toggle } = useTheme()

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
      <h1 className="text-xl font-semibold tracking-tight">css-playground</h1>
      <button
        onClick={toggle}
        aria-label="테마 전환"
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </header>
  )
}
```

**Step 2: Add Header to layout**

`app/layout.tsx`:
```tsx
import type { Metadata } from "next"
import { Header } from "@/components/Header"
import { ThemeProvider } from "@/components/ThemeProvider"
import "./globals.css"

export const metadata: Metadata = {
  title: "css-playground",
  description: "CSS & JS 애니메이션 학습 포트폴리오",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Step 3: Verify header renders and toggle works**

```bash
pnpm dev
```

Expected: Header visible, toggle button switches dark/light mode.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add Header with theme toggle"
```

---

### Task 5: Sidebar component

**Files:**
- Create: `components/Sidebar.tsx`
- Modify: `app/layout.tsx`

**Step 1: Create Sidebar**

`components/Sidebar.tsx`:
```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { categories } from "@/data/categories"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (slug: string) => pathname.startsWith(`/${slug}`)
  const isHome = pathname === "/"

  return (
    <nav className="w-56 shrink-0 border-r border-gray-200 dark:border-gray-800 p-4">
      <ul className="space-y-1">
        <li>
          <Link
            href="/"
            className={`block px-3 py-2 rounded-md text-sm transition-colors ${
              isHome
                ? "bg-gray-100 dark:bg-gray-800 font-medium"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            All
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/${cat.slug}`}
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                isActive(cat.slug)
                  ? "bg-gray-100 dark:bg-gray-800 font-medium"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {cat.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

**Step 2: Add Sidebar to layout with main content area**

`app/layout.tsx` — update the body structure:
```tsx
<div className="flex flex-col min-h-screen">
  <Header />
  <div className="flex flex-1 overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-y-auto p-6">
      {children}
    </main>
  </div>
</div>
```

**Step 3: Make sidebar sticky**

Update Sidebar wrapper in layout:
```tsx
<aside className="sticky top-0 h-[calc(100vh-57px)] overflow-y-auto">
  <Sidebar />
</aside>
```

(57px = header height, adjust if needed)

**Step 4: Verify sidebar links work**

```bash
pnpm dev
```

Expected: Sidebar shows "All", "CSS Clip Path", "Card Effects". Active item highlighted.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add Sidebar with category navigation"
```

---

### Task 6: ProjectCard component

**Files:**
- Create: `components/ProjectCard.tsx`

**Step 1: Create ProjectCard with hover GIF effect**

`components/ProjectCard.tsx`:
```tsx
import Link from "next/link"
import Image from "next/image"
import type { Project } from "@/types"

interface ProjectCardProps {
  project: Project
  categorySlug: string
}

export function ProjectCard({ project, categorySlug }: ProjectCardProps) {
  const href = `/${categorySlug}/${project.slug}`

  return (
    <Link href={href} className="group block rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm mb-1 truncate">{project.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
```

Note: GIF hover effect is achieved by using a GIF as the thumbnail — it auto-plays on hover because the browser loads the GIF. For static thumbnail + hover-to-GIF, you'd need two images. Start simple with GIF-only thumbnails.

**Step 2: Add image domain config if using external images**

`next.config.ts` — only needed if thumbnails are external URLs. Skip if using `/public`.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add ProjectCard component"
```

---

### Task 7: ProjectGrid component + main page

**Files:**
- Create: `components/ProjectGrid.tsx`
- Modify: `app/page.tsx`

**Step 1: Create ProjectGrid**

`components/ProjectGrid.tsx`:
```tsx
import { ProjectCard } from "@/components/ProjectCard"
import type { Category } from "@/types"

interface ProjectGridProps {
  categories: Category[]
}

export function ProjectGrid({ categories }: ProjectGridProps) {
  return (
    <div className="space-y-10">
      {categories.map((category) => (
        <section key={category.slug}>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{category.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {category.description}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.projects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                categorySlug={category.slug}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
```

**Step 2: Update main page**

`app/page.tsx`:
```tsx
import { ProjectGrid } from "@/components/ProjectGrid"
import { categories } from "@/data/categories"

export default function Home() {
  return <ProjectGrid categories={categories} />
}
```

**Step 3: Verify grid renders**

```bash
pnpm dev
```

Expected: Main page shows all categories with project cards.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add ProjectGrid and main page"
```

---

### Task 8: Category page

**Files:**
- Create: `app/[category]/page.tsx`

**Step 1: Create category page with static params**

`app/[category]/page.tsx`:
```tsx
import { notFound } from "next/navigation"
import { ProjectGrid } from "@/components/ProjectGrid"
import { categories, getCategoryBySlug } from "@/data/categories"

interface Props {
  params: Promise<{ category: string }>
}

export function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }))
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params
  const category = getCategoryBySlug(categorySlug)

  if (!category) notFound()

  return <ProjectGrid categories={[category]} />
}
```

**Step 2: Verify category page**

```bash
pnpm dev
```

Navigate to `/clip-path` — should show only Clip Path projects.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add category page with static generation"
```

---

### Task 9: Project detail page with live demo

**Files:**
- Create: `components/DemoViewer.tsx`
- Create: `app/[category]/[project]/page.tsx`

**Step 1: Create DemoViewer**

`components/DemoViewer.tsx`:
```tsx
interface DemoViewerProps {
  src: string
  title: string
}

export function DemoViewer({ src, title }: DemoViewerProps) {
  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
      <iframe
        src={src}
        title={title}
        className="w-full h-[500px]"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  )
}
```

**Step 2: Create project detail page**

`app/[category]/[project]/page.tsx`:
```tsx
import Link from "next/link"
import { notFound } from "next/navigation"
import { DemoViewer } from "@/components/DemoViewer"
import { categories, getCategoryBySlug, getProjectBySlug } from "@/data/categories"

interface Props {
  params: Promise<{ category: string; project: string }>
}

export function generateStaticParams() {
  return categories.flatMap((cat) =>
    cat.projects.map((proj) => ({
      category: cat.slug,
      project: proj.slug,
    }))
  )
}

export default async function ProjectPage({ params }: Props) {
  const { category: categorySlug, project: projectSlug } = await params

  const category = getCategoryBySlug(categorySlug)
  const project = getProjectBySlug(categorySlug, projectSlug)

  if (!category || !project) notFound()

  const demoSrc = `/demos/${categorySlug}/${projectSlug}/index.html`

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/${categorySlug}`}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          ← {category.title}
        </Link>
        <h1 className="text-2xl font-semibold mt-2">{project.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {project.description}
        </p>
      </div>

      <DemoViewer src={demoSrc} title={project.title} />

      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
```

**Step 3: Verify detail page**

```bash
pnpm dev
```

Navigate to `/clip-path/circle-reveal` — should show demo iframe (blank for now) and project info.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add project detail page with iframe demo viewer"
```

---

### Task 10: Mobile responsive — category tabs

**Files:**
- Create: `components/CategoryTabs.tsx`
- Modify: `app/layout.tsx`

**Step 1: Create CategoryTabs for tablet/mobile**

`components/CategoryTabs.tsx`:
```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { categories } from "@/data/categories"

export function CategoryTabs() {
  const pathname = usePathname()
  const isActive = (slug: string) => pathname.startsWith(`/${slug}`)
  const isHome = pathname === "/"

  return (
    <nav className="flex gap-2 overflow-x-auto px-4 py-2 border-b border-gray-200 dark:border-gray-800 scrollbar-hide">
      <Link
        href="/"
        className={`shrink-0 px-3 py-1.5 rounded-full text-sm transition-colors ${
          isHome
            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
            : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/${cat.slug}`}
          className={`shrink-0 px-3 py-1.5 rounded-full text-sm transition-colors ${
            isActive(cat.slug)
              ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
              : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {cat.title}
        </Link>
      ))}
    </nav>
  )
}
```

**Step 2: Update layout to show sidebar on desktop, tabs on mobile**

`app/layout.tsx` — update body structure:
```tsx
<div className="flex flex-col min-h-screen">
  <Header />
  {/* Mobile/tablet tabs */}
  <div className="lg:hidden">
    <CategoryTabs />
  </div>
  {/* Desktop: sidebar + content */}
  <div className="flex flex-1 overflow-hidden">
    <aside className="hidden lg:block sticky top-0 h-[calc(100vh-57px)] overflow-y-auto">
      <Sidebar />
    </aside>
    <main className="flex-1 overflow-y-auto p-6">
      {children}
    </main>
  </div>
</div>
```

**Step 3: Verify responsive layout**

```bash
pnpm dev
```

Resize browser: desktop shows sidebar, mobile shows tabs.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add responsive category tabs for mobile"
```

---

### Task 11: Deploy to Vercel

**Step 1: Create GitHub repository**

```bash
gh repo create css-playground --public --source=. --remote=origin --push
```

Or manually via GitHub UI.

**Step 2: Deploy to Vercel**

```bash
pnpm dlx vercel
```

Follow prompts:
- Link to existing project? No
- Project name: css-playground
- Directory: ./
- Auto-detected Next.js settings: Yes

**Step 3: Verify production build locally first**

```bash
pnpm build
```

Expected: No errors. All static pages generated.

**Step 4: Set up automatic deploys**

Connect GitHub repo to Vercel dashboard for automatic deploys on push.

---

## Adding a New Project (Reference)

When you complete a new CSS/JS animation project:

1. Add files to `public/demos/{category}/{project}/`
   - `index.html`
   - `style.css`
   - `script.js`

2. Add a GIF thumbnail to `public/thumbnails/{slug}.gif`

3. Add entry to `data/categories.ts`:
   ```ts
   {
     slug: "my-new-project",
     title: "My New Project",
     description: "한 줄 설명",
     thumbnail: "/thumbnails/my-new-project.gif",
     tags: ["css", "animation"],
   }
   ```

4. `pnpm build` to verify no errors, then commit.

---

## Notes

- **Thumbnail GIFs**: Record screen with QuickTime → convert to GIF using tools like GIPHY Capture or ffmpeg
- **iframe sandbox**: `allow-scripts allow-same-origin` is sufficient for local demo files
- **New category**: Add object to `categories` array — sidebar and tabs update automatically
