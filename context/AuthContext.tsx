"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import * as authService from "@/services/authService";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = await authService.getMe();
        setUser(userData);
      }
    } catch (err: any) {
      console.error("Auth check failed:", err);
      // Clear invalid token
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login({ email, password });
      setUser(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Đăng nhập thất bại";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register({ name, email, password, phone });
      setUser(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Đăng ký thất bại";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
