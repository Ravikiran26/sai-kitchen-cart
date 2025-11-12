import { useState } from 'react';
import { products } from '@/data/products';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import ProductEditDialog from '@/components/admin/ProductEditDialog';
import { Product } from '@/types/product';

export default function AdminProducts() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(var(--fg))]">Products</h1>
          <p className="text-[hsl(var(--muted-foreground))]">
            Manage your product catalog (Backend required for CRUD operations)
          </p>
        </div>
        <Button disabled>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id} className="bg-[hsl(var(--card))]">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-[hsl(var(--fg))]">{product.name}</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] capitalize">
                    {product.category}
                  </p>
                  <p className="text-sm font-medium text-[hsl(var(--primary))]">
                    ₹{product.variants[0].price} - ₹{product.variants[product.variants.length - 1].price}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" disabled>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingProduct && (
        <ProductEditDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
        />
      )}
    </div>
  );
}
