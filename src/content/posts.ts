/**
 * Blog posts. Only posts with `draft: false` are published, prerendered,
 * listed and added to the sitemap. Never publish placeholder content.
 */
export interface PostBlock {
  type: 'p' | 'h2' | 'ul';
  text?: string;
  items?: string[];
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  category: string;
  image?: { src: string; alt: string; width: number; height: number };
  draft: boolean;
  body: PostBlock[];
}

const allPosts: Post[] = [
  // Add real articles here, e.g.
  // { slug: 'why-i-am-building-easstay-os', title: '…', description: '…', date: '2026-12-01',
  //   category: 'Hospitality Tech', draft: true, body: [{ type: 'p', text: '…' }] },
];

export const posts = allPosts
  .filter((p) => !p.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
