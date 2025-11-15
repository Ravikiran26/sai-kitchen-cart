import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { useProductsByCategory } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name';

export default function Category() {
  const { category } = useParams<{ category: string }>();
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const { products, loading } = useProductsByCategory(category || '');

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Parse first price from price_range
      const prices = product.price_range.split(',').map(p => parseInt(p.trim()));
      const price = prices[0] || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price_range.split(',')[0].trim());
          const priceB = parseInt(b.price_range.split(',')[0].trim());
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price_range.split(',')[0].trim());
          const priceB = parseInt(b.price_range.split(',')[0].trim());
          return priceB - priceA;
        });
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured - keep default order
        break;
    }

    return filtered;
  }, [products, priceRange, sortBy]);

  const categoryNames: Record<string, string> = {
    pickles: 'Pickles',
    podulu: 'Podulu',
    snacks: 'Snacks',
    pulses: 'Organic Pulses',
  };

  return (
    <div className="container mx-auto px-4 py-8 transition-theme">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{categoryNames[category || ''] || 'Products'}</h1>
        <p className="text-muted-foreground">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <Card className="p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            {/* Price Range */}
            <div className="mb-6">
              <Label className="mb-3 block">
                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={500}
                step={10}
                className="mb-2"
              />
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <Label className="mb-3 block">Sort By</Label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setPriceRange([0, 500]);
                setSortBy('featured');
              }}
            >
              Reset Filters
            </Button>
          </Card>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No products found matching your filters.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setPriceRange([0, 500]);
                  setSortBy('featured');
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
