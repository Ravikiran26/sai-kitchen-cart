import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';

export default function AdminOrders() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[hsl(var(--fg))]">Orders</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Manage customer orders and shipments (Backend required)
        </p>
      </div>

      <Card className="bg-[hsl(var(--card))]">
        <CardHeader>
          <CardTitle className="text-[hsl(var(--fg))]">All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="w-16 h-16 text-[hsl(var(--muted-foreground))] mb-4" />
            <p className="text-center text-[hsl(var(--muted-foreground))]">
              No orders yet. Enable Lovable Cloud to manage orders and shipments.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
