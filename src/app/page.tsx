import React from 'react';
import Header from '@/components/common/Header';
import HeroSection from '@/components/common/HeroSection';

function HomePage() {
  return (
    <div className="relative">
      {/* Header avec style transparent initial */}
      <Header forceScrolledStyle={true} />
      
      {/* Hero Section - prend toute la hauteur de l'écran */}
      <HeroSection />
      
      {/* Le reste de votre contenu home ici */}
      <div className="relative z-10">
        {/* Vos autres sections : FeaturedProducts, Categories, etc. */}
      </div>
    </div>
  );
}

export default HomePage;