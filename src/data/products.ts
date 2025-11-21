// src/data/products.ts (or wherever this file is)
import { Product } from "@/types/product";

// ---- Backend types (match your FastAPI schemas) ----
type ApiProductVariant = {
  id: number;
  product_id: number;
  weight: string; // e.g. "250g"
  price: number;
};

type ApiProduct = {
  id: number;
  name: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  variants: ApiProductVariant[];
};

// ---- API base URL ----
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Generic fetch
async function fetchApiProducts(): Promise<ApiProduct[]> {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }
  return res.json();
}

// Map backend Product -> UI Product (your existing type)
function mapApiToUi(p: ApiProduct): Product {
  return {
    id: String(p.id),
    name: p.name,
    // simple slug from name until you store slug in DB
    slug: p.name.toLowerCase().replace(/\s+/g, "-"),
    category: p.category ?? "misc",
    description: p.description ?? "",
    images: [p.image_url ?? "/placeholder.svg"],
    variants: p.variants.map((v) => ({
      label: v.weight, // "250g"
      weightGrams: parseInt(v.weight) || 0, // rough parse, improve later if needed
      price: v.price,
      mrp: v.price, // until you add MRP in backend, use same
      stock: 999,   // until you add stock in backend
    })),
    tags: [],          // not in backend yet
    spiceLevel: "medium", // default
    ingredients: [],   // not in backend yet
    isBestseller: false, // default
  };
}

// ---- PUBLIC API (async now!) ----

// Get ALL products
export async function fetchAllProducts(): Promise<Product[]> {
  const apiProducts = await fetchApiProducts();
  return apiProducts.map(mapApiToUi);
}

// Get by category
export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const products = await fetchAllProducts();
  return products.filter((p) => p.category === category);
}

// Get bestsellers (right now based on flag in UI type)
export async function getBestsellers(): Promise<Product[]> {
  const products = await fetchAllProducts();
  return products.filter((p) => p.isBestseller);
}

// Get single product by slug
export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const products = await fetchAllProducts();
  return products.find((p) => p.slug === slug);
}
