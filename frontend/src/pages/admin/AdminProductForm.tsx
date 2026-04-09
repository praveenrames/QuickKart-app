import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { getProduct, addProduct, updateProduct, categories } = useProducts();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "", description: "", price: "", discount: "", category: "",
    brand: "", image: "", stock: "", highlights: "",
    rating: "4.0",
  });

  useEffect(() => {
    if (isEdit && id) {
      const p = getProduct(id);
      if (p) {
        setForm({
          name: p.name, description: p.description, price: String(p.price),
          discount: String(p.discount), category: p.category, brand: p.brand,
          image: p.image, stock: String(p.stock), highlights: p.highlights.join(", "),
          rating: String(p.rating),
        });
      }
    }
  }, [id, isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      discount: Number(form.discount),
      category: form.category,
      brand: form.brand,
      image: form.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      stock: Number(form.stock),
      rating: Number(form.rating),
      highlights: form.highlights.split(",").map((h) => h.trim()).filter(Boolean),
    };

    if (isEdit && id) {
      updateProduct(id, data);
      toast({ title: "Product updated" });
    } else {
      addProduct(data);
      toast({ title: "Product added" });
    }
    navigate("/admin/products");
  };

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  return (
    <div className="p-6 max-w-2xl">
      <Button variant="ghost" size="sm" onClick={() => navigate("/admin/products")} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Products
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Product" : "Add New Product"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Brand</Label>
                <Input value={form.brand} onChange={(e) => update("brand", e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} required />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Discount (%)</Label>
                <Input type="number" min="0" max="100" value={form.discount} onChange={(e) => update("discount", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(val) => update("category", val)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Rating</Label>
                <Input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => update("rating", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Highlights (comma separated)</Label>
              <Input value={form.highlights} onChange={(e) => update("highlights", e.target.value)} placeholder="Feature 1, Feature 2, ..." />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit">{isEdit ? "Update Product" : "Add Product"}</Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductForm;
