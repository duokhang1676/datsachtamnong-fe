"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as settingsService from "@/services/settingsService";
import type { SettingsData } from "@/services/settingsService";

interface SettingsContextType {
  settings: SettingsData | null;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err: any) {
      console.error("Failed to load settings:", err);
      setError(err.message || "Failed to load settings");
      // Set default fallback settings if API fails
      setSettings({
        siteName: "Đất Sạch Tâm Nông",
        slogan: "Chất lượng từ thiên nhiên",
        contactEmail: "datcsachtamnong@gmail.com",
        contactPhone: "0867.68.68.69",
        address: "123 Đường ABC, Quận XYZ, TP.HCM",
        factory: "Nhà máy sản xuất: 456 Đường DEF, Huyện GHI, Tỉnh JKL",
        socialMedia: {
          facebook: "https://facebook.com/datsachtamnong",
          zalo: "https://zalo.me/0867686869",
          instagram: "https://instagram.com/datsachtamnong"
        },
        seo: {
          metaTitle: "Đất Sạch Tâm Nông - Chất lượng từ thiên nhiên",
          metaDescription: "Cung cấp đất sạch hữu cơ chất lượng cao cho nông nghiệp"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = async () => {
    await fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, error, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
