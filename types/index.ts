export interface Project {
  slug: string;
  title: string;
  description: string;
  thumbnail: string; // path relative to /public, e.g. "/thumbnails/circle-reveal.gif"
  tags: string[];
}

export interface Category {
  slug: string;
  title: string;
  description: string;
  projects: Project[];
}

export interface FlatProject extends Project {
  categorySlug: string;
}
