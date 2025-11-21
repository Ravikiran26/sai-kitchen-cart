import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 🔄 NEW: import the API-backed product helper + UI type
import { fetchAllProducts } from '@/api/product';
import type { Product } from '@/types/product';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load products from backend (once, when dialog is first opened)
  useEffect(() => {
    if (!open) return;
    if (allProducts.length > 0) return; // already loaded

    setLoading(true);
    fetchAllProducts()
      .then(setAllProducts)
      .catch((err) => {
        console.error('Failed to load products for search:', err);
      })
      .finally(() => setLoading(false));
  }, [open, allProducts.length]);

  const filteredProducts =
    query.trim() && allProducts.length > 0
      ? allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
        )
      : [];

  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`);
    onOpenChange(false);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-[hsl(var(--bg))]">
        <DialogHeader>
          <DialogTitle className="text-[hsl(var(--fg))]">Search Products</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <Input
            placeholder="Search for pickles, snacks, pulses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>

        {query.trim() && (
          <div className="max-h-96 overflow-y-auto space-y-2">
            {loading ? (
              <p className="text-center py-8 text-[hsl(var(--muted-foreground))]">
                Loading products…
              </p>
            ) : filteredProducts.length === 0 ? (
              <p className="text-center py-8 text-[hsl(var(--muted-foreground))]">
                No products found for "{query}"
              </p>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.slug)}
                  className="flex gap-4 p-3 rounded-lg hover:bg-[hsl(var(--muted))] cursor-pointer transition-colors"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium text-[hsl(var(--fg))]">{product.name}</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] capitalize">
                      {product.category}
                    </p>
                    {product.variants[0] && (
                      <p className="text-sm font-semibold text-[hsl(var(--primary))]">
                        ₹{product.variants[0].price}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
