import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, Category } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

interface ProductEditDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductEditDialog({ product, open, onOpenChange }: ProductEditDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    description: product.description,
    spiceLevel: product.spiceLevel || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Backend Required",
      description: "Product editing requires backend integration. Enable Lovable Cloud to save changes.",
      variant: "destructive",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as Category })}
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spiceLevel">Spice Level (Optional)</Label>
            <Select
              value={formData.spiceLevel}
              onValueChange={(value) => setFormData({ ...formData, spiceLevel: value })}
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
            <Label>Variants</Label>
            <div className="space-y-2">
              {product.variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 p-3 border rounded-md">
                  <div>
                    <Label className="text-xs">Label</Label>
                    <Input value={variant.label} readOnly className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Weight (g)</Label>
                    <Input value={variant.weightGrams} readOnly className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Price</Label>
                    <Input value={variant.price} readOnly className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Stock</Label>
                    <Input value={variant.stock} readOnly className="h-8" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Variant editing requires backend integration
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
