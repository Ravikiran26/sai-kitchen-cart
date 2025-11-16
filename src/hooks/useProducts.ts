import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProductVariant {
  label: string;
  weightGrams: number;
  price: number;
  mrp: number;
  stock: number;
}

export interface DbProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price_range: string;
  image_url: string;
  tags: string[];
  spice_level?: string;
  origin?: string;
  weight?: string;
  shelf_life?: string;
  available: boolean;
  variants?: ProductVariant[];
}

export const useProducts = () => {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const productsWithVariants = (data || []).map(p => ({
        ...p,
        variants: Array.isArray(p.variants) ? p.variants as unknown as ProductVariant[] : []
      }));
      setProducts(productsWithVariants);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, refetch: fetchProducts };
};

export const useProductsByCategory = (category: string) => {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', category)
          .eq('available', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        const productsWithVariants = (data || []).map(p => ({
          ...p,
          variants: Array.isArray(p.variants) ? p.variants as unknown as ProductVariant[] : []
        }));
        setProducts(productsWithVariants);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return { products, loading };
};

export const useProductBySlug = (slug: string) => {
  const [product, setProduct] = useState<DbProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .eq('available', true)
          .single();

        if (error) throw error;
        const productWithVariants = {
          ...data,
          variants: Array.isArray(data.variants) ? data.variants as unknown as ProductVariant[] : []
        };
        setProduct(productWithVariants);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading };
};
