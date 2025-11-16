import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface ProductVariant {
  label: string;
  weightGrams: number;
  price: number;
  mrp: number;
  stock: number;
}

interface VariantSelectorProps {
  variants: ProductVariant[];
  onSelect: (variant: ProductVariant) => void;
}

export default function VariantSelector({ variants, onSelect }: VariantSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    onSelect(variants[index]);
  };

  if (variants.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3">Select Size</h3>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant, idx) => {
          const isSelected = idx === selectedIndex;
          const isOutOfStock = variant.stock === 0;
          
          return (
            <button
              key={idx}
              onClick={() => !isOutOfStock && handleSelect(idx)}
              disabled={isOutOfStock}
              className={cn(
                "relative px-4 py-3 rounded-lg border-2 transition-all text-left",
                "hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
                isSelected 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="font-semibold text-sm">{variant.label}</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-bold text-primary">₹{variant.price}</span>
                {variant.mrp > variant.price && (
                  <span className="text-xs text-muted-foreground line-through">₹{variant.mrp}</span>
                )}
              </div>
              {isOutOfStock && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs">
                  Out of Stock
                </Badge>
              )}
              {!isOutOfStock && variant.stock < 10 && (
                <div className="text-xs text-orange-600 mt-1">
                  Only {variant.stock} left
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
