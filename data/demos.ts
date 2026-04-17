import type { Demo } from "@/types";

export const demos: Demo[] = [
  {
    slug: "spring-physics-grid",
    title: "Spring Physics Grid",
    description:
      "A grid that responds with dynamic spring physics and distance-based stiffness when dragged.",
    thumbnail: {
      type: "iframe",
      src: "/demos/spring-physics-grid/index.html",
    },
    tags: ["interaction", "physics"],
  },
  {
    slug: "theme-switch",
    title: "Theme Switch",
    description:
      "A swipe-to-reveal panel that transitions between dark and light themes, driven by a single --progress CSS custom property controlling scale, border-radius, and opacity simultaneously.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/theme-switch.mov",
    },
    tags: ["interaction", "mobile", "theme", "ui"],
  },
  {
    slug: "product-card",
    title: "Product Card",
    description:
      "A product card that rotates on hover using CSS perspective and transform.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/product-card.mov",
    },
    tags: ["component", "hover", "interaction", "ui"],
  },
  {
    slug: "cursor-trail",
    title: "Cursor Trail",
    description:
      "Cursor followers chained with spring physics, drawing a fluid trail on canvas.",
    thumbnail: {
      type: "iframe",
      src: "/demos/cursor-trail/index.html",
    },
    tags: ["cursor", "interaction"],
  },
  {
    slug: "glassmorphism-accordion",
    title: "Glassmorphism Accordion",
    description:
      "An accordion with frosted glass styling, spring easing, and animated height transitions.",
    thumbnail: {
      type: "iframe",
      src: "/demos/glassmorphism-accordion/index.html",
    },
    tags: ["component", "glassmorphism", "ui"],
  },
  {
    slug: "glassmorphism-tab-bar",
    title: "Glassmorphism Tab Bar",
    description:
      "A CSS-only tab panel with three layers of glassmorphism and a 45° glass float effect on interaction.",
    thumbnail: {
      type: "iframe",
      src: "/demos/glassmorphism-tab-bar/index.html",
    },
    tags: ["component", "glassmorphism", "ui"],
  },
  {
    slug: "floating-action-button",
    title: "Floating Action Button",
    description:
      "A CSS-only FAB that expands into action items with spring cubic-bezier animation.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/floating-action-button.mov",
    },
    tags: ["component", "mobile", "ui"],
  },
  {
    slug: "neumorphism-tab-bar",
    title: "Neumorphism Tab Bar",
    description:
      "Soft UI tab bar built with neumorphic shadows and smooth transitions.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/neumorphism-tab-bar.mov",
    },
    tags: ["component", "neumorphism", "ui"],
  },
  {
    slug: "mouse-parallax-effect",
    title: "Mouse Parallax Effect",
    description:
      "Two-layer cards driven by spring physics — outer shell and inner content sway at different depths with the cursor, with a radial spotlight and edge glow on hover.",
    thumbnail: {
      type: "iframe",
      src: "/demos/mouse-parallax-effect/index.html",
    },
    tags: ["cursor", "interaction", "ui"],
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
    tags: ["cursor", "interaction", "physics"],
  },
  {
    slug: "fluid-glass-app-folder",
    title: "Fluid-Glass App Folder",
    description:
      "A fluid iOS-style folder with drag-and-shift mechanics, spring physics, and glassmorphism styling.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/fluid-glass-app-folder.mov",
    },
    tags: ["component", "interaction", "mobile", "ui"],
  },
  {
    slug: "wave-fill-button",
    title: "Wave Fill Button",
    description: "A button where wave layers sequentially fill in on hover.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/wave-fill-button.mov",
    },
    tags: ["component", "hover", "interaction", "ui"],
  },
  {
    slug: "trace-border-button",
    title: "Trace Border Button",
    description:
      "A circular button where a border traces the circumference on hover, with a pen icon orbiting alongside.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/trace-border-button.mov",
    },
    tags: ["component", "hover", "interaction", "ui"],
  },
  {
    slug: "text-explosion",
    title: "Text Explosion",
    description:
      "Characters scatter as particles on click, then reassemble with a typing animation.",
    thumbnail: {
      type: "iframe",
      src: "/demos/text-explosion/index.html",
    },
    tags: ["interaction", "physics"],
  },
  {
    slug: "smoky-text",
    title: "Smoky Text",
    description: "Text dissolves into a smoky effect on hover.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/smoky-text.mov",
    },
    tags: ["hover"],
  },
  {
    slug: "parallax-scrolling",
    title: "Parallax Scrolling",
    description:
      "Full-screen cards that reveal with a parallax effect as the user scrolls, stacking and transitioning between sections.",
    thumbnail: {
      type: "iframe",
      src: "/demos/parallax-scrolling/index.html",
    },
    tags: ["scroll", "ui", "web"],
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
    tags: ["cursor", "hover"],
  },
  {
    slug: "image-scroll-animation",
    title: "Image Scroll Animation",
    description:
      "Image layers that progressively reveal their content in sync with scroll position.",
    thumbnail: {
      type: "video",
      src: "/thumbnails/image-scroll-animation.mov",
    },
    tags: ["scroll", "web"],
  },
];

export function getDemoBySlug(slug: string): Demo | undefined {
  return demos.find((d) => d.slug === slug);
}
