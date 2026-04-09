import { Suspense } from "react";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ChipFilter } from "@/components/ChipFilter";
import { demos } from "@/data/demos";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const { q, tag } = await searchParams;
  const query = q?.toLowerCase().trim() ?? "";
  const activeTag = tag?.toLowerCase().trim() ?? "";

  const filtered = demos.filter((d) => {
    const matchesQuery =
      !query ||
      d.title.toLowerCase().includes(query) ||
      d.tags.some((t) => t.toLowerCase().includes(query));
    const matchesTag = !activeTag || d.tags.includes(activeTag);
    return matchesQuery && matchesTag;
  });

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
      <Suspense>
        <ChipFilter />
      </Suspense>
      <ProjectGrid demos={filtered} />
    </div>
  );
}
