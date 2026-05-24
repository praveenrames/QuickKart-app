import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const { getProduct } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);

  const product = getProduct(id || "");

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-lg text-muted-foreground">Product not found</p>
          <Button variant="link" onClick={() => navigate("/")}>Back to shop</Button>
        </div>
      </div>
    );
  }

  const discountedPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            {product.discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-sm px-3 py-1">
                -{product.discount}% OFF
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div>
              <p className="text-sm text-muted-foreground">{product.brand} · {product.category}</p>
              <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md">
                <Star className="h-4 w-4 fill-primary" />
                <span className="text-sm font-semibold">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">₹{Math.round(discountedPrice)}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-muted-foreground line-through">₹{product.price}</span>
                  <span className="text-sm font-medium text-primary">Save ₹{Math.round(product.price * product.discount / 100)}</span>
                </>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Highlights */}
            {product.highlights.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Highlights</h3>
                <ul className="space-y-1.5">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" /> {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border rounded-lg">
                <Button variant="ghost" size="icon" onClick={() => setQty(Math.max(1, qty - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <Button variant="ghost" size="icon" onClick={() => setQty(Math.min(product.stock, qty + 1))}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                className="flex-1"
                disabled={product.stock === 0}
                onClick={() => {
                  addToCart(product, qty);
                  toast({ title: `${product.name} added to cart` });
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
