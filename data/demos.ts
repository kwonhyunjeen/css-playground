import type { Demo } from "@/types";

export const demos: Demo[] = [
  {
    slug: "drag-with-spring",
    title: "Drag Spring Grid",
    description: "A grid that responds with spring physics when dragged.",
    thumbnail: {
      type: "iframe",
      src: "/demos/drag-with-spring/index.html",
    },
    tags: ["drag", "spring", "grid", "physics"],
  },

  {
    slug: "theme-switch",
    title: "Theme Switch",
    description:
      "Dark and light theme transition driven by a drag gesture and CSS custom properties.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/theme-switch.mov",
    },
    tags: ["theme", "drawer", "css variables"],
  },
  {
    slug: "product-card",
    title: "Product Card",
    description:
      "A 3D product card that rotates on hover using CSS perspective and transform.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/product-card.mov",
    },
    tags: ["card", "3d", "hover", "css transform"],
  },
  {
    slug: "drag-with-snake",
    title: "Drag Snake",
    description:
      "Cursor followers chained with spring physics, drawing a snake trail on canvas.",
    thumbnail: {
      type: "iframe",
      src: "/demos/drag-with-snake/index.html",
    },
    tags: ["drag", "spring", "canvas", "cursor"],
  },

  {
    slug: "tab-navigation",
    title: "Neumorphism Tab Navigation",
    description:
      "Soft UI tab bar built with neumorphic shadows and smooth transitions.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/tab-navigation.mov",
    },
    tags: ["neumorphism", "tab", "soft ui"],
  },
  {
    slug: "magnetic-motion",
    title: "Magnetic Motion",
    description:
      "Cards that respond to the cursor with magnetic attraction and repulsion.",
    thumbnail: {
      type: "iframe",
      src: "/demos/magnetic-motion/index.html",
    },
    tags: ["magnetic", "cursor", "physics"],
  },
  {
    slug: "glass-tab-bar",
    title: "Glassmorphism Tab Bar",
    description:
      "A CSS-only tab panel with three layers of glassmorphism and a 45° glass float effect on interaction.",
    thumbnail: {
      type: "iframe",
      src: "/demos/glass-tab-bar/index.html",
    },
    tags: ["glassmorphism", "ui components"],
  },
  {
    slug: "glass-accordion",
    title: "Glassmorphism Accordion",
    description:
      "An accordion with frosted glass styling, spring easing, and animated height transitions.",
    thumbnail: {
      type: "iframe",
      src: "/demos/glass-accordion/index.html",
    },
    tags: ["glassmorphism", "ui components"],
  },
  {
    slug: "floating-button",
    title: "Floating Action Button",
    description:
      "A CSS-only FAB that expands into action items with spring cubic-bezier animation.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/floating-button.mov",
    },
    tags: ["navigation", "button"],
  },
  {
    slug: "draw-line-button",
    title: "Draw Line Button",
    description:
      "A circular button where a border draws around the circumference on hover, with a pen icon orbiting alongside.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/draw-line-button.mov",
    },
    tags: ["button", "hover", "animation"],
  },
  {
    slug: "application-folder",
    title: "Application Folder",
    description:
      "A fluid glassmorphism folder featuring interactive drag-and-shift mechanics with natural spring physics.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/application-folder.mov",
    },
    tags: ["menu", "hover", "animation"],
  },
  {
    slug: "wave-button",
    title: "Wave Fill Button",
    description: "A button where wave layers sequentially fill in on hover.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/wavy-button.mov",
    },
    tags: ["button", "hover", "animation"],
  },
  {
    slug: "particle-morph",
    title: "Particle Morph",
    description:
      "Particles that morph between sphere, wave, and grid shapes driven by scroll and mouse.",
    thumbnail: {
      type: "iframe",
      src: "/demos/particle-morph/index.html",
    },
    tags: ["scroll", "particle", "canvas"],
  },
  {
    slug: "text-explode",
    title: "Text Explode",
    description:
      "Characters scatter as particles on click, then reassemble with a typing animation.",
    thumbnail: {
      type: "iframe",
      src: "/demos/text-explode/index.html",
    },
    tags: ["text", "particle", "animation"],
  },
  {
    slug: "text-smoky",
    title: "Text Smoky",
    description: "Text dissolves into a smoky effect on hover.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/smoky-text.mov",
    },
    tags: ["text", "hover", "animation"],
  },
  {
    slug: "scroll-cards",
    title: "Scroll Card Stack",
    description:
      "Full-screen cards that stack and transition as the user scrolls.",
    thumbnail: {
      type: "iframe",
      src: "/demos/scroll-cards/index.html",
    },
    tags: ["scroll", "trigger"],
  },
  {
    slug: "ticker-cursor",
    title: "Ticker Cursor",
    description:
      "A custom cursor with a rotating image ticker that follows the mouse.",
    thumbnail: {
      type: "iframe",
      src: "/demos/ticker-cursor/index.html",
    },
    tags: ["cursor", "ticker", "hover"],
  },
  {
    slug: "loading-img-reveal",
    title: "Loading Image Reveal",
    description:
      "Images that progressively reveal on scroll with a loading bar animation.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/loading-img-reveal.mov",
    },
    tags: ["scroll", "image", "reveal"],
  },
  {
    slug: "3d-flip-card",
    title: "3D Flip Card",
    description:
      "A card that flips in 3D on toggle, with images protruding beyond the card surface.",
    thumbnail: {
      type: "iframe",
      src: "/demos/3d-flip-card/index.html",
    },
    tags: ["3d", "flip", "css transform"],
  },
];

export function getDemoBySlug(slug: string): Demo | undefined {
  return demos.find((d) => d.slug === slug);
}
