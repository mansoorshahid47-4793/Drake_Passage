export interface DialItem {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  productCount: number;
  subCategories: string[];
  products: { slug: string; name: string; subCategory?: string }[];
}
