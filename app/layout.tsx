import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { SITE_INFO } from "@/data/constants";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: SITE_INFO.seo?.metaTitle || SITE_INFO.siteName,
  description: SITE_INFO.seo?.metaDescription || "",
  other: {
    'google': 'notranslate', // Prevent Google Translate from causing hydration errors
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className="notranslate" translate="no">
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
