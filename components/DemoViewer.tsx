"use client";

interface DemoViewerProps {
  categorySlug: string;
  slug: string;
  hasDemo: boolean;
}

export function DemoViewer({ categorySlug, slug, hasDemo }: DemoViewerProps) {
  if (!hasDemo) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        Demo coming soon
      </div>
    );
  }

  return (
    <iframe
      src={`/demos/${categorySlug}/${slug}/index.html`}
      className="h-full w-full border-none"
      title={`${slug} demo`}
    />
  );
}
