import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const { items, total, totalDiscount, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [address, setAddress] = useState({ name: "", phone: "", street: "", city: "", pincode: "" });

  const handlePayment = () => {
    if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) {
      toast({ title: "Please fill all address fields", variant: "destructive" });
      return;
    }

    // Load Razorpay script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      const options = {
        key: "rzp_test_placeholder", // Replace with your Razorpay Key ID
        amount: Math.round(total) * 100, // amount in paise
        currency: "INR",
        name: "ShopVibe",
        description: `Order of ${items.length} items`,
        handler: function () {
          setOrderPlaced(true);
          clearCart();
          toast({ title: "Payment successful! Order placed." });
        },
        prefill: { name: address.name, contact: address.phone },
        theme: { color: "#f97316" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    };
    document.body.appendChild(script);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <CheckCircle className="h-20 w-20 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
          <p className="text-muted-foreground mb-6">Thank you for shopping with ShopVibe</p>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Street Address</Label>
                <Input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Pincode</Label>
                  <Input value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="truncate flex-1">{product.name} × {quantity}</span>
                  <span className="font-medium ml-2">₹{Math.round((product.price - product.price * product.discount / 100) * quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{Math.round(subtotal)}</span></div>
                <div className="flex justify-between text-primary"><span>Discount</span><span>-₹{Math.round(totalDiscount)}</span></div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span>₹{Math.round(total)}</span></div>
              </div>
              <Button className="w-full" size="lg" onClick={handlePayment}>
                Pay ₹{Math.round(total)} with Razorpay
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
