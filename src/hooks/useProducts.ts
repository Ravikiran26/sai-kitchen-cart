// src/hooks/useProducts.ts
import { useEffect, useState } from 'react';
import type { Product as UiProduct } from '@/types/product';
import { fetchAllProducts, fetchProductBySlug } from '@/api/product';

export const useProducts = () => {
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const uiProducts = await fetchAllProducts();
      setProducts(uiProducts);
    } catch (error) {
      console.error('Error fetching products from API:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, refetch: fetchProducts };
};

export const useProductsByCategory = (category: string) => {
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      setLoading(true);
      try {
        const all = await fetchAllProducts();
        const cat = category.toLowerCase();
        setProducts(all.filter((p) => p.category.toLowerCase() === cat));
      } catch (error) {
        console.error('Error fetching products by category:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [category]);

  return { products, loading };
};

export const useProductBySlug = (slug: string) => {
  const [product, setProduct] = useState<UiProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      setLoading(true);
      try {
        const apiProduct = await fetchProductBySlug(slug);
        setProduct(apiProduct || null);
      } catch (error) {
        console.error('Error fetching product by slug:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [slug]);

  return { product, loading };
};
