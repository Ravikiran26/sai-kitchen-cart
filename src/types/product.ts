export type Category = 'pickles' | 'podulu' | 'snacks' | 'pulses';

export interface ProductVariant {
  label: string;
  weightGrams: number;
  price: number;
  mrp: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  description: string;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot';
  ingredients?: string[];
  isBestseller?: boolean;
}
