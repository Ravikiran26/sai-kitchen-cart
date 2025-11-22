// src/pages/Checkout.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '@/api/client';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Prefill with demo values – you can make these empty strings if you prefer
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('john@example.com');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const isFormValid = Boolean(
    firstName.trim() &&
      lastName.trim() &&
      phone.trim() &&
      address.trim() &&
      city.trim() &&
      state.trim() &&
      pincode.trim() &&
      cart.items.length > 0
  );

  const handlePlaceOrder = async () => {
    if (!isFormValid || submitting) return;

    // Build a simple full address string
    const fullAddress = `${address}, ${city}, ${state} - ${pincode}`.trim();

    // Map cart items to backend expected format
    const items = cart.items
      .map((item) => {
        // We expect each variant (from backend) to carry an id
        const variantId = (item.variant as any).id as number | undefined;
        if (!variantId) return null; // Skip if no backend id (safety net)
        return {
          variant_id: variantId,
          quantity: item.quantity,
        };
      })
      .filter(Boolean) as { variant_id: number; quantity: number }[];

    if (items.length === 0) {
      toast.error('Cannot place order', {
        description: 'Some items are missing variant IDs. Please refresh and try again.',
      });
      return;
    }

    const payload = {
      customer_name: `${firstName} ${lastName}`.trim(),
      phone,
      address: fullAddress,
      payment_method: 'COD', // You can change this when Razorpay integration is added
      items,
    };

    try {
      setSubmitting(true);
      await post('/orders', payload); // calls http://localhost:8000/orders (or your configured API base)
      toast.success('Order placed successfully!', {
        description: 'We will contact you soon to confirm delivery.',
      });
      clearCart();
      navigate('/'); // or navigate('/order-success') if you make a success page
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to place order', {
        description: err?.message ?? 'Please try again later.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 grid gap-8 lg:grid-cols-[2fr,1fr]">
      {/* Shipping address */}
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Checkout</h1>

        <div className="space-y-4 rounded-lg border p-4 md:p-6 bg-background">
          <h2 className="font-semibold text-lg mb-2">Shipping Address</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>First Name</Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <Label>Address</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>City</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <Label>State</Label>
              <Input
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <div>
              <Label>Pincode</Label>
              <Input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Order summary + button */}
      <div className="space-y-4">
        <div className="rounded-lg border p-4 md:p-6 bg-background">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

          <div className="space-y-2 text-sm mb-4">
            {cart.items.map((item) => (
              <div
                key={`${item.product.id}-${item.variant.label}`}
                className="flex justify-between"
              >
                <span>
                  {item.product.name} ({item.variant.label}) × {item.quantity}
                </span>
                <span>₹{item.variant.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold text-base mb-4">
            <span>Total</span>
            <span>₹{cart.total}</span>
          </div>

          <Button
            className="w-full"
            onClick={handlePlaceOrder}
            disabled={!isFormValid || submitting}
          >
            {submitting ? 'Placing Order…' : 'Place Order'}
          </Button>
        </div>
      </div>
    </div>
  );
}
