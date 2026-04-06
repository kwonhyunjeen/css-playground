import { notFound } from "next/navigation";
import { getDemoBySlug } from "@/data/demos";
import { BottomSheet } from "@/components/BottomSheet";

export default async function ModalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const demo = getDemoBySlug(slug);

  if (!demo) notFound();

  return <BottomSheet demo={demo} />;
}
