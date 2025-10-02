"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useFavorites } from '@/hooks/product/useFavorites';
import { useAuth } from '@/context/AuthContext';
import { useCategories } from '@/hooks/category/useCategory';
import { useModal } from '@/context/ModalContext';
import CartSidebar from '../cart/CartSidebar';
import { HeaderProps } from '@/types/header';
import { useCartStore } from '@/store/useCartStore';
import { useHeaderNavigation } from '@/hooks/header/useHeaderNavigation';
import { PromoBanner } from '../Header/PromoBanner';
import { DesktopNavigation } from '../Header/DesktopNavigation';
import { HeaderIcons } from '../Header/HeaderIcons';
import { MobileMenu } from '../Header/MobileMenu';
import { useCartSidebarStore } from '@/store/useCartSidebarStore';

const Header: React.FC<HeaderProps> = ({ forceScrolledStyle = false }) => {
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const { user, isAuthenticated, loading, checkAuthStatus } = useAuth();
  const { openSignUpModal } = useModal();
  const { isOpen: isCartSidebarOpen, toggleSidebar: toggleCartSidebar, closeSidebar: closeCartSidebar } =
    useCartSidebarStore();
  const { favoritesCount } = useFavorites();
  const { categories, mainCategories, isLoading } = useCategories();
  const { navigationData } = useHeaderNavigation(mainCategories, isClient);

  const cartItemsCount = useCartStore((state) =>
    state.items ? state.items.reduce((total, item) => total + item.quantity, 0) : 0,
  );

  const promoMessages = [
    'Livraison gratuite pour les membres du programme DressCode Premium',
    'Nouvelle collection automne-hiver maintenant disponible',
    'Retours gratuits sous 30 jours sur tous les articles',
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !loading && !user) {
      checkAuthStatus();
    }
  }, [isClient, loading, user, checkAuthStatus]);

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
        prevIndex === promoMessages.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const shouldApplyScrolledStyle = forceScrolledStyle || isNavbarHovered || isScrolled;

  const nextPromo = () => {
    setCurrentPromoIndex((prevIndex) =>
      prevIndex === promoMessages.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevPromo = () => {
    setCurrentPromoIndex((prevIndex) =>
      prevIndex === 0 ? promoMessages.length - 1 : prevIndex - 1,
    );
  };

  const handleUserClick = () => {
    if (user && isAuthenticated) {
      console.log('User is authenticated:', user);
    } else {
      openSignUpModal();
    }
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
      <PromoBanner
        messages={promoMessages}
        currentIndex={currentPromoIndex}
        onNext={nextPromo}
        onPrev={prevPromo}
        shouldApplyScrolledStyle={shouldApplyScrolledStyle}
      />
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
            <DesktopNavigation
              navigationData={navigationData}
              activeDropdown={activeDropdown}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              shouldApplyScrolledStyle={shouldApplyScrolledStyle}
            />
            <HeaderIcons
              favoritesCount={favoritesCount}
              cartItemsCount={cartItemsCount}
              shouldApplyScrolledStyle={shouldApplyScrolledStyle}
              onUserClick={handleUserClick}
              onCartClick={toggleCartSidebar}
              onMobileMenuClick={toggleMobileMenu}
              userName={user?.client?.firstName}
            />
          </div>
        </div>
      </header>
      <CartSidebar isOpen={isCartSidebarOpen} onClose={closeCartSidebar} />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={toggleMobileMenu}
        navigationData={navigationData}
        expandedSection={expandedMobileSection}
        onToggleSection={toggleMobileSection}
      />
    </>
  );
};

export default Header;
