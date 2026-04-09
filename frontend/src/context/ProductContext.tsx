import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, Category } from "@/types/product";
import { defaultProducts, defaultCategories } from "@/data/seed";

interface ProductContextType {
  products: Product[];
  categories: Category[];
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType>({} as ProductContextType);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem("ecom_products");
    return stored ? JSON.parse(stored) : defaultProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = localStorage.getItem("ecom_categories");
    return stored ? JSON.parse(stored) : defaultCategories;
  });

  useEffect(() => {
    localStorage.setItem("ecom_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("ecom_categories", JSON.stringify(categories));
  }, [categories]);

  const addProduct = (p: Omit<Product, "id">) => {
    const newProduct = { ...p, id: `p-${Date.now()}` } as Product;
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addCategory = (name: string) => {
    setCategories((prev) => [...prev, { id: `cat-${Date.now()}`, name }]);
  };

  const updateCategory = (id: string, name: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const getProduct = (id: string) => products.find((p) => p.id === id);

  return (
    <ProductContext.Provider value={{ products, categories, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory, getProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
