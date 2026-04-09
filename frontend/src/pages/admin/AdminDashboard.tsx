import React from "react";
import { useProducts } from "@/context/ProductContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Tags, AlertTriangle, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const { products, categories } = useProducts();
  const lowStock = products.filter((p) => p.stock < 10);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "text-primary" },
    { label: "Categories", value: categories.length, icon: Tags, color: "text-primary" },
    { label: "Low Stock Alerts", value: lowStock.length, icon: AlertTriangle, color: "text-destructive" },
    { label: "Inventory Value", value: `₹${totalValue.toLocaleString()}`, icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-accent ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lowStock.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Low Stock Products</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                    <span className="text-sm font-medium">{p.name}</span>
                  </div>
                  <span className="text-sm text-destructive font-medium">{p.stock} left</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
