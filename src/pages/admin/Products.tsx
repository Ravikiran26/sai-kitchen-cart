import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import ProductEditDialog from '@/components/admin/ProductEditDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  variants?: any;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      fetchProducts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(var(--fg))]">Products</h1>
          <p className="text-[hsl(var(--muted-foreground))]">
            Manage your product catalog
          </p>
        </div>
        <Button onClick={() => setEditingProduct({
          id: '',
          name: '',
          slug: '',
          description: '',
          category: 'pickles',
          price_range: '',
          image_url: '',
          tags: [],
          spice_level: null,
          origin: null,
          weight: null,
          shelf_life: null,
          available: true,
          variants: [],
        })}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="bg-[hsl(var(--card))]">
          <CardContent className="p-8 text-center">
            <p className="text-[hsl(var(--muted-foreground))]">
              No products found. Click "Add Product" to create your first product.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id} className="bg-[hsl(var(--card))]">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[hsl(var(--fg))]">{product.name}</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] capitalize">
                      {product.category}
                    </p>
                    <p className="text-sm font-medium text-[hsl(var(--primary))]">
                      {product.price_range}
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
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingProduct && (
        <ProductEditDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => {
            if (!open) {
              setEditingProduct(null);
              fetchProducts();
            }
          }}
        />
      )}
    </div>
  );
}
