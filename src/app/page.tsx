"use client"
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/common/Header';
import SplitSection from '@/components/Home/SplitSection';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/button';
import ButtonLink from '@/components/ui/buttonLink';
import ProductCard from '@/components/common/ProductCard';
import { useFavorites } from '@/hooks/product/useFavorites';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/input';
import { useHomePage } from '@/hooks/useHomepage';
import { ProductCardData } from '@/types/product';
import { CategoryWithProducts } from '@/types/homepage';

// Import des skeletons
import {
  HeroSkeletonLoader,
  NewInSectionSkeleton,
  FeaturedProductsSkeleton,
  CategoriesSectionSkeleton,
  ProductCardSkeleton
} from '@/components/ui/SkeletonLoaders';

type FormErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  acceptTerms?: string;
};

const HomePage = () => {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
 
  // Utiliser le nouveau hook pour charger les données
  const {
    sliders,
    newInProducts,
    featuredProducts,
    categories,
    isLoading,
    isAnyLoading,
    errors,
    refresh,
    refreshSection
  } = useHomePage({
    autoFetch: true,
    filters: {
      newInLimit: 12,
      featuredLimit: 24,
      categoriesLimit: 9 // Limite le nombre de catégories principales affichées
    }
  });

  console.log('Categories loaded:', categories);  
  
  const handleProductClick = (product: ProductCardData) => {
    if (product.slug) {
      router.push(`/products/${product.slug}`);
    } else {
      router.push(`/products/${product.id}`);
    }
  };

  const handleCategoryClick = (category: CategoryWithProducts) => {
    router.push(`/collections/${category.slug}`);
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
  const [activeSlide, setActiveSlide] = useState(0);
  const [newInSlideIndex, setNewInSlideIndex] = useState(0);
  const [isNewInBeginning, setIsNewInBeginning] = useState(true);
  const [isNewInEnd, setIsNewInEnd] = useState(false);

  const handleInputChange = (field: keyof FormErrors, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  // Fonction pour créer une grille adaptative basée sur le nombre de catégories
  const createCategoryGrid = (categories: CategoryWithProducts[]) => {
    const categoryCount = categories.length;
    
    if (categoryCount === 0) return null;

    // Définir la configuration de la grille selon le nombre de catégories
    let gridConfig = {
      className: "grid gap-4",
      style: {},
      areas: [] as string[]
    };

    switch(categoryCount) {
      case 1:
        gridConfig = {
          className: "grid gap-4",
          style: {
            gridTemplateColumns: '1fr',
            gridTemplateRows: '300px'
          },
          areas: ['a']
        };
        break;
      case 2:
        gridConfig = {
          className: "grid gap-4",
          style: {
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridTemplateRows: '300px'
          },
          areas: ['a', 'b']
        };
        break;
      case 3:
        gridConfig = {
          className: "grid gap-4",
          style: {
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: '300px'
          },
          areas: ['a', 'b', 'c']
        };
        break;
      case 4:
        gridConfig = {
          className: "grid gap-4",
          style: {
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(2, 200px)'
          },
          areas: ['a', 'b', 'c', 'd']
        };
        break;
      case 6:
        gridConfig = {
          className: "grid gap-4",
          style: {
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: 'repeat(2, 200px)',
            gridTemplateAreas: `
              "a a b b c c"
              "d d e e f f"
            `
          },
          areas: ['a', 'b', 'c', 'd', 'e', 'f']
        };
        break;
      default: // Pour 9+ catégories, utiliser la grille complexe
        gridConfig = {
          className: "grid gap-4",
          style: {
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: 'repeat(4, 150px)',
            gridTemplateAreas: `
              "a a b b c c"
              "a a d d e e"
              "f f g g e e"
              "f f h h i i"
            `
          },
          areas: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
        };
    }

    return (
      <div className={gridConfig.className} style={gridConfig.style}>
        {categories.slice(0, gridConfig.areas.length).map((category, index) => {
          const area = gridConfig.areas[index];
          const hasSubcategories = category.children && category.children.length > 0;
          
          return (
            <div
              key={category.id}
              className="relative overflow-hidden group cursor-pointer"
              style={{ gridArea: area }}
              onClick={() => handleCategoryClick(category)}
            >
              {/* Image de la catégorie */}
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className="text-4xl text-white font-bold">
                    {category.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
             
              {/* Dégradé sombre vers le bas */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>
              
              {/* Contenu texte */}
              <div className="absolute left-5 bottom-5 text-white z-20">
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm opacity-90 mt-1 line-clamp-2">
                    {category.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs opacity-80">
                  <span>{category.productCount} produits</span>
                  {hasSubcategories && (
                    <>
                      <span>•</span>
                      <span>{category.children.length} sous-catégories</span>
                    </>
                  )}
                </div>
              </div>

              {/* Badge pour les catégories avec enfants */}
              {hasSubcategories && (
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white z-20">
                  +{category.children.length}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Affichage d'erreur si quelque chose ne va pas
  if (errors.hasError && !isAnyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Oops! Quelque chose s&apos;est mal passé
          </h2>
          <p className="text-gray-600 mb-6">
            {errors.error || 'Une erreur est survenue lors du chargement des données'}
          </p>
          <Button onClick={() => refresh()} variant="black">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section avec slider */}
      <div className="relative h-screen w-full overflow-hidden">
        {isLoading ? (
          // Afficher le skeleton pendant le chargement des sliders
          <HeroSkeletonLoader />
        ) : sliders.length > 0 ? (
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
            {sliders.map((slide, index) => (
              <SwiperSlide key={slide.id}>
                <div className="relative h-full w-full">
                  <Image
                    src={slide.image}
                    alt={slide.title? slide.title : ''}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    onError={(e) => {
                      console.error('Erreur de chargement de l\'image:', slide.image);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                 
                  <div className="absolute bottom-8 left-8 z-20 text-white max-w-sm">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-wide">
                      {slide.title}
                    </h2>
                    {slide.subtitle && (
                      <p className="text-lg mb-6 opacity-90 font-light">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.buttonText && slide.buttonLink && (
                      <ButtonLink size="md" href={slide.buttonLink}>
                        {slide.buttonText}
                      </ButtonLink>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          // Fallback si pas de sliders
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Bienvenue sur DRESSCODE</h2>
            </div>
          </div>
        )}
       
        {!isLoading && (
          <div className="swiper-pagination !bottom-8 !right-8 !left-auto !w-auto flex space-x-2"></div>
        )}
        <Header/>
      </div>

      {/* Section Nouveautés */}
      {isLoading ? (
        <NewInSectionSkeleton />
      ) : (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3 flex flex-col justify-center">
                <div className="text-sm text-gray-600 mb-2 tracking-wider uppercase">
                  {newInProducts.length} NOUVEAUTÉS
                </div>
                <h2 className="text-4xl lg:text-5xl font-serif text-black mb-6">
                  Nouveautés
                </h2>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  Nouveautés disponibles dès maintenant cinq jours par semaine - découvrez les dernières sorties sur le site du lundi au vendredi
                </p>
             
              </div>
             
              <div className="lg:w-2/3">
                <div className="relative">
                  {newInProducts.length > 0 ? (
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
                        640: { slidesPerView: 2.2 },
                        768: { slidesPerView: 2.5 },
                        1024: { slidesPerView: 3.2 },
                      }}
                      className="overflow-visible"
                    >
                      {newInProducts.map((product) => (
                        <SwiperSlide key={product.id}>
                          <ProductCard
                            product={product}
                            isFavorite={isFavorite(product.id)}
                            onToggleFavorite={toggleFavorite}
                            onClick={handleProductClick}
                            showBrand={true}
                            showPrice={true}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600">Aucun nouveau produit disponible</p>
                    </div>
                  )}
                 
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
      )}

      {/* Full Screen Split Section */}
      {/* <SplitSection {...trendingTopsSection} /> */}

      {/* Section Produits mis en avant */}
      {isLoading ? (
        <FeaturedProductsSkeleton />
      ) : (
        <section className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-xs sm:text-sm font-medium text-black tracking-[0.15em] sm:tracking-[0.2em] uppercase px-4">
                Les marques qui retiennent notre attention
              </h2>
            </div>
           
            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-1">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={isFavorite(product.id)}
                    onToggleFavorite={toggleFavorite}
                    onClick={handleProductClick}
                    showBrand={true}
                    showPrice={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Aucun produit mis en avant disponible</p>
                <Button
                  className="mt-4"
                  onClick={() => refreshSection('featured')}
                  disabled={isAnyLoading}
                >
                  Actualiser
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      <SplitSection 
        categories={categories}
        title="Collections Phares"
        subtitle="Découvrez nos catégories les plus populaires"
      />

      {/* Section Catégories - AVEC VRAIES DONNÉES */}
      {isLoading ? (
        <CategoriesSectionSkeleton />
      ) : (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Titre */}
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-serif text-black mb-4">
                Parcourir par catégorie
              </h2>
              <p className="text-gray-600 text-lg">
                Découvrez nos collections avec {categories.length} catégories disponibles
              </p>
            </div>

            {/* Affichage des catégories */}
            {categories.length > 0 ? (
              <>
                {/* Grille adaptative des catégories */}
                {createCategoryGrid(categories)}
                
                {/* Lien vers toutes les catégories */}
               
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Aucune catégorie disponible</p>
                <Button
                  onClick={() => refreshSection('categories')}
                  disabled={isAnyLoading}
                  variant="black"
                >
                  Actualiser les catégories
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Section Support - Toujours affichée car statique */}
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

      {/* Section Newsletter - Toujours affichée car statique */}
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
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default HomePage;