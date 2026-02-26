import type { Category, Project } from "@/types";

export const categories: Category[] = [
  {
    slug: "clip-path",
    title: "CSS Clip Path",
    description: "clip-path 속성을 활용한 다양한 시각 효과",
    projects: [
      {
        slug: "circle-reveal",
        title: "Circle Reveal",
        description: "clip-path: circle()을 활용한 이미지 공개 효과",
        thumbnail: "/thumbnails/placeholder.png",
        tags: ["clip-path", "hover", "transition"],
      },
      {
        slug: "polygon-gallery",
        title: "Polygon Gallery",
        description: "다각형 클리핑으로 만든 이미지 갤러리",
        thumbnail: "/thumbnails/placeholder.png",
        tags: ["clip-path", "polygon"],
      },
    ],
  },
  {
    slug: "card-effects",
    title: "Card Effects",
    description: "CSS transform과 perspective를 활용한 카드 효과",
    projects: [
      {
        slug: "flip-card",
        title: "3D Flip Card",
        description: "perspective와 rotateY를 활용한 카드 뒤집기",
        thumbnail: "/thumbnails/placeholder.png",
        tags: ["transform", "perspective", "hover"],
      },
      {
        slug: "hover-card",
        title: "3D Flip Card",
        description: "perspective와 rotateY를 활용한 카드 뒤집기",
        thumbnail: "/thumbnails/placeholder.png",
        tags: ["transform", "perspective", "hover"],
      },
    ],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProjectBySlug(
  categorySlug: string,
  projectSlug: string,
): Project | undefined {
  return getCategoryBySlug(categorySlug)?.projects.find(
    (p) => p.slug === projectSlug,
  );
}
