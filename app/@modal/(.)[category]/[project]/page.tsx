import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/data/categories";
import { ProjectModal } from "@/components/ProjectModal";

export default async function ModalPage({
  params,
}: {
  params: Promise<{ category: string; project: string }>;
}) {
  const { category, project } = await params;
  const projectData = getProjectBySlug(category, project);

  if (!projectData) notFound();

  return <ProjectModal project={{ ...projectData, categorySlug: category }} />;
}
