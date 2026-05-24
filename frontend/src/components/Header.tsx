import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ShoppingCart, LayoutDashboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProfileMenu from "@/components/ProfileMenu";

const Header = () => {
  const { user, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <ShoppingBag className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">QuickKart</span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isAdmin && (
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
                  <LayoutDashboard className="mr-1 h-4 w-4" /> Admin
                </Button>
              )}
              <Button variant="ghost" size="sm" className="relative" onClick={() => navigate("/cart")}>
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    {totalItems}
                  </Badge>
                )}
              </Button>
              <ProfileMenu />
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Sign In</Button>
              <Button size="sm" onClick={() => navigate("/register")}>Sign Up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
