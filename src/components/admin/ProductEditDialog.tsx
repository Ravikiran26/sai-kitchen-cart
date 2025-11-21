import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import adminApi from '@/api/admin';
import { Separator } from '@/components/ui/separator';
import VariantManager, { ProductVariant } from './VariantManager';

interface DbProduct {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price_range: string;
  image_url: string;
  tags: string[];
  spice_level: string | null;
  origin: string | null;
  weight: string | null;
  shelf_life: string | null;
  ingredients?: string | null;
  available: boolean;
  variants?: ProductVariant[];
}

interface ProductEditDialogProps {
  product: DbProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductEditDialog({
  product,
  open,
  onOpenChange,
}: ProductEditDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: product.name,
    slug: product.slug || '',
    category: product.category,
    description: product.description,
    price_range: product.price_range || '',
    image_url: product.image_url || '',
    spice_level: product.spice_level || '',
    origin: product.origin || '',
    weight: product.weight || '',
    shelf_life: product.shelf_life || '',
    tags: product.tags?.join(', ') || '',
    ingredients: (product as any).ingredients || '',
  });

  const [variants, setVariants] = useState<ProductVariant[]>(
    product.variants || [],
  );

  // Remember which variant IDs existed when dialog opened
  const originalVariantIds = useRef<number[]>(
    (product.variants || [])
      .map((v: any) => (v as any).id)
      .filter(Boolean) as number[],
  );

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = formData.slug || generateSlug(formData.name);

      const tagsArray = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const backendVariants = variants.map((v: any) => ({
        weight: v.label || `${v.weightGrams}g`,
        price: Number(v.price) || 0,
      }));

      const basePayload = {
        name: formData.name,
        slug,
        category: formData.category,
        description: formData.description || null,
        image_url: formData.image_url || null,
        spice_level: formData.spice_level || null,
        origin: formData.origin || null,
        weight: formData.weight || null,
        shelf_life: formData.shelf_life || null,
        tags: tagsArray,
        ingredients: formData.ingredients || null,
        price_range: formData.price_range || null,
      };

      if (product.id) {
        // UPDATE PRODUCT
        const pid = Number(product.id);

        await adminApi.updateAdminProduct(pid, basePayload);

        // --- Sync variants ---
        const currentIds = (variants as any[])
          .map((v) => (v as any).id)
          .filter(Boolean) as number[];

        // deleted variant IDs
        const deleted = originalVariantIds.current.filter(
          (id) => !currentIds.includes(id),
        );

        for (const vid of deleted) {
          try {
            await adminApi.deleteVariant(vid);
          } catch (err) {
            console.warn('Failed to delete variant', vid, err);
          }
        }

        // create or update current variants
        for (const v of variants as any[]) {
          if (v.id) {
            await adminApi.updateVariant(v.id, {
              weight: v.label || `${v.weightGrams}g`,
              price: Number(v.price) || 0,
            });
          } else {
            await adminApi.addVariant(pid, {
              weight: v.label || `${v.weightGrams}g`,
              price: Number(v.price) || 0,
            });
          }
        }

        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        // CREATE PRODUCT
        await adminApi.createAdminProduct({
          ...basePayload,
          variants: backendVariants,
        });

        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }

      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.id ? 'Edit Product' : 'Add Product'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (auto-generated if empty)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder={generateSlug(formData.name)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pickles">Pickles</SelectItem>
                <SelectItem value="podulu">Podulu</SelectItem>
                <SelectItem value="snacks">Snacks</SelectItem>
                <SelectItem value="pulses">Pulses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              required
            />
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label htmlFor="price_range">Price Range * (e.g., ₹150–₹300)</Label>
            <Input
              id="price_range"
              value={formData.price_range}
              onChange={(e) =>
                setFormData({ ...formData, price_range: e.target.value })
              }
              placeholder="₹150–₹300"
              required
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL *</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              placeholder="https://..."
              required
            />
          </div>

          {/* Spice Level */}
          <div className="space-y-2">
            <Label htmlFor="spice_level">Spice Level (Optional)</Label>
            <Select
              value={formData.spice_level}
              onValueChange={(value) =>
                setFormData({ ...formData, spice_level: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select spice level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
                <SelectItem value="extra-hot">Extra Hot</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Origin */}
          <div className="space-y-2">
            <Label htmlFor="origin">Origin (Optional)</Label>
            <Input
              id="origin"
              value={formData.origin}
              onChange={(e) =>
                setFormData({ ...formData, origin: e.target.value })
              }
              placeholder="e.g., Guntur, Andhra Pradesh"
            />
          </div>

          {/* Weight description */}
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (Optional)</Label>
            <Input
              id="weight"
              value={formData.weight}
              onChange={(e) =>
                setFormData({ ...formData, weight: e.target.value })
              }
              placeholder="e.g., 250g, 500g, 1kg"
            />
          </div>

          {/* Shelf life */}
          <div className="space-y-2">
            <Label htmlFor="shelf_life">Shelf Life (Optional)</Label>
            <Input
              id="shelf_life"
              value={formData.shelf_life}
              onChange={(e) =>
                setFormData({ ...formData, shelf_life: e.target.value })
              }
              placeholder="e.g., 12 months"
            />
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredients (Optional)</Label>
            <Textarea
              id="ingredients"
              value={formData.ingredients}
              onChange={(e) =>
                setFormData({ ...formData, ingredients: e.target.value })
              }
              rows={3}
              placeholder="e.g., Mango, red chilli, fenugreek, salt, cold-pressed oil"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="e.g., traditional, organic, spicy"
            />
          </div>

          <Separator className="my-6" />

          {/* Variants */}
          <VariantManager variants={variants} onChange={setVariants} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
