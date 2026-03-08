import { ProjectGrid } from "@/components/ProjectGrid";
import { categories } from "@/data/categories";

const allProjects = categories.flatMap((cat) =>
  cat.projects.map((project) => ({ ...project, categorySlug: cat.slug })),
);

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="flex flex-col items-center space-y-3 text-center">
        <h1 className="text-8xl font-bold tracking-tight">
          CSS & JS ANIMATIONS
        </h1>
        {/* TODO: Update description */}
        <p className="max-w-xl text-xl font-light text-gray-600 dark:text-gray-400">
          A personal collection of CSS and JavaScript animation experiments —
          clip-path, transforms, scroll effects, SVG, and more.
        </p>
      </section>
      <ProjectGrid projects={allProjects} />
    </div>
  );
}
