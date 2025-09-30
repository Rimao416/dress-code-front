import CategoriesMasonry from "@/components/common/CategoriesMasonry";
import FAQSection from "@/components/common/FAQSection";
import FeaturedProductsSection from "@/components/common/FeaturedProductsSection";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import HeroSection from "@/components/common/HeroSection";
import MemberProgramSection from "@/components/common/MemberProgramSection";
import TestimonialsSection from "@/components/common/TestimonialsSection";
import TrendyCollectionSection from "@/components/common/TrendyCollection";
import WelcomeSection from "@/components/common/WelcomSection";

function HomePage() {
  return (
    <div className="relative">
      <Header forceScrolledStyle={true} />
      <HeroSection />
      <TrendyCollectionSection />
      <FeaturedProductsSection /> 
      <WelcomeSection/>
      <CategoriesMasonry/>
      <TestimonialsSection/>
      <FAQSection/>
      <MemberProgramSection/>
      <Footer/>
    </div>
  );
}

export default HomePage;