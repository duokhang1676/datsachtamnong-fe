"use client";

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  // Prevent hydration mismatch by waiting for mount
  if (!mounted) {
    return (
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          {isAdminRoute ? (
            // Admin routes: No Header/Footer
            <>{children}</>
          ) : (
            // Customer routes: With Header/Footer
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          )}
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
