export type Thumbnail =
  | { type: "img"; src: string }
  | { type: "iframe"; src: string }
  | { type: "video"; src: string };

export interface Demo {
  slug: string;
  title: string;
  description: string;
  thumbnail: Thumbnail;
  tags: string[];
}
