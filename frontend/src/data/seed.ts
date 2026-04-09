import { Product, Category } from "@/types/product";

export const defaultCategories: Category[] = [
  { id: "cat-1", name: "Electronics" },
  { id: "cat-2", name: "Clothing" },
  { id: "cat-3", name: "Home & Kitchen" },
  { id: "cat-4", name: "Sports" },
  { id: "cat-5", name: "Books" },
];

export const defaultProducts: Product[] = [
  {
    id: "p1", name: "Wireless Bluetooth Headphones", description: "Premium noise-cancelling wireless headphones with 30-hour battery life and deep bass.", price: 2999, discount: 20, category: "Electronics", brand: "SoundMax",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", rating: 4.5, stock: 25,
    highlights: ["30hr battery", "Active Noise Cancellation", "Bluetooth 5.0", "Foldable design"],
  },
  {
    id: "p2", name: "Smart Fitness Watch", description: "Track your health and fitness with heart rate monitoring, GPS, and water resistance.", price: 4999, discount: 15, category: "Electronics", brand: "FitTech",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", rating: 4.2, stock: 40,
    highlights: ["Heart rate monitor", "GPS tracking", "Water resistant", "7-day battery"],
  },
  {
    id: "p3", name: "Cotton Casual T-Shirt", description: "Comfortable 100% cotton t-shirt perfect for everyday wear.", price: 599, discount: 10, category: "Clothing", brand: "UrbanWear",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", rating: 4.0, stock: 100,
    highlights: ["100% Cotton", "Machine washable", "Multiple colors", "Breathable fabric"],
  },
  {
    id: "p4", name: "Stainless Steel Water Bottle", description: "Double-wall insulated bottle that keeps drinks cold for 24hrs and hot for 12hrs.", price: 899, discount: 5, category: "Home & Kitchen", brand: "HydroLife",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop", rating: 4.7, stock: 60,
    highlights: ["Double-wall insulation", "BPA free", "Leak-proof lid", "500ml capacity"],
  },
  {
    id: "p5", name: "Yoga Mat Premium", description: "Extra thick non-slip yoga mat with carrying strap for comfortable workouts.", price: 1299, discount: 25, category: "Sports", brand: "FlexFit",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop", rating: 4.3, stock: 35,
    highlights: ["6mm thickness", "Non-slip surface", "Eco-friendly material", "Carrying strap included"],
  },
  {
    id: "p6", name: "Wireless Charging Pad", description: "Fast wireless charger compatible with all Qi-enabled devices.", price: 1499, discount: 30, category: "Electronics", brand: "ChargePro",
    image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=400&h=400&fit=crop", rating: 4.1, stock: 50,
    highlights: ["15W fast charging", "LED indicator", "Anti-slip base", "Universal compatibility"],
  },
  {
    id: "p7", name: "Denim Jacket Classic", description: "Timeless denim jacket with a modern fit, perfect for layering.", price: 2499, discount: 0, category: "Clothing", brand: "DenimCo",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop", rating: 4.6, stock: 20,
    highlights: ["100% Denim", "Button closure", "Two chest pockets", "Classic fit"],
  },
  {
    id: "p8", name: "Non-Stick Cookware Set", description: "5-piece premium non-stick cookware set for healthy cooking.", price: 3499, discount: 18, category: "Home & Kitchen", brand: "ChefMaster",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", rating: 4.4, stock: 15,
    highlights: ["5-piece set", "PFOA-free coating", "Dishwasher safe", "Even heat distribution"],
  },
  {
    id: "p9", name: "Running Shoes Pro", description: "Lightweight breathable running shoes with superior cushioning.", price: 3999, discount: 12, category: "Sports", brand: "SprintX",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", rating: 4.8, stock: 30,
    highlights: ["Lightweight mesh upper", "Responsive cushioning", "Rubber outsole", "Reflective details"],
  },
  {
    id: "p10", name: "Bestseller Novel Collection", description: "Curated collection of 5 bestselling novels from top authors.", price: 1999, discount: 8, category: "Books", brand: "ReadMore",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop", rating: 4.5, stock: 45,
    highlights: ["5 bestselling novels", "Hardcover edition", "Gift-ready packaging", "Mixed genres"],
  },
  {
    id: "p11", name: "Portable Bluetooth Speaker", description: "Compact waterproof speaker with 360° sound and 12-hour playtime.", price: 1999, discount: 22, category: "Electronics", brand: "SoundMax",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop", rating: 4.3, stock: 55,
    highlights: ["360° sound", "IPX7 waterproof", "12hr battery", "Built-in mic"],
  },
  {
    id: "p12", name: "Resistance Bands Set", description: "Set of 5 resistance bands with different tension levels for full-body workouts.", price: 799, discount: 15, category: "Sports", brand: "FlexFit",
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop", rating: 4.1, stock: 70,
    highlights: ["5 resistance levels", "Natural latex", "Portable carry bag", "Exercise guide included"],
  },
];
