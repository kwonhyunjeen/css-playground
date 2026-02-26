"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import type { FlatProject } from "@/types";

interface ProjectGridProps {
  projects: FlatProject[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [selected, setSelected] = useState<FlatProject | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard
            key={`${project.categorySlug}-${project.slug}`}
            project={project}
            onClick={setSelected}
          />
        ))}
      </div>
      {/* TODO: BottomSheet  */}
      {selected && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">
          {selected.title} selected —{" "}
          <button onClick={() => setSelected(null)} className="underline">
            close
          </button>
        </div>
      )}
    </>
  );
}
