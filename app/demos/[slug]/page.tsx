import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { demos, getDemoBySlug } from "@/data/demos";

export function generateStaticParams() {
  return demos.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const demo = getDemoBySlug(slug);
  if (!demo) return {};
  return {
    title: `${demo.title} | CSS Playground`,
    description: demo.description,
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const demo = getDemoBySlug(slug);
  if (!demo) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mt-1 text-4xl font-bold">{demo.title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {demo.description}
        </p>
        <div className="mt-3 flex gap-2">
          {demo.tags.map((tag) => (
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
          src={`/demos/${slug}/index.html`}
          className="h-full w-full border-none"
          title={demo.title}
        />
      </div>
    </div>
  );
}
