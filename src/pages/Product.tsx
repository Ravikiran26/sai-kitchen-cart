import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductBySlug } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Heart, Share2, Flame } from 'lucide-react';
import { toast } from 'sonner';
import VariantSelector, { ProductVariant } from '@/components/VariantSelector';

export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading } = useProductBySlug(slug || '');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

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

  // Get prices and display variant info
  const hasVariants = product.variants && product.variants.length > 0;
  const displayPrice = hasVariants && selectedVariant 
    ? selectedVariant.price 
    : (hasVariants ? product.variants![0].price : product.price_range.split(',').map(p => parseInt(p.trim()))[0]);
  
  const displayMrp = hasVariants && selectedVariant 
    ? selectedVariant.mrp 
    : (hasVariants ? product.variants![0].mrp : 0);

  const weights = product.weight?.split(',').map(w => w.trim()) || [];

  const handleAddToCart = () => {
    const variantInfo = selectedVariant ? ` (${selectedVariant.label})` : '';
    toast.success('Added to cart!', {
      description: `${product.name}${variantInfo} added to your cart`,
    });
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
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-4xl font-bold text-primary">₹{displayPrice}</span>
            {displayMrp > displayPrice && (
              <span className="text-xl text-muted-foreground line-through">₹{displayMrp}</span>
            )}
            {displayMrp > displayPrice && (
              <Badge variant="secondary" className="ml-2">
                Save ₹{displayMrp - displayPrice}
              </Badge>
            )}
          </div>

          <p className="text-lg text-muted-foreground mb-6">{product.description}</p>

          <Separator className="my-6" />

          {/* Variant Selector */}
          {hasVariants ? (
            <VariantSelector 
              variants={product.variants!} 
              onSelect={(variant) => setSelectedVariant(variant)} 
            />
          ) : (
            /* Available Weights - only show if no variants */
            weights.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Available Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {weights.map((weight, idx) => (
                    <Badge key={idx} variant="outline" className="text-sm px-4 py-2">
                      {weight}
                    </Badge>
                  ))}
                </div>
              </div>
            )
          )}

          {/* Spice Level */}
          {product.spice_level && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Spice Level</h3>
              <div className="flex items-center gap-2">
                {['mild', 'medium', 'hot', 'extra-hot'].map((level, idx) => {
                  const spiceLevels = ['mild', 'medium', 'hot', 'extra-hot'];
                  const productLevel = spiceLevels.indexOf(product.spice_level!);
                  const isActive = idx <= productLevel;
                  return (
                    <Flame
                      key={level}
                      className={`h-6 w-6 ${
                        isActive 
                          ? idx === 0 ? 'fill-green-500 text-green-500' 
                          : idx === 1 ? 'fill-yellow-500 text-yellow-500'
                          : idx === 2 ? 'fill-orange-500 text-orange-500'
                          : 'fill-red-500 text-red-500'
                          : 'text-muted'
                      }`}
                    />
                  );
                })}
                <span className="ml-2 text-sm text-muted-foreground capitalize">
                  {product.spice_level.replace('-', ' ')}
                </span>
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-600">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              In Stock
            </div>
          </div>

          <Separator className="my-6" />

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <Button 
              size="lg" 
              className="flex-1"
              onClick={handleAddToCart}
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
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Separator className="my-6" />

          {/* Additional Info */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Product Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium capitalize">{product.category}</span>
              </div>
              {product.origin && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Origin:</span>
                  <span className="font-medium">{product.origin}</span>
                </div>
              )}
              {product.shelf_life && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shelf Life:</span>
                  <span className="font-medium">{product.shelf_life}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
