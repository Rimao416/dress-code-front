"use client"
import React, { useState } from 'react';
import { ChevronDown, Heart } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { newInData, occasionReadySection, productsData, sliderData, trendingTopsSection } from '@/constant/data';
import Input from '@/components/ui/input';
import Image from 'next/image';
import Header from '@/components/common/Header';
import SplitSection from '@/components/Home/SplitSection';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/button';
import ButtonLink from '@/components/ui/buttonLink';

type FormErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  acceptTerms?: string;
};

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
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
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
      title: "BESOIN D&apos;AIDE ?",
      description: "Contactez les conseillers de notre Service client"
    }
  ];

  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [newInSlideIndex, setNewInSlideIndex] = useState(0);
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
               
                {/* Contenu du slide */}
                <div className="absolute bottom-8 left-8 z-20 text-white max-w-sm">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-wide">
                    {slide.title}
                  </h2>
                  <p className="text-lg mb-6 opacity-90 font-light">
                    {slide.subtitle}
                  </p>
                  <ButtonLink size="md" href={slide.buttonLink}>
                    {slide.buttonText}
                  </ButtonLink>  
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Navigation personnalisée */}
        <div className="swiper-pagination !bottom-8 !right-8 !left-auto !w-auto flex space-x-2"></div>
        <Header/>
      </div>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contenu gauche */}
            <div className="lg:w-1/3 flex flex-col justify-center">
              <div className="text-sm text-gray-600 mb-2 tracking-wider uppercase">
                977 NOUVEAUTÉS
              </div>
              <h2 className="text-4xl lg:text-5xl font-serif text-black mb-6">
                Nouveautés
              </h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Nouveautés disponibles dès maintenant cinq jours par semaine - découvrez les dernières sorties sur le site du lundi au vendredi
              </p>
              <Button size="md" variant='black' className="w-fit">
                Acheter maintenant
              </Button>
            </div>
            {/* Contenu droit - Carrousel de produits */}
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
                              // Solution de repli en cas d'erreur de chargement
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
                {/* Flèches de navigation */}
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
      <SplitSection {...trendingTopsSection} />

      <section className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-xs sm:text-sm font-medium text-black tracking-[0.15em] sm:tracking-[0.2em] uppercase px-4">
              Les marques qui retiennent notre attention
            </h2>
          </div>
         
          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-1">
            {productsData.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-square overflow-hidden bg-gray-100 relative rounded-sm">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
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
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 group/heart"
                  >
                    <Heart
                      className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-200 ${
                        favorites.includes(product.id)
                          ? 'fill-black text-black'
                          : 'text-gray-600 hover:text-black'
                      }`}
                    />
                  </button>
                </div>
                               
                {/* Product Info */}
                <div className="pt-2 sm:pt-3 space-y-1">
                  <h3 className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wide">
                    {product.brand}
                  </h3>
                  <p className="text-xs sm:text-sm text-black font-medium line-clamp-2 leading-tight">
                    {product.name}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-black">
                    ${product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SplitSection {...occasionReadySection} />

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
              { area: 'a', title: 'GAINANTS', subtitle: 'Sculptez & Définissez', image: 'https://res.cloudinary.com/le-chretien/image/upload/v1753970628/uploads/people-wearing-high-fashion-clothing.jpg' },
              { area: 'b', title: 'SOUS-VÊTEMENTS', image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=500&auto=format&fit=crop' },
              { area: 'c', title: 'SOMMEIL', image: 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?q=80&w=500&auto=format&fit=crop' },
              { area: 'd', title: 'HOMME', image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=500&auto=format&fit=crop' },
              { area: 'e', title: 'SOUTIENS-GORGE', image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=500&auto=format&fit=crop' },
              { area: 'f', title: 'MAILLOTS DE BAIN', subtitle: 'Prêt pour la Plage', image: 'https://res.cloudinary.com/le-chretien/image/upload/v1753970622/uploads/beautiful-young-woman-with-shopping-bags.jpg' },
              { area: 'g', title: 'VÊTEMENTS DE SPORT', image: 'https://res.cloudinary.com/le-chretien/image/upload/v1753973372/uploads/young-brutal-sportive-woman-sportswear-sitting-with-bit-white_kwiqrs.jpg' },
              { area: 'h', title: 'ACCESSOIRES', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500&auto=format&fit=crop' },
              { area: 'i', title: 'LUXE', subtitle: 'Édition Limitée', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=500&auto=format&fit=crop' },
            ].map((item, i) => (
              <div
                key={i}
                className="relative overflow-hidden group cursor-pointer"
                style={{ gridArea: item.area }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
               
                {/* Dégradé sombre vers le bas */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10"></div>
                {/* Texte au-dessus du dégradé */}
                <div className="absolute left-5 bottom-5 text-white z-20">
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
                Bienvenue parmi nous ! Nous sommes ravis de vous avoir à bord. Profitez
                dès maintenant de notre service de livraison gratuite sur toutes vos
                commandes, d&apos;un cadeau spécial pour votre anniversaire, ainsi que d&apos;un
                accès privilégié aux nouveaux produits et à leurs exclusivités. Comme
                vos jeans, vous verrez que les avantages deviennent encore meilleurs avec
                le temps !
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
                <Button
                  type="submit"
                  variant="black"
                  size="lg"
                  className="w-full"
                >
                  Créer un compte
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer/>

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