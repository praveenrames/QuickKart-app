import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types/product";
import { registerUser, loginUser } from "@/utils/api";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const ADMIN_EMAIL = "admin@admin.com";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ecom_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // split name into firstname/lastname
    const parts = name.trim().split(" ");
    const firstname = parts.shift() || "";
    const lastname = parts.join(" ") || "";
    try {
      await registerUser({ firstname, lastname, email, password, role: "user" });
      return true;
    } catch (err) {
      console.error("Register error:", err);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    // Admin shortcut for local demo
    if (email === ADMIN_EMAIL && password === "admin123") {
      const adminUser = { email: ADMIN_EMAIL, name: "Admin", password: "admin123" } as unknown as User;
      setUser(adminUser);
      localStorage.setItem("ecom_user", JSON.stringify(adminUser));
      return { success: true, message: "Admin login" };
    }
    try {
      const data = await loginUser({ email, password });
      const serverUser: any = {
        _id: data._id,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        mobile: data.mobile,
        token: data.token,
      };
      setUser(serverUser as User);
      localStorage.setItem("ecom_user", JSON.stringify(serverUser));
      localStorage.setItem("ecom_token", data.token);
      return { success: true, message: (data && data.message) || "Login successful" };
    } catch (err: any) {
      console.error("Login error:", err);
      return { success: false, message: err?.message || "Login failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ecom_user");
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
