import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { SITE_INFO } from "@/data/constants";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://datsachtamnong-fe.vercel.app'),
  title: SITE_INFO.seo?.metaTitle || SITE_INFO.siteName,
  description: SITE_INFO.seo?.metaDescription || "",
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://datsachtamnong-fe.vercel.app/',
    siteName: SITE_INFO.siteName,
    title: SITE_INFO.seo?.metaTitle || SITE_INFO.siteName,
    description: SITE_INFO.seo?.metaDescription || "",
    images: [
      {
        url: 'https://datsachtamnong-fe.vercel.app/banner3.png',
        width: 1200,
        height: 630,
        alt: SITE_INFO.siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_INFO.seo?.metaTitle || SITE_INFO.siteName,
    description: SITE_INFO.seo?.metaDescription || "",
    images: ['https://datsachtamnong-fe.vercel.app/banner3.png'],
  },
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
