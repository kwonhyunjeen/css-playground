import Image from "next/image";
import type { FlatProject } from "@/types";

interface ProjectCardProps {
  project: FlatProject;
  onClick: (project: FlatProject) => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <button onClick={() => onClick(project)} className="w-full text-left">
      <div className="group relative overflow-hidden rounded-lg">
        <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-900">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 flex gap-2 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {project.tags.map((tag) => (
            <span key={tag} className="text-md font-light text-white uppercase">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm font-medium">{project.title}</p>
    </button>
  );
}
