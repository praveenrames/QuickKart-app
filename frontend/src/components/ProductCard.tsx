import React from "react";
import { Product } from "@/types/product";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const discountedPrice = product.price - (product.price * product.discount) / 100;

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        {product.discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
            -{product.discount}%
          </Badge>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            Only {product.stock} left
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.brand} · {product.category}</p>
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-2">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="text-xs font-medium">{product.rating}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">₹{Math.round(discountedPrice)}</span>
          {product.discount > 0 && (
            <span className="text-sm text-muted-foreground line-through">₹{product.price}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
