import Image from "next/image";
import Link from "next/link";
import type { Demo, Thumbnail } from "@/types";

function ThumbnailRenderer({
  thumbnail,
  title,
}: {
  thumbnail: Thumbnail;
  title: string;
}) {
  if (thumbnail.type === "iframe") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src={thumbnail.src}
          title={title}
          tabIndex={-1}
          className="pointer-events-none absolute top-0 left-0 h-[200%] w-[200%] origin-top-left scale-[0.5] border-none"
        />
      </div>
    );
  }

  if (thumbnail.type === "video") {
    return (
      <video
        src={thumbnail.src}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="absolute inset-4">
      <div className="relative h-full w-full">
        <Image
          src={thumbnail.src}
          alt={title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
    </div>
  );
}

export function ProjectCard({ demo }: { demo: Demo }) {
  return (
    <Link
      href={`/demos/${demo.slug}`}
      className="group/card w-full text-left focus-visible:outline-none"
    >
      <div className="group/image relative cursor-pointer overflow-hidden rounded-lg">
        <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-900">
          <ThumbnailRenderer thumbnail={demo.thumbnail} title={demo.title} />
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover/image:opacity-100" />
        <div className="absolute bottom-0 left-0 flex gap-2 p-5 opacity-0 transition-opacity duration-300 group-hover/image:opacity-100">
          {demo.tags.map((tag) => (
            <span key={tag} className="text-md font-light text-white uppercase">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm font-medium group-focus-visible/card:underline">
        {demo.title}
      </p>
    </Link>
  );
}
