import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/data/categories";
import { BottomSheet } from "@/components/BottomSheet";

export default async function ModalPage({
  params,
}: {
  params: Promise<{ category: string; project: string }>;
}) {
  const { category, project } = await params;
  const projectData = getProjectBySlug(category, project);

  if (!projectData) notFound();

  return <BottomSheet project={{ ...projectData, categorySlug: category }} />;
}
