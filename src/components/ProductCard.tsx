import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const defaultVariant = product.variants[0];
  const discount = Math.round(((defaultVariant.mrp - defaultVariant.price) / defaultVariant.mrp) * 100);

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg transition-theme">
      <Link to={`/product/${product.slug}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/product/${product.slug}`}>
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {product.isBestseller && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                Bestseller
              </Badge>
            )}
          </div>
        </Link>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-bold text-primary">₹{defaultVariant.price}</span>
          <span className="text-sm text-muted-foreground line-through">₹{defaultVariant.mrp}</span>
          {discount > 0 && (
            <span className="text-xs font-medium text-accent">({discount}% off)</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
