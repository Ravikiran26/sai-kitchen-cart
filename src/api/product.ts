// src/api/product.ts

import { get } from './client';
import type { Product as ApiProduct } from './type';
import type {
  Product as UiProduct,
  ProductVariant as UiVariant,
} from '@/types/product';

function mapApiVariantToUi(v: any): UiVariant {
  const label = v.weight ?? String(v.id);
  const weightGrams =
    parseInt(String(v.weight ?? '').replace(/[^0-9]/g, ''), 10) || 0;

  return {
    id: v.id,
    label,
    weightGrams,
    price: Number(v.price ?? 0),
    mrp: Number(v.mrp ?? v.price ?? 0),
    stock: Number(v.stock ?? 999),
  };
}

function mapApiToUi(p: ApiProduct): UiProduct {
  // normalise to lowercase so it matches /category/pickles etc.
  const category = (p.category
    ? String(p.category).toLowerCase()
    : 'pickles') as UiProduct['category'];

  // map + sort variants by price (lowest first)
  const variantsRaw = Array.isArray(p.variants)
    ? p.variants.map(mapApiVariantToUi)
    : [];
  const variants = [...variantsRaw].sort((a, b) => a.price - b.price);

  // handle ingredients from backend as string OR array
  const rawIngredients = (p as any).ingredients;
  let ingredients: string[] = [];
  if (Array.isArray(rawIngredients)) {
    ingredients = rawIngredients;
  } else if (typeof rawIngredients === 'string') {
    ingredients = rawIngredients
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const images = p.image_url ? [p.image_url] : ['/placeholder.svg'];

  return {
    id: String(p.id),
    name: p.name,
    slug: (p as any).slug ?? p.name.toLowerCase().replace(/\s+/g, '-'),
    category,
    description: p.description ?? '',
    images,
    variants,
    tags: ((p as any).tags as string[]) || [],
    spice_level: (p as any).spice_level || undefined,
    origin: (p as any).origin ?? null,
    shelf_life: (p as any).shelf_life ?? null,
    weight: (p as any).weight ?? null,
    price_range: (p as any).price_range ?? null,
    ingredients,
    isBestseller: !!(p as any).is_bestseller,
  };
}

export async function fetchAllProducts(): Promise<UiProduct[]> {
  const api = await get<ApiProduct[]>('/products');
  return (api || []).map(mapApiToUi);
}

export async function fetchProductById(id: number): Promise<UiProduct> {
  const api = await get<ApiProduct>(`/products/${id}`);
  return mapApiToUi(api);
}

export async function fetchProductBySlug(
  slug: string,
): Promise<UiProduct | undefined> {
  try {
    const api = await get<ApiProduct>(
      `/products/slug/${encodeURIComponent(slug)}`,
    );
    return mapApiToUi(api);
  } catch {
    const all = await fetchAllProducts();
    return all.find((p) => p.slug === slug);
  }
}
