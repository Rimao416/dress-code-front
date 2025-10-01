"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Heart, ShoppingBag, User, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useFavorites } from '@/hooks/product/useFavorites';
import { useCartStore } from '@/store/useCartStore';
import { useCartSidebarStore } from '@/store/useCartSidebarStore';
import LoginModal from '../modal/LoginModal';
import CartSidebar from '../cart/CartSidebar';
import { useAuth } from '@/context/AuthContext';
import { CategoryWithProducts } from '@/types/category';
import { useCategories } from '@/hooks/category/useCategory';
import SignUpModal from '../modal/SignUpModal';

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
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  const { user, isAuthenticated, loading, checkAuthStatus } = useAuth();
  const { isOpen: isCartSidebarOpen, toggleSidebar: toggleCartSidebar, closeSidebar: closeCartSidebar } = useCartSidebarStore();
  const { favoritesCount } = useFavorites();
  const { categories, mainCategories, isLoading, error } = useCategories();
  
  const cartItemsCount = useCartStore((state) => 
    state.items ? state.items.reduce((total, item) => total + item.quantity, 0) : 0
  );

  const promoMessages = [
    "Livraison gratuite pour les membres du programme DressCode Premium",
    "Nouvelle collection automne-hiver maintenant disponible",
    "Retours gratuits sous 30 jours sur tous les articles"
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !loading && !user) {
      checkAuthStatus();
    }
  }, [isClient]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const createDropdownContent = (category: CategoryWithProducts): DropdownContent => {
    const sections: NavSection[] = [];
    
    if (category.children && category.children.length > 0) {
      const childrenToShow = category.children.slice(0, 4);
      
      childrenToShow.forEach((child) => {
        const items = [];
        
        items.push({
          title: `Tous les ${child.name}`,
          link: `/collections/${child.slug}`
        });
        
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

  const createDynamicNavigation = (): NavigationData => {
    if (!mainCategories || mainCategories.length === 0) {
      return {};
    }

    const navigationDataLocal: NavigationData = {};
    const sortedCategories = [...mainCategories].sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return a.name.localeCompare(b.name);
    });

    const categoriesToShow = sortedCategories.slice(0, 6);
    
    categoriesToShow.forEach(category => {
      const hasChildren = category.children && category.children.length > 0;
      
      navigationDataLocal[category.name] = {
        hasDropdown: hasChildren,
        link: `/collections/${category.slug}`,
        content: hasChildren ? createDropdownContent(category) : undefined
      };
    });

    const remainingCategories = sortedCategories.slice(6);
    if (remainingCategories.length > 0) {
      const moreSections: NavSection[] = [];
      
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

      navigationDataLocal['Plus'] = {
        hasDropdown: true,
        link: '/collections',
        content: {
          left: [
            { title: "Toutes les collections", link: "/collections" },
            { title: "Nouveautés", link: "/collections?filter=new" },
            { title: "Meilleures ventes", link: "/collections?filter=bestsellers" }
          ],
          right: moreSections.slice(0, 3),
          featured: remainingCategories[0]?.image ? {
            image: remainingCategories[0].image,
            title: "Découvrez plus",
            description: `Explorez ${remainingCategories.length} autres collections`
          } : undefined
        }
      };
    }

    return navigationDataLocal;
  };

  // Utiliser useMemo pour éviter les recalculs inutiles et les boucles infinies
  const navigationData = useMemo(() => {
    if (!isClient || !mainCategories || mainCategories.length === 0) {
      return {};
    }
    return createDynamicNavigation();
  }, [isClient, mainCategories]);

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
      <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-stone-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-8">
            {content.left && content.left.length > 0 && (
              <div className="col-span-2">
                <div className="space-y-2">
                  {content.left.map((item, index) => (
                    <Link
                      key={index}
                      href={item.link}
                      className="block text-sm font-medium text-neutral-900 hover:text-red-900 py-1 transition-colors"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className={`${content.left && content.left.length > 0 ? 'col-span-6' : 'col-span-8'}`}>
              <div className="grid grid-cols-2 gap-8">
                {content.right?.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-3 uppercase tracking-wide">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items?.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          href={item.link}
                          className="block text-sm text-neutral-700 hover:text-red-900 py-1 transition-colors"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-4">
              {content.featured && (
                <div className="bg-stone-50 p-4 rounded-sm border border-stone-200">
                  <img
                    src={content.featured.image}
                    alt={content.featured.title}
                    className="w-full h-32 object-cover rounded-sm mb-3"
                  />
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {content.featured.title}
                  </h3>
                  <p className="text-sm text-neutral-600">
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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={toggleMobileMenu}></div>
        )}
        <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 shadow-2xl ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-serif text-neutral-900">Menu</span>
              <button onClick={toggleMobileMenu} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                <X className="h-5 w-5 text-neutral-700" />
              </button>
            </div>
            <div className="space-y-0">
              {mobileMenuItems.map((item) => (
                <div key={item.key} className="border-b border-stone-100">
                  {item.hasDropdown ? (
                    <div>
                      <div className="flex items-center">
                        <Link
                          href={item.link}
                          className="flex-1 py-3 text-left text-neutral-700 hover:text-red-900 font-medium transition-colors"
                        >
                          {item.label}
                        </Link>
                        <button
                          onClick={() => toggleMobileSection(item.key)}
                          className="p-3"
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
                              className="block py-2 pl-4 text-sm text-neutral-600 hover:text-red-900 transition-colors"
                            >
                              {linkItem.title}
                            </Link>
                          ))}
                          {navigationData[item.key].content?.right?.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="mt-4">
                              <h4 className="text-sm font-semibold text-neutral-900 pl-4 mb-2 uppercase tracking-wide">
                                {section.title}
                              </h4>
                              {section.items?.map((linkItem, linkIndex) => (
                                <Link
                                  key={linkIndex}
                                  href={linkItem.link}
                                  className="block py-2 pl-6 text-sm text-neutral-600 hover:text-red-900 transition-colors"
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
                      className="block py-3 text-neutral-700 hover:text-red-900 font-medium transition-colors"
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

  if (isLoading || !isClient) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-40 bg-stone-50 border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-9">
              <div className="flex items-center space-x-2 flex-1">
                <div className="w-4 h-4 bg-stone-200 rounded animate-pulse"></div>
                <div className="flex-1 text-center">
                  <div className="w-80 h-3 bg-stone-200 rounded mx-auto animate-pulse"></div>
                </div>
                <div className="w-4 h-4 bg-stone-200 rounded animate-pulse"></div>
              </div>
              <div className="w-24 h-3 bg-stone-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        <header className="fixed top-9 left-0 right-0 z-30 bg-white/95 backdrop-blur-md shadow-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="w-32 h-6 bg-stone-200 rounded animate-pulse"></div>
              <nav className="hidden md:flex items-center space-x-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="w-16 h-4 bg-stone-200 rounded animate-pulse"></div>
                ))}
              </nav>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-stone-200 rounded animate-pulse"></div>
                <div className="w-5 h-5 bg-stone-200 rounded animate-pulse"></div>
                <div className="w-5 h-5 bg-stone-200 rounded animate-pulse"></div>
                <div className="md:hidden w-5 h-5 bg-stone-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        shouldApplyScrolledStyle 
          ? 'bg-stone-50 border-b border-stone-200' 
          : 'bg-white/5 backdrop-blur-md border-b border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-9">
            <div className="flex items-center space-x-2 flex-1">
              <button
                onClick={prevPromo}
                className={`p-1 rounded-full transition-all duration-200 ${
                  shouldApplyScrolledStyle
                    ? 'text-neutral-600 hover:text-red-900 hover:bg-stone-100'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <div className="flex-1 text-center">
                <span className={`text-xs tracking-wide transition-colors duration-300 ${
                  shouldApplyScrolledStyle ? 'text-neutral-700' : 'text-white/90'
                }`}>
                  {promoMessages[currentPromoIndex]}
                </span>
              </div>
              <button
                onClick={nextPromo}
                className={`p-1 rounded-full transition-all duration-200 ${
                  shouldApplyScrolledStyle
                    ? 'text-neutral-600 hover:text-red-900 hover:bg-stone-100'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <button
              onClick={handleUserClick}
              className={`flex items-center space-x-1.5 text-xs hover:underline transition-colors duration-300 ${
                shouldApplyScrolledStyle 
                  ? 'text-neutral-700 hover:text-red-900' 
                  : 'text-white/90 hover:text-white'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {user ? `Bonjour ${user.client?.firstName}` : 'Rejoignez-nous'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <header
        className={`fixed top-9 left-0 right-0 z-30 transition-all duration-300 ${
          shouldApplyScrolledStyle 
            ? 'bg-white/95 backdrop-blur-md shadow-sm' 
            : 'bg-transparent'
        }`}
        onMouseEnter={() => setIsNavbarHovered(true)}
        onMouseLeave={() => setIsNavbarHovered(false)}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className={`text-2xl font-serif tracking-tight transition-colors duration-300 ${
                  shouldApplyScrolledStyle ? 'text-neutral-900' : 'text-white'
                }`}
              >
                DressCode
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              {Object.entries(navigationData).map(([key, nav]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => nav.hasDropdown && handleMouseEnter(key)}
                  onMouseLeave={() => nav.hasDropdown && handleMouseLeave()}
                >
                  <Link
                    href={nav.link}
                    className={`flex items-center text-sm font-medium px-3 py-2 rounded-md transition-all duration-200 ${
                      shouldApplyScrolledStyle 
                        ? 'text-neutral-700 hover:text-red-900 hover:bg-stone-50' 
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {key}
                    {nav.hasDropdown && (
                      <ChevronDown className={`ml-1 h-3 w-3 transition-transform duration-200 ${
                        activeDropdown === key ? 'rotate-180' : ''
                      }`} />
                    )}
                  </Link>
                </div>
              ))}
            </nav>

            <div className="flex items-center space-x-2">
              <button
                className={`p-2 rounded-full transition-all duration-200 ${
                  shouldApplyScrolledStyle 
                    ? 'text-neutral-700 hover:text-red-900 hover:bg-stone-50' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <Search className="h-4 w-4" />
              </button>

              <button
                className={`p-2 rounded-full relative transition-all duration-200 ${
                  shouldApplyScrolledStyle 
                    ? 'text-neutral-700 hover:text-red-900 hover:bg-stone-50' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <Heart className="h-4 w-4" />
                {isClient && favoritesCount > 0 && (
                  <span className={`absolute -top-0.5 -right-0.5 text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center transition-all duration-300 ${
                    shouldApplyScrolledStyle 
                      ? 'bg-red-900 text-white' 
                      : 'bg-white text-neutral-900'
                  }`}>
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </span>
                )}
              </button>

              <button
                onClick={toggleCartSidebar}
                className={`p-2 rounded-full relative transition-all duration-200 ${
                  shouldApplyScrolledStyle 
                    ? 'text-neutral-700 hover:text-red-900 hover:bg-stone-50' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                {isClient && cartItemsCount > 0 && (
                  <span className={`absolute -top-0.5 -right-0.5 text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center transition-all duration-300 ${
                    shouldApplyScrolledStyle 
                      ? 'bg-red-900 text-white' 
                      : 'bg-white text-neutral-900'
                  }`}>
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={toggleMobileMenu}
                className={`md:hidden p-2 rounded-full transition-all duration-200 ${
                  shouldApplyScrolledStyle 
                    ? 'text-neutral-700 hover:text-red-900 hover:bg-stone-50' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {activeDropdown && navigationData[activeDropdown]?.hasDropdown && navigationData[activeDropdown].content && (
          <div
            onMouseEnter={() => handleMouseEnter(activeDropdown)}
            onMouseLeave={handleMouseLeave}
          >
            {renderDropdownContent(navigationData[activeDropdown].content!)}
          </div>
        )}
      </header>

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

      <CartSidebar
        isOpen={isCartSidebarOpen}
        onClose={closeCartSidebar}
      />

      {renderMobileMenu()}
    </>
  );
};

export default Header;