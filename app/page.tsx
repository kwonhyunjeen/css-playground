import { ProjectGrid } from "@/components/ProjectGrid";
import { demos } from "@/data/demos";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.toLowerCase().trim() ?? "";

  const filtered = query
    ? demos.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.tags.some((t) => t.toLowerCase().includes(query)),
      )
    : demos;

  return (
    <div className="space-y-12">
      <section className="flex flex-col items-center space-y-3 text-center">
        <h1 className="text-8xl font-bold tracking-tight">
          CSS & JS ANIMATIONS
        </h1>
        <p className="max-w-xl text-xl font-light text-gray-600 dark:text-gray-400">
          A personal collection of CSS and JavaScript animation experiments —
          clip-path, transforms, scroll effects, SVG, and more.
        </p>
      </section>
      <ProjectGrid demos={filtered} />
    </div>
  );
}
