import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
];

export const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[hsl(var(--muted))]">
      <aside className="w-64 bg-[hsl(var(--bg))] border-r border-[hsl(var(--border))] p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[hsl(var(--fg))]">Admin Panel</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Sri Sai Foods</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'text-[hsl(var(--fg))] hover:bg-[hsl(var(--muted))]'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-8">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/">
              <LogOut className="w-4 h-4 mr-2" />
              Back to Store
            </Link>
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};
