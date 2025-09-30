import CategoriesMasonry from "@/components/common/CategoriesMasonry";
import FAQSection from "@/components/common/FAQSection";
import FeaturedProductsSection from "@/components/common/FeaturedProductsSection";
import Header from "@/components/common/Header";
import HeroSection from "@/components/common/HeroSection";
import TestimonialsSection from "@/components/common/TestimonialsSection";
import TrendyCollectionSection from "@/components/common/TrendyCollection";

function HomePage() {
  return (
    <div className="relative">
      <Header forceScrolledStyle={true} />
      <HeroSection />
      <TrendyCollectionSection />
      <FeaturedProductsSection /> {/* 👈 Ajoutez ici */}
      <CategoriesMasonry/>
      <TestimonialsSection/>
      <FAQSection/>
    </div>
  );
}

export default HomePage;