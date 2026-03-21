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
        thumbnail: {
          type: "iframe",
          src: "/demos/clip-path/circle-reveal/index.html",
        },
        tags: ["clip-path", "hover", "transition"],
      },
      {
        slug: "polygon-gallery",
        title: "Polygon Gallery",
        description: "다각형 클리핑으로 만든 이미지 갤러리",
        thumbnail: { type: "img", src: "/thumbnails/placeholder.png" },
        tags: ["clip-path", "polygon"],
      },
    ],
  },
  {
    slug: "glassmorphism",
    title: "Glassmorphism",
    description: "backdrop-filter와 투명도를 활용한 유리 질감 UI 효과",
    projects: [
      {
        slug: "glassmorphism-tab-bar",
        title: "Glassmorphism Tab Bar",
        description:
          "CSS-only 탭 전환과 3단 레이어 유리 효과를 결합한 인터랙티브 패널",
        thumbnail: {
          type: "iframe",
          src: "/demos/glassmorphism/glassmorphism-tab-bar/index.html",
        },
        tags: ["glassmorphism"],
      },
    ],
  },
  {
    slug: "interaction",
    title: "Interaction",
    description: "hover, click 등 사용자 인터랙션을 활용한 UI 효과",
    projects: [
      {
        slug: "dots-menu",
        title: "Dots Menu Animation",
        description:
          "9개 점 메뉴를 hover하면 사방으로 아이콘이 펼쳐지는 애니메이션",
        thumbnail: {
          type: "iframe",
          src: "/demos/interaction/dots-menu/index.html",
        },
        tags: ["interaction", "hover", "animation"],
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
        thumbnail: { type: "img", src: "/thumbnails/placeholder.png" },
        tags: ["transform", "perspective", "hover"],
      },
      {
        slug: "hover-card",
        title: "Hover Card",
        description: "마우스 위치에 반응하는 3D 기울기 효과",
        thumbnail: { type: "img", src: "/thumbnails/placeholder.png" },
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
