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
    slug: "button",
    title: "Button",
    description: "버튼 관련 효과",
    projects: [
      {
        slug: "glassmorphism-button",
        title: "Glassmorphism button",
        description: "glassmorphism을 활용한 버튼",
        thumbnail: "/thumbnails/placeholder.png",
        tags: ["glassmorphism", "design", "button"],
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
