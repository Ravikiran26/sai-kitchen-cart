import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function Checkout() {
  const { cart } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-[hsl(var(--muted-foreground))]" />
        <h1 className="text-2xl font-bold mb-4 text-[hsl(var(--fg))]">Your cart is empty</h1>
        <Button onClick={() => navigate('/')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[hsl(var(--fg))]">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-[hsl(var(--card))]">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--fg))]">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Street address" />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="City" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="State" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" placeholder="123456" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--card))]">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--fg))]">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[hsl(var(--muted-foreground))]">
                Payment integration requires backend. Enable Lovable Cloud for Razorpay integration.
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-[hsl(var(--card))] sticky top-4">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--fg))]">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.map((item) => (
                <div key={`${item.product.id}-${item.variant.label}`} className="flex justify-between text-sm">
                  <span className="text-[hsl(var(--fg))]">
                    {item.product.name} ({item.variant.label}) x{item.quantity}
                  </span>
                  <span className="text-[hsl(var(--fg))]">
                    ₹{(item.variant.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              
              <div className="border-t border-[hsl(var(--border))] pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">Subtotal</span>
                  <span className="text-[hsl(var(--fg))]">₹{cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">Shipping</span>
                  <span className="text-[hsl(var(--fg))]">Calculated at next step</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[hsl(var(--border))]">
                  <span className="text-[hsl(var(--fg))]">Total</span>
                  <span className="text-[hsl(var(--primary))]">₹{cart.total.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" disabled>
                Place Order (Requires Backend)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
