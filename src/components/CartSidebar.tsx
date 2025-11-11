import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CartSidebar = () => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg bg-[hsl(var(--bg))]">
        <SheetHeader>
          <SheetTitle className="text-[hsl(var(--fg))]">Shopping Cart ({cart.itemCount})</SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ShoppingBag className="w-16 h-16 text-[hsl(var(--muted-foreground))] mb-4" />
            <p className="text-[hsl(var(--muted-foreground))] mb-4">Your cart is empty</p>
            <Button onClick={closeCart}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={`${item.product.id}-${item.variant.label}`}
                  className="flex gap-4 p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-[hsl(var(--fg))]">{item.product.name}</h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                          {item.variant.label}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.product.id, item.variant.label)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 border border-[hsl(var(--border))] rounded">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.product.id, item.variant.label, item.quantity - 1)
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-[hsl(var(--fg))]">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.product.id, item.variant.label, item.quantity + 1)
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="font-semibold text-[hsl(var(--primary))]">
                        ₹{(item.variant.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[hsl(var(--border))] pt-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-[hsl(var(--fg))]">Total:</span>
                <span className="text-[hsl(var(--primary))]">₹{cart.total.toFixed(2)}</span>
              </div>
              <Button onClick={handleCheckout} className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
