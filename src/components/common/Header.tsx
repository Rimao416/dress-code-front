// components/Header/Header.tsx - Version simplifiée
"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, ShoppingBag, Menu, X } from 'lucide-react';
import Link from 'next/link';

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

interface DropdownItem {
  title: string;
  link: string;
}

interface NavigationItem {
  hasDropdown: boolean;
  link: string;
  items?: DropdownItem[];
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
 
  const [isClient, setIsClient] = useState(false);
  const { user, isAuthenticated, loading, checkAuthStatus } = useAuth();
  const { isOpen: isCartSidebarOpen, toggleSidebar: toggleCartSidebar, closeSidebar: closeCartSidebar } = useCartSidebarStore();
  const cartItemsCount = useCartStore((state) => state.getCartItemsCount());

  // Charger les catégories depuis l'API
  const { categories, isLoading } = useHomePage({
    autoFetch: true,
    filters: {
      categoriesLimit: 20
    }
  });

  // Fix hydration
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
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shouldApplyScrolledStyle = forceScrolledStyle || isNavbarHovered || isScrolled;

  // Créer la navigation dynamique simplifiée
  const createSimpleNavigation = (): NavigationData => {
    if (!categories || categories.length === 0) {
      return {};
    }

    const navigationData: NavigationData = {};
    const mainCategories = categories.filter(cat => !cat.parentId);
    const sortedCategories = mainCategories
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
      .slice(0, 6);

    sortedCategories.forEach(category => {
      const hasChildren = category.children && category.children.length > 0;
      
      navigationData[category.name] = {
        hasDropdown: hasChildren,
        link: `/collections/${category.slug}`,
        items: hasChildren ? [
          { title: `Tous les ${category.name}`, link: `/collections/${category.slug}` },
          ...category.children!.slice(0, 8).map(child => ({
            title: child.name,
            link: `/collections/${child.slug}`
          }))
        ] : undefined
      };
    });

    // Menu "Plus" pour les catégories restantes
    const remainingCategories = mainCategories.slice(6);
    if (remainingCategories.length > 0) {
      navigationData['Plus'] = {
        hasDropdown: true,
        link: '/collections',
        items: [
          { title: "Toutes les collections", link: "/collections" },
          { title: "Nouveautés", link: "/collections?filter=new" },
          ...remainingCategories.slice(0, 6).map(cat => ({
            title: cat.name,
            link: `/collections/${cat.slug}`
          }))
        ]
      };
    }

    return navigationData;
  };

  const navigationData = createSimpleNavigation();

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

  const renderSimpleDropdown = (items: DropdownItem[]) => {
    return (
      <div className="absolute top-full left-0 w-64 bg-white shadow-lg border rounded-lg z-50 py-2">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          >
            {item.title}
          </Link>
        ))}
      </div>
    );
  };

  const renderMobileMenu = () => {
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
              {Object.entries(navigationData).map(([key, nav]) => (
                <div key={key} className="border-b border-gray-200">
                  {nav.hasDropdown ? (
                    <div>
                      <div className="flex items-center">
                        <Link
                          href={nav.link}
                          className="flex-1 py-4 text-left text-gray-900 font-medium"
                        >
                          {key}
                        </Link>
                        <button
                          onClick={() => toggleMobileSection(key)}
                          className="p-4"
                        >
                          <ChevronDown className={`h-4 w-4 transform transition-transform ${
                            expandedMobileSection === key ? 'rotate-180' : ''
                          }`} />
                        </button>
                      </div>
                      {expandedMobileSection === key && nav.items && (
                        <div className="pb-4">
                          {nav.items.map((item, index) => (
                            <Link
                              key={index}
                              href={item.link}
                              className="block py-2 pl-4 text-sm text-gray-700 hover:text-gray-900"
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={nav.link}
                      className="block py-4 text-gray-900 font-medium"
                    >
                      {key}
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
      <header className="fixed left-0 right-0 z-30 bg-white/95 backdrop-blur-sm shadow-sm">
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
              <div className="md:hidden w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
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

            {/* Navigation simplifiée */}
            <nav className="hidden md:flex items-center space-x-6">
              {Object.entries(navigationData).map(([key, nav]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => nav.hasDropdown && handleMouseEnter(key)}
                  onMouseLeave={() => nav.hasDropdown && handleMouseLeave()}
                >
                  <Link
                    href={nav.link}
                    className={`flex items-center text-sm font-medium px-3 py-2 rounded transition-colors duration-300 ${
                      shouldApplyScrolledStyle ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-300'
                    }`}
                  >
                    {key}
                    {nav.hasDropdown && <ChevronDown className="ml-1 h-3 w-3" />}
                  </Link>
                  
                  {/* Dropdown simplifié */}
                  {activeDropdown === key && nav.hasDropdown && nav.items && (
                    <div
                      onMouseEnter={() => handleMouseEnter(key)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {renderSimpleDropdown(nav.items)}
                    </div>
                  )}
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
                onClick={toggleCartSidebar}
                className={`p-2 relative transition-colors duration-300 ${
                  shouldApplyScrolledStyle ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-300'
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
                {isClient && cartItemsCount > 0 && (
                  <span className={`absolute -top-1 -right-1 text-xs font-semibold rounded-full min-w-4 h-4 px-1 flex items-center justify-center transition-all duration-300 ${
                    shouldApplyScrolledStyle ? 'bg-black text-white' : 'bg-white text-black'
                  }`}>
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