import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import VariantManager, { ProductVariant } from './VariantManager';

interface DbProduct {
  id: string;
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
  available: boolean;
  variants?: ProductVariant[];
}

interface ProductEditDialogProps {
  product: DbProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductEditDialog({ product, open, onOpenChange }: ProductEditDialogProps) {
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
  });
  const [variants, setVariants] = useState<ProductVariant[]>(product.variants || []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = formData.slug || generateSlug(formData.name);
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

      const productData = {
        name: formData.name,
        slug,
        category: formData.category,
        description: formData.description,
        price_range: formData.price_range,
        image_url: formData.image_url,
        spice_level: formData.spice_level || null,
        origin: formData.origin || null,
        weight: formData.weight || null,
        shelf_life: formData.shelf_life || null,
        tags: tagsArray,
        available: true,
        variants: variants.length > 0 ? (variants as any) : null,
      };

      if (product.id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
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
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (auto-generated if empty)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder={generateSlug(formData.name)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
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

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price_range">Price Range * (e.g., ₹150-₹300)</Label>
            <Input
              id="price_range"
              value={formData.price_range}
              onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
              placeholder="₹150-₹300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL *</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spiceLevel">Spice Level (Optional)</Label>
            <Select
              value={formData.spice_level}
              onValueChange={(value) => setFormData({ ...formData, spice_level: value })}
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

          <div className="space-y-2">
            <Label htmlFor="origin">Origin (Optional)</Label>
            <Input
              id="origin"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              placeholder="e.g., Guntur, Andhra Pradesh"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (Optional)</Label>
            <Input
              id="weight"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="e.g., 250g, 500g, 1kg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shelf_life">Shelf Life (Optional)</Label>
            <Input
              id="shelf_life"
              value={formData.shelf_life}
              onChange={(e) => setFormData({ ...formData, shelf_life: e.target.value })}
              placeholder="e.g., 12 months"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., traditional, organic, spicy"
            />
          </div>

          <Separator className="my-6" />
          
          <VariantManager variants={variants} onChange={setVariants} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
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
