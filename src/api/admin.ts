import { get, post, patch, del } from './client';

export interface AdminVariantIn {
  weight: string;
  price: number;
}

export interface AdminProductCreate {
  name: string;
  category: string;
  description?: string | null;
  image_url?: string | null;
  variants: AdminVariantIn[];
}

export interface AdminProduct {
  id: number;
  name: string;
  category: string;
  description?: string | null;
  image_url?: string | null;
  variants: { id: number; weight: string; price: number }[];
}

export function fetchAdminProducts(): Promise<AdminProduct[]> {
  return get<AdminProduct[]>('/products');
}

export function createAdminProduct(body: AdminProductCreate) {
  return post<AdminProduct>('/admin/products', body);
}

export function updateAdminProduct(id: number, body: Partial<{ name: string; category: string; description?: string | null; image_url?: string | null }>) {
  return patch<AdminProduct>(`/admin/products/${id}`, body);
}

export function addVariant(productId: number, variant: AdminVariantIn) {
  return post<{ id: number; weight: string; price: number }>(`/admin/products/${productId}/variants`, variant);
}

export function updateVariant(variantId: number, body: Partial<{ weight: string; price: number }>) {
  return patch<{ id: number; weight: string; price: number }>(`/admin/variants/${variantId}`, body);
}

export function deleteVariant(variantId: number) {
  return del<void>(`/admin/variants/${variantId}`);
}

export function deleteProduct(productId: number) {
  return del<void>(`/admin/products/${productId}`);
}

export default {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  addVariant,
  updateVariant,
  deleteVariant,
  deleteProduct,
};
