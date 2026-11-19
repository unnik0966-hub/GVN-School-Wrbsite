export const GALLERY_CATEGORY_PREFIX = 'gallery-category-';

export const GALLERY_CATEGORIES = [
  { id: 'cat-events', slug: 'gallery-category-events', title: 'Events' },
  { id: 'cat-campus-life', slug: 'gallery-category-campus-life', title: 'Campus Life' },
  { id: 'cat-celebrations', slug: 'gallery-category-celebrations', title: 'Celebrations' },
  { id: 'cat-achievements', slug: 'gallery-category-achievements', title: 'Achievements' },
  { id: 'cat-activities', slug: 'gallery-category-activities', title: 'Activities' },
  { id: 'cat-academics', slug: 'gallery-category-academics', title: 'Academics' },
  { id: 'cat-sports-fitness', slug: 'gallery-category-sports-fitness', title: 'Sports & Fitness' },
  { id: 'cat-arts-culture', slug: 'gallery-category-arts-culture', title: 'Arts & Culture' },
] as const;

export function isGalleryCategorySlug(slug?: string | null): boolean {
  return Boolean(slug && slug.startsWith(GALLERY_CATEGORY_PREFIX));
}
