"use client"
import React, { useState } from 'react';
import { ChevronDown, Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { DropdownContent, FeaturedItem, navigationData, NavigationItem, NavLink, NavSection } from '@/components/Header/NavigationData';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import {  newInData, productsData, sliderData } from '@/constant/data';

// Données du slider

const HomePage = () => {
  const toggleFavorite = (productId: number) => {
  setFavorites(prev => 
    prev.includes(productId) 
      ? prev.filter(id => id !== productId)
      : [...prev, productId]
  );
};
const [favorites, setFavorites] = useState<number[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [newInSlideIndex, setNewInSlideIndex] = useState(0);
const [newInSlidesCount, setNewInSlidesCount] = useState(0);
const [isNewInBeginning, setIsNewInBeginning] = useState(true);
const [isNewInEnd, setIsNewInEnd] = useState(false);

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
      {/* Utiliser une balise img au lieu de background-image */}
      <img
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          console.error('Erreur de chargement de l\'image:', slide.image);
          // Fallback vers une image par défaut ou une couleur
          e.currentTarget.style.display = 'none';
        }}
        onLoad={() => console.log('Image chargée:', slide.image)}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      {/* Contenu du slide */}
      <div className="absolute bottom-8 left-8 z-20 text-white max-w-sm">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-wide">
          {slide.title}
        </h2>
        <p className="text-lg mb-6 opacity-90 font-light">
          {slide.subtitle}
        </p>
        <a
          href={slide.buttonLink}
          className="inline-block text-white border-b-2 border-white pb-1 hover:border-gray-300 hover:text-gray-300 transition-colors duration-200 font-medium"
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
        <header className="absolute top-0 left-0 right-0 z-30 bg-transparent backdrop-blur-sm">
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
      {/* New In Section */}
     <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Content */}
            <div className="lg:w-1/3 flex flex-col justify-center">
              <div className="text-sm text-gray-600 mb-2 tracking-wider uppercase">
                977 NEW ITEMS
              </div>
              <h2 className="text-4xl lg:text-5xl font-serif text-black mb-6">
                New In
              </h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                New arrivals, now dropping five days a week – discover the latest launches onsite from Monday to Friday
              </p>
              <button className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors duration-200 w-fit">
                Shop New In
              </button>
            </div>

            {/* Right Content - Product Carousel */}
            <div className="lg:w-2/3">
              <div className="relative">
            <Swiper
                  modules={[Navigation]}
                  spaceBetween={20}
                  slidesPerView={1.2}
                  navigation={{
                    nextEl: '.new-in-button-next',
                    prevEl: '.new-in-button-prev',
                  }}
                  onSwiper={(swiper) => {
                    setNewInSlidesCount(swiper.slides.length);
                    setIsNewInBeginning(swiper.isBeginning);
                    setIsNewInEnd(swiper.isEnd);
                  }}
                  onSlideChange={(swiper) => {
                    setNewInSlideIndex(swiper.activeIndex);
                    setIsNewInBeginning(swiper.isBeginning);
                    setIsNewInEnd(swiper.isEnd);
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 2.2,
                    },
                    768: {
                      slidesPerView: 2.5,
                    },
                    1024: {
                      slidesPerView: 3.2,
                    },
                  }}
                  className="overflow-visible"
                >
                  {newInData.map((item) => (
                    <SwiperSlide key={item.id}>
                      <div className="bg-white group cursor-pointer">
                        <div className="aspect-square overflow-hidden bg-gray-100 mb-4">
                          <img
                            src={item.image}
                            alt={item.alt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              // Fallback en cas d'erreur de chargement
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBMMTMwIDEwMEgxMTBWMTMwSDkwVjEwMEg3MEwxMDAgNzBaIiBmaWxsPSIjOTQ5NEE0Ii8+Cjwvc3ZnPgo=';
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <h3 className="font-semibold text-black text-sm tracking-wide">
                            {item.brand}
                          </h3>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Navigation Arrows */}
            {/* Navigation Arrows */}
                {!isNewInBeginning && (
                  <button className="new-in-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-3 hover:bg-gray-50 transition-all duration-200 border border-gray-200">
                    <ChevronDown className="h-5 w-5 rotate-90 text-black" />
                  </button>
                )}
                {!isNewInEnd && (
                  <button className="new-in-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-3 hover:bg-gray-50 transition-all duration-200 border border-gray-200">
                    <ChevronDown className="h-5 w-5 -rotate-90 text-black" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
            {/* Full Screen Split Section */}
      <section className="h-screen w-full">
        <div className="flex h-full">
          {/* Left Half - Trending Tops */}
          <div className="w-1/2 relative overflow-hidden group cursor-pointer">
            <img
              src="/images/trending-tops.jpg"
              alt="Woman in purple knit top"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjOTMzM0VBIi8+CjxwYXRoIGQ9Ik00MDAgMzAwTDUwMCA0MDBINDE1MFY1MDBIMjUwVjQwMEgxNTBMNDAwIDMwMFoiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iNjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0OCIgZm9udC1mYW1pbHk9IkFyaWFsIj5UUkVORElORyBUT1BTPC90ZXh0Pgo8L3N2Zz4K';
              }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
            
            {/* Content */}
            <div className="absolute bottom-8 left-8 text-white z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide uppercase">
                Trending Tops
              </h3>
              <p className="text-lg mb-6 opacity-90 max-w-md leading-relaxed">
                New Sheer Knit tops and signature tees for a perfect fit every time
              </p>
              <a
                href="/trending-tops"
                className="inline-block text-white border-b-2 border-white pb-1 hover:border-gray-300 hover:text-gray-300 transition-colors duration-200 font-medium"
              >
                Shop Now
              </a>
            </div>
          </div>

          {/* Right Half - Must-Have Bottoms */}
          <div className="w-1/2 relative overflow-hidden group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Woman in snake print skirt"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjNkI3Mjk0Ii8+CjxwYXRoIGQ9Ik00MDAgMzAwTDUwMCA0MDBINDE1MFY1MDBIMjUwVjQwMEgxNTBMNDAwIDMwMFoiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iNTcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIj5NVVNULUFBVEU8L3RleHQ+Cjx0ZXh0IHg9IjQwMCIgeT0iNjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIj5CT1RUT01TPC90ZXh0Pgo8L3N2Zz4K';
              }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
            
            {/* Content */}
            <div className="absolute bottom-8 left-8 text-white z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide uppercase">
                Must-Have <span className="text-gray-300">Bottoms</span>
              </h3>
              <p className="text-lg mb-6 opacity-90 max-w-md leading-relaxed">
                Complete your look with ultra-flattering skirts, pants, and more
              </p>
              <a
                href="/must-have-bottoms"
                className="inline-block text-white border-b-2 border-white pb-1 hover:border-gray-300 hover:text-gray-300 transition-colors duration-200 font-medium"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </section>
          <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-sm font-medium text-black tracking-[0.2em] uppercase">
              The Brands On Our Radar
            </h2>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
            {productsData.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-square overflow-hidden bg-gray-100 relative">
                  <img
                    src={product.image}
                    alt={product.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwTDE5MCAxNDBIMTcwVjE4MEgxMzBWMTQwSDExMEwxNTAgMTAwWiIgZmlsbD0iIzk0OTRBNCIvPgo8L3N2Zz4K';
                    }}
                  />
                  
                  {/* Heart Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 group/heart"
                  >
                    <Heart 
                      className={`h-4 w-4 transition-all duration-200 ${
                        favorites.includes(product.id) 
                          ? 'fill-black text-black' 
                          : 'text-gray-600 hover:text-black'
                      }`}
                    />
                  </button>
                </div>
                
                {/* Product Info */}
                <div className="pt-3 space-y-1">
                  <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    {product.brand}
                  </h3>
                  <p className="text-sm text-black font-medium line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-sm font-semibold text-black">
                    ${product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
            <section className="h-screen w-full">
        <div className="flex h-full">
          {/* Left Half - Trending Tops */}
          <div className="w-1/2 relative overflow-hidden group cursor-pointer">
            <img
              src="/images/trending-tops.jpg"
              alt="Woman in purple knit top"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjOTMzM0VBIi8+CjxwYXRoIGQ9Ik00MDAgMzAwTDUwMCA0MDBINDE1MFY1MDBIMjUwVjQwMEgxNTBMNDAwIDMwMFoiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iNjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0OCIgZm9udC1mYW1pbHk9IkFyaWFsIj5UUkVORElORyBUT1BTPC90ZXh0Pgo8L3N2Zz4K';
              }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
            
            {/* Content */}
            <div className="absolute bottom-8 left-8 text-white z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide uppercase">
                Dress Shop
              </h3>
              <p className="text-lg mb-6 opacity-90 max-w-md leading-relaxed">
                One-and-done stunners for every occasion
              </p>
              <a
                href="/trending-tops"
                className="inline-block text-white border-b-2 border-white pb-1 hover:border-gray-300 hover:text-gray-300 transition-colors duration-200 font-medium"
              >
                Shop Now
              </a>
            </div>
          </div>

          {/* Right Half - Must-Have Bottoms */}
          <div className="w-1/2 relative overflow-hidden group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Woman in snake print skirt"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjNkI3Mjk0Ii8+CjxwYXRoIGQ9Ik00MDAgMzAwTDUwMCA0MDBINDE1MFY1MDBIMjUwVjQwMEgxNTBMNDAwIDMwMFoiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iNTcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIj5NVVNULUFBVEU8L3RleHQ+Cjx0ZXh0IHg9IjQwMCIgeT0iNjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIj5CT1RUT01TPC90ZXh0Pgo8L3N2Zz4K';
              }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
            
            {/* Content */}
            <div className="absolute bottom-8 left-8 text-white z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide uppercase">
                Occasion <span className="text-gray-300">Ready Solutions</span>
              </h3>
              <p className="text-lg mb-6 opacity-90 max-w-md leading-relaxed">
                No matter the look, our innovative bras and shapewear have you covered
              </p>
              <a
                href="/must-have-bottoms"
                className="inline-block text-white border-b-2 border-white pb-1 hover:border-gray-300 hover:text-gray-300 transition-colors duration-200 font-medium"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </section>

<section className="py-16 px-4 bg-white">
  <div className="max-w-7xl mx-auto">
    {/* Title */}
    <div className="text-center mb-12">
      <h2 className="text-4xl lg:text-5xl font-serif text-black mb-4">Shop By Category</h2>
      <p className="text-gray-600 text-lg">Discover premium essentials with style</p>
    </div>

    {/* Creative Grid */}
    <div
      className="grid gap-4"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gridTemplateRows: 'repeat(4, 150px)',
        gridTemplateAreas: `
          "a a b b c c"
          "a a d d e e"
          "f f g g e e"
          "f f h h i i"
        `,
      }}
    >
      {[
        { area: 'a', title: 'SHAPEWEAR', subtitle: 'Sculpt & Define', image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=500&auto=format&fit=crop' },
        { area: 'b', title: 'UNDERWEAR', image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=500&auto=format&fit=crop' },
        { area: 'c', title: 'SLEEP', image: 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?q=80&w=500&auto=format&fit=crop' },
        { area: 'd', title: 'MENS', image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=500&auto=format&fit=crop' },
        { area: 'e', title: 'BRAS', image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=500&auto=format&fit=crop' },
        { area: 'f', title: 'SWIMWEAR', subtitle: 'Beach Ready', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?q=80&w=500&auto=format&fit=crop' },
        { area: 'g', title: 'ACTIVEWEAR', image: 'https://images.unsplash.com/photo-1506629905607-d9dda7bed44b?q=80&w=500&auto=format&fit=crop' },
        { area: 'h', title: 'ACCESSORIES', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500&auto=format&fit=crop' },
        { area: 'i', title: 'LUXE', subtitle: 'Limited Edition', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=500&auto=format&fit=crop' },
      ].map((item, i) => (
        <div
          key={i}
          className="relative overflow-hidden group cursor-pointer"
          style={{ gridArea: item.area }}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
          <div className="absolute left-5 bottom-5 text-white z-10">
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="text-sm opacity-90 mt-1">{item.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>



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