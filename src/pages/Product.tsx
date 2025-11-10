import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { getProductBySlug } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Heart, Share2, Flame } from 'lucide-react';
import { toast } from 'sonner';

export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || '');
  const [selectedVariant, setSelectedVariant] = useState(0);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const variant = product.variants[selectedVariant];
  const discount = Math.round(((variant.mrp - variant.price) / variant.mrp) * 100);

  const handleAddToCart = () => {
    toast.success('Added to cart!', {
      description: `${product.name} (${variant.label}) added to your cart`,
    });
  };

  const spiceLevelColors = {
    mild: 'bg-green-500',
    medium: 'bg-yellow-500',
    hot: 'bg-orange-500',
    'extra-hot': 'bg-red-500',
  };

  return (
    <div className="container mx-auto px-4 py-8 transition-theme">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        {' / '}
        <Link to={`/category/${product.category}`} className="hover:text-primary capitalize">
          {product.category}
        </Link>
        {' / '}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          <div className="aspect-square overflow-hidden rounded-lg bg-muted mb-4">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
          {product.isBestseller && (
            <Badge variant="secondary" className="mb-3">
              Bestseller
            </Badge>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-4xl font-bold text-primary">₹{variant.price}</span>
            <span className="text-xl text-muted-foreground line-through">₹{variant.mrp}</span>
            {discount > 0 && (
              <Badge className="bg-accent text-accent-foreground">{discount}% OFF</Badge>
            )}
          </div>

          <p className="text-lg text-muted-foreground mb-6">{product.description}</p>

          <Separator className="my-6" />

          {/* Weight Variants */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-3 block">Select Weight</label>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((v, idx) => (
                <Button
                  key={idx}
                  variant={selectedVariant === idx ? 'default' : 'outline'}
                  onClick={() => setSelectedVariant(idx)}
                  className="min-w-[100px]"
                >
                  <div className="text-center">
                    <div className="font-semibold">{v.label}</div>
                    <div className="text-xs">₹{v.price}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Spice Level */}
          {product.spiceLevel && (
            <div className="mb-6">
              <label className="text-sm font-medium mb-3 block">Spice Level</label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <Flame
                      key={i}
                      className={`h-5 w-5 ${
                        i < ['mild', 'medium', 'hot', 'extra-hot'].indexOf(product.spiceLevel!)
                          ? spiceLevelColors[product.spiceLevel!]
                          : 'text-muted'
                      }`}
                      fill="currentColor"
                    />
                  ))}
                </div>
                <span className="capitalize font-medium">{product.spiceLevel}</span>
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="mb-6">
            {variant.stock > 0 ? (
              <span className="text-sm text-green-600 font-medium">✓ In Stock ({variant.stock} available)</span>
            ) : (
              <span className="text-sm text-destructive font-medium">Out of Stock</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={variant.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Ingredients */}
          {product.ingredients && (
            <Card className="p-4 mb-6">
              <h3 className="font-semibold mb-2">Ingredients</h3>
              <p className="text-sm text-muted-foreground">{product.ingredients.join(', ')}</p>
            </Card>
          )}

          {/* Additional Info */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Product Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weight:</span>
                <span className="font-medium">{variant.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shelf Life:</span>
                <span className="font-medium">6 months</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
