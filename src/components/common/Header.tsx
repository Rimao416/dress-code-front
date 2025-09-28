// components/Header/Header.tsx - Version avec navigation entièrement dynamique
"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, Heart, ShoppingBag, User, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useFavorites } from '@/hooks/product/useFavorites';
import { useCartStore } from '@/store/useCartStore';
import { useCartSidebarStore } from '@/store/useCartSidebarStore';
import SignUpModal from '../modal/SignUpModal';
import LoginModal from '../modal/LoginModal';
import CartSidebar from '../cart/CartSidebar';
import { useAuth } from '@/context/AuthContext';
import { useHomePage } from '@/hooks/useHomepage';
import { CategoryWithProducts } from '@/types/homepage';

interface HeaderProps {
  forceScrolledStyle?: boolean;
}

interface NavSection {
  title: string;
  items: Array<{
    title: string;
    link: string;
  }>;
}

interface DropdownContent {
  left: Array<{
    title: string;
    link: string;
  }>;
  right: NavSection[];
  featured?: {
    image: string;
    title: string;
    description: string;
  };
}

interface NavigationItem {
  hasDropdown: boolean;
  link: string;
  content?: DropdownContent;
}

type NavigationData = Record<string, NavigationItem>;

const Header: React.FC<HeaderProps> = ({ forceScrolledStyle = false }) => {
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
 
  // États pour les modals
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
 
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const { user, isAuthenticated, loading, logout, checkAuthStatus } = useAuth();
  const { isOpen: isCartSidebarOpen, toggleSidebar: toggleCartSidebar, closeSidebar: closeCartSidebar } = useCartSidebarStore();
  const { favoritesCount } = useFavorites();
const cartItemsCount = useCartStore((state) => 
  state.items ? state.items.reduce((total, item) => total + item.quantity, 0) : 0
);
  // Charger les catégories depuis l'API
  const { categories, isLoading } = useHomePage({
    autoFetch: true,
    filters: {
      categoriesLimit: 20 // Charger plus de catégories pour la navigation
    }
  });

  // Messages promotionnels rotatifs
  const promoMessages = [
    "Livraison gratuite pour les membres du programme DressCode Premium",
    "Nouvelle collection automne-hiver maintenant disponible",
    "Retours gratuits sous 30 jours sur tous les articles"
  ];

  // Fix hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !loading && !user) {
      console.log('🔄 Header: Re-checking auth status');
      checkAuthStatus();
    }
  }, [isClient]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotation automatique des messages promo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prevIndex) =>
        prevIndex === promoMessages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const shouldApplyScrolledStyle = forceScrolledStyle || isNavbarHovered || isScrolled;

  const nextPromo = () => {
    setCurrentPromoIndex((prevIndex) =>
      prevIndex === promoMessages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPromo = () => {
    setCurrentPromoIndex((prevIndex) =>
      prevIndex === 0 ? promoMessages.length - 1 : prevIndex - 1
    );
  };

  // Fonction pour créer le contenu dropdown d'une catégorie
  const createDropdownContent = (category: CategoryWithProducts): DropdownContent => {
    const sections: NavSection[] = [];
    
    // Si la catégorie a des enfants, les organiser en sections
    if (category.children && category.children.length > 0) {
      // Limiter à 4 sections pour un bon affichage
      const childrenToShow = category.children.slice(0, 4);
      
      childrenToShow.forEach((child) => {
        const items = [];
        
        // Ajouter le lien vers la sous-catégorie elle-même
        items.push({
          title: `Tous les ${child.name}`,
          link: `/collections/${child.slug}`
        });
        
        // Ajouter les petits-enfants s'il y en a
        if (child.children && child.children.length > 0) {
          child.children.slice(0, 5).forEach((grandChild) => {
            items.push({
              title: grandChild.name,
              link: `/collections/${grandChild.slug}`
            });
          });
        }
        
        sections.push({
          title: child.name,
          items: items
        });
      });
    }

    return {
      left: [
        {
          title: `Tous les ${category.name}`,
          link: `/collections/${category.slug}`
        },
        // Ajouter quelques liens rapides si nécessaire
        ...(category.productCount > 0 ? [{
          title: `Nouveautés ${category.name}`,
          link: `/collections/${category.slug}?filter=new`
        }] : [])
      ],
      right: sections,
      featured: category.image ? {
        image: category.image,
        title: `Collection ${category.name}`,
        description: category.description || `Découvrez notre sélection ${category.name.toLowerCase()} avec ${category.productCount} produits disponibles`
      } : undefined
    };
  };

  // Créer la navigation dynamique basée uniquement sur les catégories de l'API
  const createDynamicNavigation = (): NavigationData => {
    if (!categories || categories.length === 0) {
      return {};
    }

    const navigationData: NavigationData = {};

    // Prendre les catégories principales (sans parentId) 
    const mainCategories = categories.filter(cat => !cat.parentId);
    
    // Trier par sortOrder puis par nom
    const sortedCategories = mainCategories.sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return a.name.localeCompare(b.name);
    });

    // Limiter à 6 catégories principales max pour la navigation
    const categoriesToShow = sortedCategories.slice(0, 6);
    
    categoriesToShow.forEach(category => {
      const hasChildren = category.children && category.children.length > 0;
      
      navigationData[category.name] = {
        hasDropdown: hasChildren,
        link: `/collections/${category.slug}`,
        content: hasChildren ? createDropdownContent(category) : undefined
      };
    });

    // Si il y a plus de 6 catégories, créer un menu "Plus"
    const remainingCategories = sortedCategories.slice(6);
    if (remainingCategories.length > 0) {
      const moreSections: NavSection[] = [];
      
      // Organiser les catégories restantes en sections de 4
      for (let i = 0; i < remainingCategories.length; i += 4) {
        const sectionCategories = remainingCategories.slice(i, i + 4);
        
        moreSections.push({
          title: `Collections ${Math.floor(i/4) + 1}`,
          items: sectionCategories.map(cat => ({
            title: cat.name,
            link: `/collections/${cat.slug}`
          }))
        });
      }

      navigationData['Plus'] = {
        hasDropdown: true,
        link: '/collections',
        content: {
          left: [
            { title: "Toutes les collections", link: "/collections" },
            { title: "Nouveautés", link: "/collections?filter=new" },
            { title: "Meilleures ventes", link: "/collections?filter=bestsellers" }
          ],
          right: moreSections.slice(0, 3), // Limiter à 3 sections
          featured: remainingCategories[0]?.image ? {
            image: remainingCategories[0].image,
            title: "Découvrez plus",
            description: `Explorez ${remainingCategories.length} autres collections`
          } : undefined
        }
      };
    }

    return navigationData;
  };

  const navigationData = createDynamicNavigation();

  // Gestion des modals
  const handleUserClick = () => {
    if (user && isAuthenticated) {
      console.log('User is authenticated:', user);
    } else {
      setIsSignUpModalOpen(true);
    }
  };

  const handleOpenLogin = () => {
    setIsSignUpModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleOpenSignUp = () => {
    setIsLoginModalOpen(false);
    setIsSignUpModalOpen(true);
  };

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
            {/* Colonne gauche - Liens principaux */}
            {content.left && content.left.length > 0 && (
              <div className="col-span-2">
                <div className="space-y-2">
                  {content.left.map((item, index) => (
                    <Link
                      key={index}
                      href={item.link}
                      className="block text-sm font-medium text-gray-900 hover:text-gray-600 py-1"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Colonne centrale - Sections de catégories */}
            <div className={`${content.left && content.left.length > 0 ? 'col-span-6' : 'col-span-8'}`}>
              <div className="grid grid-cols-2 gap-8">
                {content.right?.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items?.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          href={item.link}
                          className="block text-sm text-gray-700 hover:text-gray-900 py-1"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne droite - Image mise en avant */}
            <div className="col-span-4">
              {content.featured && (
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
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMobileMenu = () => {
    const mobileMenuItems = Object.entries(navigationData).map(([key, nav]) => ({
      key,
      label: key,
      hasDropdown: nav.hasDropdown,
      link: nav.link
    }));

    return (
      <div className="md:hidden">
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMobileMenu}></div>
        )}
        <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-4">
            <div className="flex justify-end mb-6">
              <button onClick={toggleMobileMenu} className="p-2">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-0">
              {mobileMenuItems.map((item) => (
                <div key={item.key} className="border-b border-gray-200">
                  {item.hasDropdown ? (
                    <div>
                      <div className="flex items-center">
                        <Link
                          href={item.link}
                          className="flex-1 py-4 text-left text-gray-900 font-medium"
                        >
                          {item.label}
                        </Link>
                        <button
                          onClick={() => toggleMobileSection(item.key)}
                          className="p-4"
                        >
                          <ChevronDown className={`h-4 w-4 transform transition-transform ${
                            expandedMobileSection === item.key ? 'rotate-180' : ''
                          }`} />
                        </button>
                      </div>
                      {expandedMobileSection === item.key && navigationData[item.key]?.content && (
                        <div className="pb-4">
                          {navigationData[item.key].content?.left?.map((linkItem, index) => (
                            <Link
                              key={index}
                              href={linkItem.link}
                              className="block py-2 pl-4 text-sm text-gray-700 hover:text-gray-900"
                            >
                              {linkItem.title}
                            </Link>
                          ))}
                          {navigationData[item.key].content?.right?.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="mt-4">
                              <h4 className="text-sm font-semibold text-gray-900 pl-4 mb-2 uppercase tracking-wide">
                                {section.title}
                              </h4>
                              {section.items?.map((linkItem, linkIndex) => (
                                <Link
                                  key={linkIndex}
                                  href={linkItem.link}
                                  className="block py-2 pl-6 text-sm text-gray-700 hover:text-gray-900"
                                >
                                  {linkItem.title}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.link}
                      className="block py-4 text-gray-900 font-medium"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        {/* Sub-Header Skeleton */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-10">
              <div className="flex items-center space-x-2 flex-1">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 text-center">
                  <div className="w-80 h-3 bg-gray-200 rounded mx-auto animate-pulse"></div>
                </div>
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Header principal Skeleton */}
        <header className="fixed top-10 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
              <nav className="hidden md:flex items-center space-x-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </nav>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="md:hidden w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      {/* Sub-Header avec promotion et informations utilisateur */}
      <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        shouldApplyScrolledStyle ? 'bg-gray-50 border-b border-gray-200' : 'bg-white/10 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-10 text-sm">
            {/* Message promotionnel avec navigation */}
            <div className="flex items-center space-x-2 flex-1">
              <button
                onClick={prevPromo}
                className={`p-1 rounded transition-colors ${
                  shouldApplyScrolledStyle
                    ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                    : 'text-white/80 hover:text-white hover:bg-white/20'
                }`}
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <div className="flex-1 text-center">
                <span className={`transition-colors duration-300 ${
                  shouldApplyScrolledStyle ? 'text-gray-800' : 'text-white'
                }`}>
                  {promoMessages[currentPromoIndex]}
                </span>
              </div>
              <button
                onClick={nextPromo}
                className={`p-1 rounded transition-colors ${
                  shouldApplyScrolledStyle
                    ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                    : 'text-white/80 hover:text-white hover:bg-white/20'
                }`}
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Informations utilisateur */}
            <div className="flex items-center space-x-6">
              <button
                onClick={handleUserClick}
                className={`flex items-center space-x-1 hover:underline transition-colors duration-300 ${
                  shouldApplyScrolledStyle ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'
                }`}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {user ? `Bonjour ${user.client?.firstName}` : 'Rejoignez-nous'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <header
        className={`fixed top-10 left-0 right-0 z-30 transition-all duration-300 ${
          shouldApplyScrolledStyle ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
        }`}
        onMouseEnter={() => setIsNavbarHovered(true)}
        onMouseLeave={() => setIsNavbarHovered(false)}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
                  shouldApplyScrolledStyle ? 'text-black' : 'text-white'
                }`}
              >
                DressCode
              </Link>
            </div>

            {/* Navigation dynamique basée sur les catégories */}
            <nav className="hidden md:flex items-center space-x-4">
              {Object.entries(navigationData).map(([key, nav]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => nav.hasDropdown && handleMouseEnter(key)}
                  onMouseLeave={() => nav.hasDropdown && handleMouseLeave()}
                >
                  <Link
                    href={nav.link}
                    className={`flex items-center text-sm font-medium px-2 py-2 rounded transition-colors duration-300 ${
                      shouldApplyScrolledStyle ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-300'
                    }`}
                  >
                    {key}
                    {nav.hasDropdown && <ChevronDown className="ml-1 h-3 w-3" />}
                  </Link>
                </div>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              <button
                className={`p-2 transition-colors duration-300 ${
                  shouldApplyScrolledStyle ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-300'
                }`}
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                className={`p-2 relative transition-colors duration-300 ${
                  shouldApplyScrolledStyle ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-300'
                }`}
              >
                <Heart className="h-5 w-5" />
                {isClient && favoritesCount > 0 && (
                  <span className={`absolute -top-1 -right-1 text-xs font-semibold rounded-full min-w-4 h-4 px-1 flex items-center justify-center transition-all duration-300 transform ${
                    shouldApplyScrolledStyle ? 'bg-black text-white' : 'bg-white text-black'
                  } ${favoritesCount > 99 ? 'scale-110' : ''}`}>
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </span>
                )}
              </button>

              <button
                onClick={toggleCartSidebar}
                className={`p-2 relative transition-colors duration-300 ${
                  shouldApplyScrolledStyle ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-300'
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
                {isClient && cartItemsCount > 0 && (
                  <span className={`absolute -top-1 -right-1 text-xs font-semibold rounded-full min-w-4 h-4 px-1 flex items-center justify-center transition-all duration-300 transform ${
                    shouldApplyScrolledStyle ? 'bg-black text-white' : 'bg-white text-black'
                  } ${cartItemsCount > 99 ? 'scale-110' : ''}`}>
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </button>

              <button
                className={`md:hidden p-2 transition-colors duration-300 ${
                  shouldApplyScrolledStyle ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-300'
                }`}
                onClick={toggleMobileMenu}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown content */}
        {activeDropdown && navigationData[activeDropdown]?.hasDropdown && navigationData[activeDropdown].content && (
          <div
            onMouseEnter={() => handleMouseEnter(activeDropdown)}
            onMouseLeave={handleMouseLeave}
          >
            {renderDropdownContent(navigationData[activeDropdown].content!)}
          </div>
        )}
      </header>

      {/* Modals */}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToLogin={handleOpenLogin}
      />
     
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignUp={handleOpenSignUp}
      />

      {/* Sidebar Panier */}
      <CartSidebar
        isOpen={isCartSidebarOpen}
        onClose={closeCartSidebar}
      />

      {/* Menu Mobile */}
      {renderMobileMenu()}
    </>
  );
};

export default Header;