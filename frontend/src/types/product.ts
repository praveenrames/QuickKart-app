export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number; // percentage
  category: string;
  brand: string;
  image: string;
  rating: number;
  stock: number;
  highlights: string[];
}

export interface Category {
  id: string;
  name: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  _id?: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile?: string;
  token?: string;
  role?: string;
}
