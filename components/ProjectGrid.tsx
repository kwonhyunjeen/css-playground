import { ProjectCard } from "@/components/ProjectCard";
import type { Demo } from "@/types";

export function ProjectGrid({ demos }: { demos: Demo[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {demos.map((demo) => (
        <ProjectCard key={demo.slug} demo={demo} />
      ))}
    </div>
  );
}
