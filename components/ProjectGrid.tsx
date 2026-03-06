"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { BottomSheet } from "@/components/BottomSheet";
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
      {selected && (
        <BottomSheet project={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
