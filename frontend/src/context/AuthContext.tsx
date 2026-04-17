import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types/product";
import { registerUser, loginUser } from "@/utils/api";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (firstname: string, lastname: string, email: string, mobile: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ecom_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const register = async (firstname: string, lastname: string, email: string, mobile: string, password: string): Promise<boolean> => {
    try {
      await registerUser({ firstname, lastname, email, mobile, password, role: "user" });
      return true;
    } catch (err) {
      console.error("Register error:", err);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const data = await loginUser({ email, password });
      const serverUser: User = {
        _id: data._id,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        mobile: data.mobile,
        token: data.token,
        role: data.role,
      };
      setUser(serverUser);
      localStorage.setItem("ecom_user", JSON.stringify(serverUser));
      localStorage.setItem("ecom_token", data.token);
      return { success: true, message: data.message || "Login successful" };
    } catch (err: any) {
      console.error("Login error:", err);
      return { success: false, message: err?.message || "Login failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ecom_user");
    localStorage.removeItem("ecom_token");
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
