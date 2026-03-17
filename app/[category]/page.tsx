import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories, getCategoryBySlug } from "@/data/categories";
import { ProjectGrid } from "@/components/ProjectGrid";

export function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  return {
    title: `${cat.title} | CSS Playground`,
    description: cat.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const projects = cat.projects.map((p) => ({
    ...p,
    categorySlug: cat.slug,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">{cat.title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {cat.description}
        </p>
      </div>
      <ProjectGrid projects={projects} />
    </div>
  );
}
