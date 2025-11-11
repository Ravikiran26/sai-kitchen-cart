import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Products', value: '20', icon: Package, color: 'text-blue-600' },
    { title: 'Total Orders', value: '0', icon: ShoppingCart, color: 'text-green-600' },
    { title: 'Customers', value: '0', icon: Users, color: 'text-purple-600' },
    { title: 'Revenue', value: '₹0', icon: DollarSign, color: 'text-yellow-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[hsl(var(--fg))]">Dashboard</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Overview of your store (Backend required for live data)
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-[hsl(var(--card))]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                  {stat.title}
                </CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[hsl(var(--fg))]">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-[hsl(var(--card))]">
        <CardHeader>
          <CardTitle className="text-[hsl(var(--fg))]">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-[hsl(var(--muted-foreground))]">
            No orders yet. Enable Lovable Cloud to manage orders.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
