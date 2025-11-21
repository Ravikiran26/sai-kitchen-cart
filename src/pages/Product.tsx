// src/pages/Product.tsx

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductBySlug } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Heart, Share2, Flame } from 'lucide-react';
import { toast } from 'sonner';
import VariantSelector, { ProductVariant } from '@/components/VariantSelector';
import { useCart } from '@/contexts/CartContext';
import type { Product as UiProduct } from '@/types/product';

export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading } = useProductBySlug(slug || '');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Pre-select cheapest variant when product loads
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const cheapest = product.variants.reduce((min, v) =>
        v.price < min.price ? v : min,
      );
      setSelectedVariant(cheapest);
    }
  }, [product]);

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
        <p className="text-muted-foreground mb-8">
          The product you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const hasVariants = product.variants && product.variants.length > 0;

  const cheapestVariant =
    hasVariants && product.variants.length > 0
      ? product.variants.reduce((min, v) => (v.price < min.price ? v : min))
      : null;

  const activeVariant = selectedVariant || cheapestVariant || null;

  const displayPrice = activeVariant
    ? activeVariant.price
    : product.price_range
    ? product.price_range
        .split('-')
        .map((s) => parseInt(s.replace(/[^\d]/g, ''), 10))
        .filter((n) => !Number.isNaN(n))[0] || 0
    : 0;

  const displayMrp = activeVariant ? activeVariant.mrp : 0;

  const isOutOfStock = hasVariants && activeVariant && activeVariant.stock === 0;

  const weights = hasVariants
    ? product.variants.map((v) => v.label)
    : product.weight?.split(',').map((w) => w.trim()) || [];

  const getVariantForCart = (): ProductVariant | null => {
    if (activeVariant) return activeVariant;
    if (!hasVariants) {
      return {
        label: product.weight || 'default',
        price: Number(displayPrice) || 0,
        mrp: Number(displayMrp) || Number(displayPrice) || 0,
        stock: 999,
      };
    }
    return null;
  };

  const handleAddToCart = () => {
    if (hasVariants && !activeVariant) {
      toast.error('Please select a size', {
        description: 'Choose a variant before adding to cart',
      });
      return;
    }

    const variant = getVariantForCart();
    if (!variant) {
      toast.error('Variant not available', {
        description: 'Please try again later.',
      });
      return;
    }

    addToCart(product as UiProduct, variant, quantity);

    const variantInfo = variant.label ? ` (${variant.label})` : '';
    toast.success('Added to cart!', {
      description: `${product.name}${variantInfo} ×${quantity} added to your cart`,
    });
  };

  const imageSrc =
    product.images?.[0] || (product as any).image_url || '/placeholder.svg';

  // ✅ Handle ingredients as string OR array safely
  const ingredientsList =
    Array.isArray(product.ingredients)
      ? product.ingredients
      : typeof product.ingredients === 'string'
      ? product.ingredients
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  return (
    <div className="container mx-auto px-4 py-8 transition-theme">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        {' / '}
        <Link
          to={`/category/${product.category}`}
          className="hover:text-primary capitalize"
        >
          {product.category}
        </Link>
        {' / '}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div>
          <div className="aspect-square overflow-hidden rounded-lg bg-muted mb-4">
            <img
              src={imageSrc}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-4xl font-bold text-primary">
              ₹{displayPrice}
            </span>
            {displayMrp > displayPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  ₹{displayMrp}
                </span>
                <Badge variant="secondary" className="ml-2">
                  Save ₹{displayMrp - displayPrice}
                </Badge>
              </>
            )}
          </div>

          <p className="text-lg text-muted-foreground mb-4">
            {product.description}
          </p>

                  {/* Ingredients & Shelf life */}
          {(product.shelf_life || ingredientsList.length > 0) && (
            <div className="mb-6 text-sm space-y-2">
              {ingredientsList.length > 0 && (
                <div>
                  <span className="font-semibold">Ingredients: </span>
                  <span className="text-muted-foreground">
                    {ingredientsList.join(', ')}
                  </span>
                </div>
              )}
              {product.shelf_life && (
                <div>
                  <span className="font-semibold">Shelf life: </span>
                  <span className="text-muted-foreground">
                    {product.shelf_life}
                  </span>
                </div>
              )}
            </div>
          )}

          <Separator className="my-6" />

          {/* Variant selector */}
          {hasVariants ? (
            <VariantSelector
              variants={product.variants}
              onSelect={(variant) => setSelectedVariant(variant)}
            />
          ) : (
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

          {/* Spice level */}
          {product.spice_level && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Spice Level</h3>
              <div className="flex items-center gap-2">
                {['mild', 'medium', 'hot', 'extra-hot'].map((level, idx) => {
                  const spiceLevels = ['mild', 'medium', 'hot', 'extra-hot'];
                  const productLevel = spiceLevels.indexOf(
                    product.spice_level!,
                  );
                  const isActive = idx <= productLevel;
                  return (
                    <Flame
                      key={level}
                      className={`h-6 w-6 ${
                        isActive
                          ? idx === 0
                            ? 'fill-green-500 text-green-500'
                            : idx === 1
                            ? 'fill-yellow-500 text-yellow-500'
                            : idx === 2
                            ? 'fill-orange-500 text-orange-500'
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

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Quantity</h3>
            <div className="inline-flex items-center rounded-full border px-3 py-1 gap-4">
              <button
                type="button"
                className="text-xl"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                –
              </button>
              <span className="min-w-[2rem] text-center">{quantity}</span>
              <button
                type="button"
                className="text-xl"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Actions */}
          <div className="flex gap-4 mb-6">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isOutOfStock || (hasVariants && !activeVariant)}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isOutOfStock
                ? 'Out of Stock'
                : hasVariants && !activeVariant
                ? 'Select a Size'
                : `Add ${quantity} to Cart`}
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
