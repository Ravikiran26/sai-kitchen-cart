import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

export interface ProductVariant {
  label: string;
  weightGrams: number;
  price: number;
  mrp: number;
  stock: number;
}

interface VariantManagerProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}

export default function VariantManager({ variants, onChange }: VariantManagerProps) {
  const [editingVariants, setEditingVariants] = useState<ProductVariant[]>(
    variants.length > 0 ? variants : []
  );

  const addVariant = () => {
    const newVariant: ProductVariant = {
      label: '',
      weightGrams: 0,
      price: 0,
      mrp: 0,
      stock: 0,
    };
    const updated = [...editingVariants, newVariant];
    setEditingVariants(updated);
    onChange(updated);
  };

  const removeVariant = (index: number) => {
    const updated = editingVariants.filter((_, i) => i !== index);
    setEditingVariants(updated);
    onChange(updated);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    const updated = editingVariants.map((v, i) => {
      if (i === index) {
        return { ...v, [field]: value };
      }
      return v;
    });
    setEditingVariants(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Product Variants</Label>
        <Button type="button" variant="outline" size="sm" onClick={addVariant}>
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </div>

      <div className="space-y-3">
        {editingVariants.map((variant, index) => (
          <Card key={index} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="md:col-span-2">
                <Label className="text-xs">Label (e.g., 250g, 500g)</Label>
                <Input
                  placeholder="250g"
                  value={variant.label}
                  onChange={(e) => updateVariant(index, 'label', e.target.value)}
                />
              </div>
              
              <div>
                <Label className="text-xs">Weight (g)</Label>
                <Input
                  type="number"
                  placeholder="250"
                  value={variant.weightGrams || ''}
                  onChange={(e) => updateVariant(index, 'weightGrams', parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label className="text-xs">Price (₹)</Label>
                <Input
                  type="number"
                  placeholder="99"
                  value={variant.price || ''}
                  onChange={(e) => updateVariant(index, 'price', parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label className="text-xs">MRP (₹)</Label>
                <Input
                  type="number"
                  placeholder="120"
                  value={variant.mrp || ''}
                  onChange={(e) => updateVariant(index, 'mrp', parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label className="text-xs">Stock</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={variant.stock || ''}
                  onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 text-destructive hover:text-destructive"
              onClick={() => removeVariant(index)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </Card>
        ))}
      </div>

      {editingVariants.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No variants added yet. Click "Add Variant" to create size options.
        </div>
      )}
    </div>
  );
}
