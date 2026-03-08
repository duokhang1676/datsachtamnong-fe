import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import CategorySection from "@/components/home/CategorySection";
import ProductSection from "@/components/home/ProductSection";
import NewsSection from "@/components/home/NewsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đất Sạch Tam Nông - Đất Hữu Cơ Sạch Chất Lượng Cao Từ Vĩnh Long",
  description: "Đất Sạch Tam Nông cung cấp đất hữu cơ, phân bón sạch chất lượng cao từ Vĩnh Long. Sản phẩm 100% hữu cơ, an toàn cho cây trồng và môi trường. Giao hàng toàn quốc.",
  keywords: "đất sạch, đất hữu cơ, phân bón hữu cơ, đất trồng cây, đất Tam Nông, đất Vĩnh Long, đất trồng rau, phân bón sạch",
  openGraph: {
    title: "Đất Sạch Tam Nông - Đất Hữu Cơ Sạch Chất Lượng Cao",
    description: "Chuyên cung cấp đất hữu cơ, phân bón sạch 100% tự nhiên. Giao hàng toàn quốc, cam kết chất lượng.",
    type: "website",
    url: "https://datsachtamnong.com",
  },
  alternates: {
    canonical: "https://datsachtamnong.com",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <CategorySection />
      <ProductSection 
        title="Sản phẩm nổi bật" 
        featured={true}
        limit={6}
      />
      <NewsSection />
      <FeaturesSection />
    </>
  );
}
