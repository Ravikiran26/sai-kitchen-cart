// src/components/ProductCard.tsx

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import type { Product as UiProduct } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: UiProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { toast } = useToast();

  const getPrice = () => {
    if (product.variants && product.variants.length > 0) {
      const cheapest = product.variants.reduce((min, v) =>
        v.price < min.price ? v : min,
      );
      return cheapest.price;
    }

    if (product.price_range) {
      const nums = product.price_range
        .split('-')
        .map((s) => parseInt(s.replace(/[^\d]/g, ''), 10))
        .filter((n) => !Number.isNaN(n));

      return nums.length ? Math.min(...nums) : 0;
    }

    return 0;
  };

  const price = getPrice();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: 'Added to cart',
      description: `${product.name} added to your cart.`,
    });
  };

  const imageSrc =
    product.images?.[0] || (product as any).image_url || '/placeholder.svg';

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg transition-theme">
      <Link to={`/product/${product.slug}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/product/${product.slug}`}>
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </div>
        </Link>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-bold text-primary">₹{price}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {product.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 2).map((tag, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
