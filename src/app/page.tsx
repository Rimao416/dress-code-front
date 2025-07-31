"use client"
import React, { useEffect, useState } from 'react';
import { ChevronDown, Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { DropdownContent, FeaturedItem, navigationData, NavigationItem, NavLink, NavSection } from '@/components/Header/NavigationData';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { newInData, productsData, sliderData } from '@/constant/data';
import Input from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/common/Header';


type FormErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  acceptTerms?: string;
};
// Données du slider
const HomePage = () => {
  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    acceptNewsletters: false,
    acceptTerms: false
  });

const [formErrors, setFormErrors] = useState<FormErrors>({});

const handleInputChange = (field: keyof FormErrors, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  // Effacer l'erreur quand l'utilisateur commence à taper
  if (formErrors[field]) {
    setFormErrors(prev => ({ ...prev, [field]: '' }));
  }
};

  const supportItems = [
    {
      icon: <User className="w-8 h-8" />,
      title: "PASSER COMMANDE",
      description: "Votre guide shopping sur DRESSCODE"
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <path d="M12 17h.01"/>
        </svg>
      ),
      title: "FAQ",
      description: "Toutes nos réponses à vos questions"
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      title: "BESOIN D'AIDE ?",
      description: "Contactez les conseillers de notre Service client"
    }
  ];

  const [favorites, setFavorites] = useState<number[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [newInSlideIndex, setNewInSlideIndex] = useState(0);
  const [newInSlidesCount, setNewInSlidesCount] = useState(0);
  const [isNewInBeginning, setIsNewInBeginning] = useState(true);
  const [isNewInEnd, setIsNewInEnd] = useState(false);

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
      {/* Utiliser Image de Next.js */}
      <Image
        src={slide.image}
        alt={slide.title}
        fill
        className="object-cover"
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
        <Link
          href={slide.buttonLink}
          className="inline-block text-white border-b-2 border-white pb-1 hover:border-gray-300 hover:text-gray-300 transition-colors duration-200 font-medium"
        >
          {slide.buttonText}
        </Link>
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
    
{/* C'est ici que je met le Header */}
<Header/>

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
                        <div className="aspect-square overflow-hidden bg-gray-100 mb-4 relative">
                          <Image
                            src={item.image}
                            alt={item.alt}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
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
    {/* Moitié de gauche - Tops Tendances */}
    <div className="w-1/2 relative overflow-hidden group cursor-pointer">
      <Image
        src="/images/trending-tops.jpg"
        alt="Femme en haut tricoté violet"
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        onError={(e) => {
          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjOTMzM0VBIi8+CjxwYXRoIGQ9Ik00MDAgMzAwTDUwMCA0MDBINDE1MFY1MDBIMjUwVjQwMEgxNTBMNDAwIDMwMFoiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iNjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0OCIgZm9udC1mYW1pbHk9IkFyaWFsIj5UUkVORElORyBUT1BTPC90ZXh0Pgo8L3N2Zz4K';
        }}
      />
      {/* Superposition Sombre */}
      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
      {/* Contenu */}
      <div className="absolute bottom-8 left-8 text-white z-10">
        <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide uppercase">
          Tops Tendances
        </h3>
        <p className="text-lg mb-6 opacity-90 max-w-md leading-relaxed">
          Nouveaux hauts en tricot transparent et t-shirts signature pour un ajustement parfait à chaque fois
        </p>
        <Link
          href="/trending-tops"
          className="inline-block text-white border-b-2 border-white pb-1 hover:border-gray-300 hover:text-gray-300 transition-colors duration-200 font-medium"
        >
          Acheter Maintenant
        </Link>
      </div>
    </div>
    {/* Moitié de droite - Bas Indispensables */}
    <div className="w-1/2 relative overflow-hidden group cursor-pointer">
      <Image
        src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Femme en jupe imprimée serpent"
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        onError={(e) => {
          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjNkI3Mjk0Ii8+CjxwYXRoIGQ9Ik00MDAgMzAwTDUwMCA0MDBINDE1MFY1MDBIMjUwVjQwMEgxNTBMNDAwIDMwMFoiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iNTcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIj5NVVNULUFBVEU8L3RleHQ+Cjx0ZXh0IHg9IjQwMCIgeT0iNjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIj5CT1RUT01TPC90ZXh0Pgo8L3N2Zz4K';
        }}
      />
      {/* Superposition Sombre */}
      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
      {/* Contenu */}
      <div className="absolute bottom-8 left-8 text-white z-10">
        <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide uppercase">
          Bas <span className="text-gray-300">Indispensables</span>
        </h3>
        <p className="text-lg mb-6 opacity-90 max-w-md leading-relaxed">
          Complétez votre look avec des jupes, des pantalons ultra-flatteurs et plus encore
        </p>
        <Link
          href="/must-have-bottoms"
          className="inline-block text-white border-b-2 border-white pb-1 hover:border-gray-300 hover:text-gray-300 transition-colors duration-200 font-medium"
        >
          Acheter Maintenant
        </Link>
      </div>
    </div>
  </div>
</section>
          <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-sm font-medium text-black tracking-[0.2em] uppercase">
              Les marques qui retiennent notre attention
            </h2>
          </div>
          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
            {productsData.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-square overflow-hidden bg-gray-100 relative">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
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
    {/* Moitié de gauche - Tops Tendances */}
    <div className="w-1/2 relative overflow-hidden group cursor-pointer">
      <Image
        src="/images/trending-tops.jpg"
        alt="Femme en haut tricoté violet"
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        onError={(e) => {
          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjOTMzM0VBIi8+CjxwYXRoIGQ9Ik00MDAgMzAwTDUwMCA0MDBINDE1MFY1MDBIMjUwVjQwMEgxNTBMNDAwIDMwMFoiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iNjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0OCIgZm9udC1mYW1pbHk9IkFyaWFsIj5UUkVORElORyBUT1BTPC90ZXh0Pgo8L3N2Zz4K';
        }}
      />
      {/* Superposition Sombre */}
      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
      {/* Contenu */}
      <div className="absolute bottom-8 left-8 text-white z-10">
        <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide uppercase">
          Boutique de Robes
        </h3>
        <p className="text-lg mb-6 opacity-90 max-w-md leading-relaxed">
          Des robes éblouissantes pour chaque occasion
        </p>
        <Link
          href="/trending-tops"
          className="inline-block text-white border-b-2 border-white pb-1 hover:border-gray-300 hover:text-gray-300 transition-colors duration-200 font-medium"
        >
          Acheter Maintenant
        </Link>
      </div>
    </div>
    {/* Moitié de droite - Bas Indispensables */}
    <div className="w-1/2 relative overflow-hidden group cursor-pointer">
      <Image
        src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Femme en jupe imprimée serpent"
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        onError={(e) => {
          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjNkI3Mjk0Ii8+CjxwYXRoIGQ9Ik00MDAgMzAwTDUwMCA0MDBINDE1MFY1MDBIMjUwVjQwMEgxNTBMNDAwIDMwMFoiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iNTcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIj5NVVNULUFBVEU8L3RleHQ+Cjx0ZXh0IHg9IjQwMCIgeT0iNjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIj5CT1RUT01TPC90ZXh0Pgo8L3N2Zz4K';
        }}
      />
      {/* Superposition Sombre */}
      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
      {/* Contenu */}
      <div className="absolute bottom-8 left-8 text-white z-10">
        <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide uppercase">
          Solutions Prêtes pour les <span className="text-gray-300">Occasions</span>
        </h3>
        <p className="text-lg mb-6 opacity-90 max-w-md leading-relaxed">
          Peu importe le look, nos soutiens-gorge innovants et nos vêtements de forme vous couvrent
        </p>
        <Link
          href="/must-have-bottoms"
          className="inline-block text-white border-b-2 border-white pb-1 hover:border-gray-300 hover:text-gray-300 transition-colors duration-200 font-medium"
        >
          Acheter Maintenant
        </Link>
      </div>
    </div>
  </div>
</section>

<section className="py-16 px-4 bg-white">
  <div className="max-w-7xl mx-auto">
    {/* Titre */}
    <div className="text-center mb-12">
      <h2 className="text-4xl lg:text-5xl font-serif text-black mb-4">Parcourir par catégorie</h2>
      <p className="text-gray-600 text-lg">Découvrez des essentiels premium avec style</p>
    </div>
    {/* Grille Créative */}
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
        { area: 'a', title: 'GAINANTS', subtitle: 'Sculptez & Définissez', image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=500&auto=format&fit=crop' },
        { area: 'b', title: 'SOUS-VÊTEMENTS', image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=500&auto=format&fit=crop' },
        { area: 'c', title: 'SOMMEIL', image: 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?q=80&w=500&auto=format&fit=crop' },
        { area: 'd', title: 'HOMME', image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=500&auto=format&fit=crop' },
        { area: 'e', title: 'SOUTIENS-GORGE', image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=500&auto=format&fit=crop' },
        { area: 'f', title: 'MAILLOTS DE BAIN', subtitle: 'Prêt pour la Plage', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?q=80&w=500&auto=format&fit=crop' },
        { area: 'g', title: 'VÊTEMENTS DE SPORT', image: 'https://images.unsplash.com/photo-1506629905607-d9dda7bed44b?q=80&w=500&auto=format&fit=crop' },
        { area: 'h', title: 'ACCESSOIRES', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500&auto=format&fit=crop' },
        { area: 'i', title: 'LUXE', subtitle: 'Édition Limitée', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=500&auto=format&fit=crop' },
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

 <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportItems.map((item, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300 cursor-pointer"
              >
                <div className="flex flex-col items-start space-y-4">
                  <div className="text-gray-700">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

<section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Colonne gauche - Informations */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  DressCode
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  MEMBER PROGRAM
                </h3>
              </div>
              
              <p className="text-gray-600 leading-relaxed">
                Rejoignez-nous et profitez dès maintenant de la livraison 
                gratuite sur toutes vos commandes, d'une surprise pour 
                votre anniversaire, de l'accès exclusif aux lancements de 
                produits, de leur exclusivité et plus encore. Comme vos 
                jeans, les avantages sont encore plus sympas au fil du 
                temps.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold">%</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      -10% sur votre commande en vous inscrivant à notre newsletter
                    </h4>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Livraison et retours GRATUITS
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - Formulaire */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Prénom"
                    placeholder="Votre prénom"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    error={formErrors.firstName}
                    required
                  />
                  <Input
                    label="Nom"
                    placeholder="Votre nom"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    error={formErrors.lastName}
                    required
                  />
                </div>

                <Input
                  type="email"
                  label="E-mail"
                  placeholder="votre.email@exemple.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={formErrors.email}
                  required
                />

                <Input
                  type="password"
                  label="Mot de passe"
                  placeholder="Créez un mot de passe"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={formErrors.password}
                  required
                  showPasswordToggle
                />

                <div className="space-y-4">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.acceptNewsletters}
                      onChange={(e) => setFormData(prev => ({ ...prev, acceptNewsletters: e.target.checked }))}
                      className="mt-1 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-600">
                      Send me news and offers from the LS&Co. Group of Companies. I can unsubscribe at any time.
                    </span>
                  </label>

                  <div className="text-xs text-gray-500">
                    <p className="mb-2">
                      Les mots de passe doivent contenir au moins 8 caractères et être difficiles à deviner - les mots de passe couramment utilisés ou risqués ne sont pas autorisés.
                    </p>
                    <p>
                      By creating an account, I agree to the LS&Co.{' '}
                      <a href="#" className="text-red-600 hover:underline">Terms of Use</a>. I have read the LS&Co.{' '}
                      <a href="#" className="text-red-600 hover:underline">Privacy Policy</a>.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-black transition-colors duration-200"
                >
                  Créer un compte
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-white border-t">
        {/* Moyens de paiement */}
        <div className="border-b border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Moyens de paiement</h3>
            <div className="flex space-x-4">
              <img src="https://via.placeholder.com/40x25/0052CC/FFFFFF?text=AMEX" alt="American Express" className="h-6" />
              <img src="https://via.placeholder.com/40x25/EB001B/FFFFFF?text=MC" alt="Mastercard" className="h-6" />
              <img src="https://via.placeholder.com/40x25/1A1F71/FFFFFF?text=VISA" alt="Visa" className="h-6" />
              <img src="https://via.placeholder.com/40x25/003087/FFFFFF?text=PP" alt="PayPal" className="h-6" />
            </div>
          </div>
        </div>

        {/* Liens footer */}
        <div className="bg-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Service client */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Service client</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-gray-900">Aide & contact</a></li>
                  <li><a href="#" className="hover:text-gray-900">FAQ</a></li>
                  <li><a href="#" className="hover:text-gray-900">Commandes & livraison</a></li>
                  <li><a href="#" className="hover:text-gray-900">Retours & remboursements</a></li>
                  <li><a href="#" className="hover:text-gray-900">Paiements & tarification</a></li>
                  <li><a href="#" className="hover:text-gray-900">Paiements en crypto-monnaie</a></li>
                  <li><a href="#" className="hover:text-gray-900">Conditions des promotions</a></li>
                  <li><a href="#" className="hover:text-gray-900">La garantie DRESSCODE</a></li>
                </ul>
              </div>

              {/* À propos de DRESSCODE */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">À propos de DRESSCODE</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-gray-900">À propos de nous</a></li>
                  <li><a href="#" className="hover:text-gray-900">Boutiques partenaires DRESSCODE</a></li>
                  <li><a href="#" className="hover:text-gray-900">Carrières (site en anglais)</a></li>
                  <li><a href="#" className="hover:text-gray-900">Appli DRESSCODE</a></li>
                  <li><a href="#" className="hover:text-gray-900">Déclarations sur l'esclavage moderne</a></li>
                  <li><a href="#" className="hover:text-gray-900">DRESSCODE Advertising</a></li>
                </ul>
              </div>

              {/* Programme de fidélité */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Programme de fidélité</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-gray-900">Programme d'affiliation</a></li>
                  <li><a href="#" className="hover:text-gray-900">Programme de parrainage</a></li>
                  <li><a href="#" className="hover:text-gray-900">Programme de fidélité</a></li>
                  <li><a href="#" className="hover:text-gray-900">Student Beans & Diplômé·es</a></li>
                </ul>
              </div>

              {/* Suivez-nous */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Suivez-nous</h4>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bas */}
        <div className="bg-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
              <div className="flex space-x-6 mb-4 md:mb-0">
                <a href="#" className="hover:text-gray-900">Politique de confidentialité</a>
                <a href="#" className="hover:text-gray-900">Terms & conditions</a>
                <a href="#" className="hover:text-gray-900">Accessibilité</a>
              </div>
           
            </div>
          </div>
        </div>
      </footer>
      {/* Mobile Menu */}
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