import type { Category, Project } from "@/types";

export const categories: Category[] = [
  {
    slug: "interaction",
    title: "Interaction",
    description: "마우스 인터랙션을 활용한 다양한 효과",
    projects: [
      {
        slug: "drag-with-spring",
        title: "Drag Spring Grid",
        description: "드래그 시 스프링 물리 효과로 반응하는 그리드 인터랙션",
        thumbnail: {
          type: "iframe",
          src: "/demos/interaction/drag-with-spring/index.html",
        },
        tags: ["drag", "spring", "grid", "interaction"],
      },
      {
        slug: "dots-menu",
        title: "Dots Menu Animation",
        description:
          "9개 점 메뉴를 hover하면 사방으로 아이콘이 펼쳐지는 애니메이션",
        thumbnail: {
          type: "iframe",
          src: "/demos/interaction/dots-menu/index.html",
        },
        tags: ["interaction", "hover"],
      },
      {
        slug: "drag-with-snake",
        title: "Drag Snake",
        description: "마우스를 드래그하면 뱀처럼 따라오는 인터랙션",
        thumbnail: {
          type: "iframe",
          src: "/demos/interaction/drag-with-snake/index.html",
        },
        tags: ["interaction", "hover"],
      },
      {
        slug: "product-card",
        title: "Product Card",
        description: "Product card effect using CSS transform",
        thumbnail: {
          type: "iframe",
          src: "/demos/interaction/product-card/index.html",
        },
        tags: ["interaction", "card", "hover"],
      },
      {
        slug: "ticker-cursor",
        title: "Ticker Cursor",
        description: "마우스 커서에 텍스트가 따라오는 효과",
        thumbnail: {
          type: "iframe",
          src: "/demos/interaction/ticker-cursor/index.html",
        },
        tags: ["interaction", "cursor", "hover"],
      },
    ],
  },
  {
    slug: "animation",
    title: "Animation",
    description: "애니메이션 효과",
    projects: [
      {
        slug: "3d-flip-card",
        title: "3D Flip Card",
        description: "3D flip card effect using CSS transform",
        thumbnail: {
          type: "iframe",
          src: "/demos/animation/3d-flip-card/index.html",
        },
        tags: ["animation", "hover"],
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
      {
        slug: "acoordion",
        title: "Accordion",
        description: "Accordion effect using CSS transform",
        thumbnail: {
          type: "iframe",
          src: "/demos/glassmorphism/acoordion/index.html",
        },
        tags: ["glassmorphism"],
      },
    ],
  },
  {
    slug: "button",
    title: "Button Effects",
    description: "CSS로 구현한 다양한 버튼 애니메이션 효과",
    projects: [
      {
        slug: "draw-line",
        title: "Draw Line Button",
        description: "Draw line button effect using CSS transform",
        thumbnail: {
          type: "iframe",
          src: "/demos/button/draw-line/index.html",
        },
        tags: ["button", "hover", "animation"],
      },
      {
        slug: "wavy",
        title: "Wave Effect Button",
        description:
          "hover 시간에 따라 파도 레이어가 순차적으로 버튼을 채워가는 효과",
        thumbnail: {
          type: "video",
          src: "/thumbnails/wavy.mov",
        },
        tags: ["button", "hover", "animation"],
      },
      {
        slug: "floating",
        title: "Floating Action Button",
        description: "Floating action button effect using CSS transform",
        thumbnail: {
          type: "iframe",
          src: "/demos/button/floating/index.html",
        },
        tags: ["button", "hover", "animation"],
      },
    ],
  },
  {
    slug: "text",
    title: "Text Effects",
    description: "텍스트를 활용한 다양한 시각 효과",
    projects: [
      {
        slug: "text-explode",
        title: "Text Explode",
        description: "텍스트 클릭 시 랜덤으로 흩어지는 효과",
        thumbnail: {
          type: "iframe",
          src: "/demos/text/text-explode/index.html",
        },
        tags: ["text", "animation", "particle"],
      },
      {
        slug: "text-smoky",
        title: "Text Smoky",
        description: "텍스트 hover 시 스모키한 효과를 주는 애니메이션",
        thumbnail: {
          type: "iframe",
          src: "/demos/text/text-smoky/index.html",
        },
        tags: ["text", "hover", "animation"],
      },
    ],
  },
  {
    slug: "scroll",
    title: "Scroll Animation",
    description: "JavaScript로 구현한 스크롤 기반 애니메이션",
    projects: [
      {
        slug: "scroll-01",
        title: "Scroll Animation",
        description: "스크롤에 따라 카드가 쌓이며 전환되는 풀스크린 효과",
        thumbnail: {
          type: "iframe",
          src: "/demos/scroll/scroll-01/index.html",
        },
        tags: ["scroll", "animation"],
      },
      {
        slug: "particle-morph",
        title: "Particle Morph",
        description: "스크롤과 마우스 인터랙션을 활용한 파티클 애니메이션",
        thumbnail: {
          type: "iframe",
          src: "/demos/scroll/particle-morph/index.html",
        },
        tags: ["scroll", "animation", "particle"],
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
