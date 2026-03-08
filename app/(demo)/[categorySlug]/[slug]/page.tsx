import { existsSync } from "fs";
import { join } from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProjectBySlug } from "@/data/categories";
import { DemoViewer } from "@/components/DemoViewer";

interface Props {
  params: Promise<{ categorySlug: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, slug } = await params;
  const project = getProjectBySlug(categorySlug, slug);
  if (!project) return {};
  return { title: project.title };
}

export default async function DemoPage({ params }: Props) {
  const { categorySlug, slug } = await params;
  const project = getProjectBySlug(categorySlug, slug);

  if (!project) notFound();

  const hasDemo = existsSync(
    join(process.cwd(), "public", "demos", categorySlug, slug, "index.html"),
  );

  return (
    <div className="flex h-screen flex-col">
      <header className="flex shrink-0 items-center gap-4 border-b border-gray-200 px-6 py-3 dark:border-gray-800">
        <Link
          href="/"
          className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="font-medium">{project.title}</span>
        <div className="flex gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 uppercase dark:bg-gray-800 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>
      <main className="min-h-0 flex-1">
        <DemoViewer categorySlug={categorySlug} slug={slug} hasDemo={hasDemo} />
      </main>
    </div>
  );
}
