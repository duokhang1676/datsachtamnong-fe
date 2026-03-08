import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { SITE_INFO } from "@/data/constants";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://datsachtamnong.com'),
  title: SITE_INFO.seo?.metaTitle || SITE_INFO.siteName,
  description: SITE_INFO.seo?.metaDescription || "",
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://datsachtamnong.com/',
    siteName: SITE_INFO.siteName,
    title: SITE_INFO.seo?.metaTitle || SITE_INFO.siteName,
    description: SITE_INFO.seo?.metaDescription || "",
    images: [
      {
        url: 'https://datsachtamnong.com/banner3.png',
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
    images: ['https://datsachtamnong.com/banner3.png'],
  },
  alternates: {
    canonical: 'https://datsachtamnong.com',
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
  // Organization structured data for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Đất Sạch Tam Nông",
    "url": "https://datsachtamnong.com",
    "logo": "https://datsachtamnong.com/logo.png",
    "description": "Chuyên cung cấp đất hữu cơ, phân bón sạch chất lượng cao từ Vĩnh Long. Sản phẩm 100% hữu cơ, an toàn cho cây trồng và môi trường.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Vĩnh Long",
      "addressRegion": "Vĩnh Long",
      "addressCountry": "VN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "Vietnamese"
    },
    "sameAs": [
      "https://www.facebook.com/datsachtamnong",
      "https://zalo.me/datsachtamnong"
    ]
  };

  return (
    <html lang="vi" suppressHydrationWarning className="notranslate" translate="no">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
