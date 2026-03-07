import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import CategorySection from "@/components/home/CategorySection";
import ProductSection from "@/components/home/ProductSection";
import NewsSection from "@/components/home/NewsSection";
import FeaturesSection from "@/components/home/FeaturesSection";

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
