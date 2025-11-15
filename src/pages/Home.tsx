import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { ArrowRight, Shield, Truck, Heart } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';
import categoryPickles from '@/assets/category-pickles.jpg';
import categoryPodulu from '@/assets/category-podulu.jpg';
import categorySnacks from '@/assets/category-snacks.jpg';
import categoryPulses from '@/assets/category-pulses.jpg';

const categories = [
  { name: 'Pickles', slug: 'pickles', image: categoryPickles, description: 'Traditional & tangy' },
  { name: 'Podulu', slug: 'podulu', image: categoryPodulu, description: 'Aromatic powders' },
  { name: 'Snacks', slug: 'snacks', image: categorySnacks, description: 'Crispy & delicious' },
  { name: 'Organic Pulses', slug: 'pulses', image: categoryPulses, description: 'Pure & nutritious' },
];

const features = [
  {
    icon: Shield,
    title: 'Premium Quality',
    description: 'Handpicked ingredients and traditional recipes passed down through generations',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick and reliable shipping across India with real-time tracking',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every product crafted with care in our traditional South Indian kitchen',
  },
];

export default function Home() {
  const { products, loading } = useProducts();

  return (
    <div className="transition-theme">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <img
          src={heroBanner}
          alt="Sri Sai Foods - Authentic South Indian Foods"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="container relative mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Authentic South Indian{' '}
              <span className="text-primary">Flavors</span> Delivered Home
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Experience the warmth of traditional recipes with our handcrafted pickles, podulu, snacks, and organic pulses.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/category/pickles">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our wide range of authentic South Indian products
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-lg aspect-square"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold mb-1 text-foreground">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <Button variant="link" className="mt-2 p-0 h-auto font-semibold text-primary">
                    Explore <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Customer favorites that keep coming back
            </p>
          </div>
          {loading ? (
            <div className="text-center text-muted-foreground">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-muted-foreground">No products available</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Sri Sai Foods?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
