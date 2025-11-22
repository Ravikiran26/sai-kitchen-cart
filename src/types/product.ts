// src/types/product.ts
export type Category = 'pickles' | 'podulu' | 'snacks' | 'pulses';

export interface ProductVariant {
  id?: number;   
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

  // backend-style fields
  spice_level?: 'mild' | 'medium' | 'hot' | 'extra-hot';
  origin?: string | null;
  shelf_life?: string | null;
  weight?: string | null;
  price_range?: string | null;
  ingredients?: string | null;

  isBestseller?: boolean;
}
