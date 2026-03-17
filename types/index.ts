export type Thumbnail =
  | { type: "img"; src: string }
  | { type: "iframe"; src: string }
  | { type: "video"; src: string };

export interface Project {
  slug: string;
  title: string;
  description: string;
  thumbnail: Thumbnail;
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
