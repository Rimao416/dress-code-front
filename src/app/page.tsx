"use client"
import React, { useState } from 'react';
import { ChevronDown, Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { DropdownContent, FeaturedItem, navigationData, NavLink, NavSection } from '@/components/Header/NavigationData';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { sliderData } from '@/constant/data';

// Données du slider

const HomePage = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleMouseEnter = (menu: string) => {
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setExpandedMobileSection(null);
  };

  const toggleMobileSection = (section: string) => {
    setExpandedMobileSection(expandedMobileSection === section ? null : section);
  };

  const renderDropdownContent = (content: DropdownContent) => {
    if (!content) return null;
    return (
      <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t z-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column */}
            {content.left && content.left.length > 0 && (
              <div className="col-span-2">
                <div className="space-y-2">
                  {content.left.map((item: NavLink, index: number) => (
                    <a
                      key={index}
                      href={item.link}
                      className="block text-sm font-medium text-gray-900 hover:text-gray-600 py-1"
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {/* Center Columns */}
            <div className={`${content.left && content.left.length > 0 ? 'col-span-6' : 'col-span-8'}`}>
              <div className="grid grid-cols-2 gap-8">
                {content.right?.map((section: NavSection, index: number) => (
                  <div key={index}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items?.map((item: NavLink, itemIndex: number) => (
                        <a
                          key={itemIndex}
                          href={item.link}
                          className="block text-sm text-gray-700 hover:text-gray-900 py-1"
                        >
                          {item.title}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right Column - Featured */}
            <div className="col-span-4">
              {content.featured && !Array.isArray(content.featured) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <img
                    src={content.featured.image}
                    alt={content.featured.title}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {content.featured.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {content.featured.description}
                  </p>
                </div>
              )}
             
              {content.featured && Array.isArray(content.featured) && (
                <div className="space-y-4">
                  {content.featured.map((item: FeaturedItem, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMobileMenu = () => {
    const mobileMenuItems = [
      { key: 'New', label: 'New', hasDropdown: false, link: '/new' },
      { key: 'Best Sellers', label: 'Best Sellers', hasDropdown: false, link: '/best-sellers' },
      { key: 'Vêtements', label: 'Clothing', hasDropdown: true },
      { key: 'Soutiens-gorge', label: 'Bras', hasDropdown: true },
      { key: 'Sous-vêtements', label: 'Underwear', hasDropdown: true },
      { key: 'Gainage', label: 'Shapewear', hasDropdown: true },
      { key: 'Maillots de bain', label: 'Swim', hasDropdown: true },
      { key: 'Homme', label: 'Mens', hasDropdown: false, link: '/mens' },
      { key: 'Collections', label: 'Collections', hasDropdown: true },
      { key: 'Plus', label: 'More', hasDropdown: true }
    ];

    return (
      <div className="md:hidden">
        {/* Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMobileMenu}></div>
        )}
        {/* Mobile Menu */}
        <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-4">
            {/* Close Button */}
            <div className="flex justify-end mb-6">
              <button onClick={toggleMobileMenu} className="p-2">
                <X className="h-6 w-6" />
              </button>
            </div>
            {/* Menu Items */}
            <div className="space-y-0">
              {mobileMenuItems.map((item) => (
                <div key={item.key} className="border-b border-gray-200">
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => toggleMobileSection(item.key)}
                        className="w-full flex items-center justify-between py-4 text-left text-gray-900 font-medium"
                      >
                        {item.label}
                        <ChevronDown className={`h-4 w-4 transform transition-transform ${
                          expandedMobileSection === item.key ? 'rotate-180' : ''
                        }`} />
                      </button>
                     
                      {expandedMobileSection === item.key && navigationData[item.key]?.content && (
                        <div className="pb-4">
                          {/* Left section items */}
                          {navigationData[item.key].content!.left.map((linkItem, index) => (
                            <a
                              key={index}
                              href={linkItem.link}
                              className="block py-2 pl-4 text-sm text-gray-700 hover:text-gray-900"
                            >
                              {linkItem.title}
                            </a>
                          ))}
                         
                          {/* Right section items */}
                          {navigationData[item.key].content!.right.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="mt-4">
                              <h4 className="text-sm font-semibold text-gray-900 pl-4 mb-2 uppercase tracking-wide">
                                {section.title}
                              </h4>
                              {section.items?.map((linkItem, linkIndex) => (
                                <a
                                  key={linkIndex}
                                  href={linkItem.link}
                                  className="block py-2 pl-6 text-sm text-gray-700 hover:text-gray-900"
                                >
                                  {linkItem.title}
                                </a>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={item.link}
                      className="block py-4 text-gray-900 font-medium"
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section avec slider */}
      <div className="relative h-screen w-full overflow-hidden">
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          effect="fade"
          fadeEffect={{
            crossFade: true
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{
            el: '.swiper-pagination',
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
          className="h-full w-full"
        >
     {sliderData.map((slide, index) => (
  <SwiperSlide key={index}>
    <div className="relative h-full w-full">
      {/* Image de fond - Version corrigée */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${slide.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay réduit pour moins d'assombrissement */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
     
      {/* Alternative avec balise img si le background ne fonctionne pas */}
      {/* 
      <img 
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      */}
     
      {/* Contenu du slide */}
      <div className="absolute bottom-8 left-8 z-20 text-white max-w-sm">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-wide transform transition-all duration-700 delay-300">
          {slide.title}
        </h2>
        <p className="text-lg mb-6 opacity-90 font-light transform transition-all duration-700 delay-500">
          {slide.subtitle}
        </p>
        <a
          href={slide.buttonLink}
          className="inline-block text-white border-b-2 border-white pb-1 hover:border-gray-300 hover:text-gray-300 transition-colors duration-200 font-medium transform transition-all duration-700 delay-700"
        >
          {slide.buttonText}
        </a>
      </div>
    </div>
  </SwiperSlide>
))}
        </Swiper>

        {/* Navigation personnalisée */}
        <div className="swiper-button-prev !text-white !text-2xl !left-4 !top-1/2 !w-12 !h-12 !mt-0 after:!text-xl opacity-70 hover:opacity-100 transition-opacity duration-300"></div>
        <div className="swiper-button-next !text-white !text-2xl !right-4 !top-1/2 !w-12 !h-12 !mt-0 after:!text-xl opacity-70 hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Pagination personnalisée */}
        <div className="swiper-pagination !bottom-8 !right-8 !left-auto !w-auto flex space-x-2"></div>

        {/* Header avec fond transparent/translucide */}
        <header className="absolute top-0 left-0 right-0 z-30 bg-black bg-opacity-20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <a href="/" className="text-2xl font-bold text-white tracking-tight">
                  DressCode
                </a>
              </div>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                {Object.entries(navigationData).map(([key, nav]: [string, NavigationItem]) => (
                  <div
                    key={key}
                    className="relative"
                    onMouseEnter={() => nav.hasDropdown && handleMouseEnter(key)}
                    onMouseLeave={() => nav.hasDropdown && handleMouseLeave()}
                  >
                    {nav.hasDropdown ? (
                      <button className="flex items-center text-sm font-medium text-white hover:text-black hover:bg-white px-3 py-2 rounded transition-all duration-200">
                        {key}
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </button>
                    ) : (
                      <a
                        href={nav.link}
                        className="text-sm font-medium text-white hover:text-black hover:bg-white px-3 py-2 rounded transition-all duration-200"
                      >
                        {key}
                      </a>
                    )}
                  </div>
                ))}
              </nav>
              {/* Right Icons */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button className="p-2 text-white hover:text-gray-300 transition-colors duration-200">
                  <Search className="h-5 w-5" />
                </button>
                <button className="hidden sm:block p-2 text-white hover:text-gray-300 transition-colors duration-200">
                  <User className="h-5 w-5" />
                </button>
                <button className="p-2 text-white hover:text-gray-300 relative transition-colors duration-200">
                  <Heart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    1
                  </span>
                </button>
                <button className="p-2 text-white hover:text-gray-300 transition-colors duration-200">
                  <ShoppingBag className="h-5 w-5" />
                </button>
               
                {/* Mobile Menu Button */}
                <button
                  className="md:hidden p-2 text-white hover:text-gray-300 transition-colors duration-200"
                  onClick={toggleMobileMenu}
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          {/* Desktop Dropdown Menus */}
          {activeDropdown && navigationData[activeDropdown]?.hasDropdown && navigationData[activeDropdown].content && (
            <div
              onMouseEnter={() => handleMouseEnter(activeDropdown)}
              onMouseLeave={handleMouseLeave}
            >
              {renderDropdownContent(navigationData[activeDropdown].content!)}
            </div>
          )}
        </header>
      </div>

      {/* Mobile Menu */}
      {renderMobileMenu()}

      {/* Styles personnalisés pour Swiper */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 12px !important;
          height: 12px !important;
          background: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
        }
        
        .swiper-pagination-bullet-active {
          background: white !important;
        }
        
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px !important;
          font-weight: bold !important;
        }
      `}</style>
    </div>
  );
};

export default HomePage;