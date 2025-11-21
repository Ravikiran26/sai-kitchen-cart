// src/api/type.ts

export interface Product {
  id: number;
  name: string;
  category: string;
  description?: string | null;
  image_url?: string | null;

  origin?: string | null;
  shelf_life?: string | null;
  weight?: string | null;
  price_range?: string | null;
  tags?: string[] | null;
  spice_level?: 'mild' | 'medium' | 'hot' | 'extra-hot' | null;
  ingredients?: string | null;

  variants?: {
    id: number;
    weight?: string | null;
    price?: number | null;
    stock?: number | null;
  }[];
}
