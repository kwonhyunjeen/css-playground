import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories, getProjectBySlug } from "@/data/categories";

export function generateStaticParams() {
  return categories.flatMap((cat) =>
    cat.projects.map((p) => ({ category: cat.slug, project: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; project: string }>;
}): Promise<Metadata> {
  const { category, project } = await params;
  const p = getProjectBySlug(category, project);
  if (!p) return {};
  return {
    title: `${p.title} | CSS Playground`,
    description: p.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ category: string; project: string }>;
}) {
  const { category, project } = await params;
  const p = getProjectBySlug(category, project);
  if (!p) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500 uppercase dark:text-gray-400">
          {category}
        </p>
        <h1 className="mt-1 text-4xl font-bold">{p.title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{p.description}</p>
        <div className="mt-3 flex gap-2">
          {p.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 uppercase dark:bg-gray-800 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="h-[80vh] w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <iframe
          src={`/demos/${category}/${project}/index.html`}
          className="h-full w-full border-none"
          title={p.title}
        />
      </div>
    </div>
  );
}
