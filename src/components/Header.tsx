import { ShoppingCart, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const Header = () => {
  const [cartCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-theme">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-primary">Sri Sai Foods</h1>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/category/pickles" className="transition-colors hover:text-primary">
              Pickles
            </Link>
            <Link to="/category/podulu" className="transition-colors hover:text-primary">
              Podulu
            </Link>
            <Link to="/category/snacks" className="transition-colors hover:text-primary">
              Snacks
            </Link>
            <Link to="/category/pulses" className="transition-colors hover:text-primary">
              Organic Pulses
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <ThemeSwitcher />
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
