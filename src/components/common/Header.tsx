// components/Header/Header.tsx - Version sans useHomePage
"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, ShoppingBag, Menu, X } from 'lucide-react';
import Link from 'next/link';

import { useCartStore } from '@/store/useCartStore';
import { useCartSidebarStore } from '@/store/useCartSidebarStore';
import CartSidebar from '../cart/CartSidebar';

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
  const [isClient, setIsClient] = useState(false);

  const { isOpen: isCartSidebarOpen, toggleSidebar: toggleCartSidebar, closeSidebar: closeCartSidebar } = useCartSidebarStore();
  const cartItemsCount = useCartStore((state) => state.getCartItemsCount());

  // Fix hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shouldApplyScrolledStyle = forceScrolledStyle || isNavbarHovered || isScrolled;

  // Navigation statique simplifiée
  const navigationData: NavigationData = {
    "Femme": {
      hasDropdown: true,
      link: "/collections/femme",
      items: [
        { title: "Tous les vêtements femme", link: "/collections/femme" },
        { title: "Robes", link: "/collections/femme/robes" },
        { title: "Tops & T-shirts", link: "/collections/femme/tops" },
        { title: "Pantalons", link: "/collections/femme/pantalons" },
        { title: "Jeans", link: "/collections/femme/jeans" },
        { title: "Vestes", link: "/collections/femme/vestes" },
        { title: "Chaussures", link: "/collections/femme/chaussures" },
        { title: "Accessoires", link: "/collections/femme/accessoires" }
      ]
    },
    "Homme": {
      hasDropdown: true,
      link: "/collections/homme",
      items: [
        { title: "Tous les vêtements homme", link: "/collections/homme" },
        { title: "T-shirts", link: "/collections/homme/tshirts" },
        { title: "Chemises", link: "/collections/homme/chemises" },
        { title: "Pantalons", link: "/collections/homme/pantalons" },
        { title: "Jeans", link: "/collections/homme/jeans" },
        { title: "Vestes", link: "/collections/homme/vestes" },
        { title: "Chaussures", link: "/collections/homme/chaussures" },
        { title: "Accessoires", link: "/collections/homme/accessoires" }
      ]
    },
    "Enfant": {
      hasDropdown: true,
      link: "/collections/enfant",
      items: [
        { title: "Tous les vêtements enfant", link: "/collections/enfant" },
        { title: "Filles", link: "/collections/enfant/filles" },
        { title: "Garçons", link: "/collections/enfant/garcons" },
        { title: "Bébé", link: "/collections/enfant/bebe" },
        { title: "Chaussures", link: "/collections/enfant/chaussures" },
        { title: "Accessoires", link: "/collections/enfant/accessoires" }
      ]
    },
    "Sport": {
      hasDropdown: true,
      link: "/collections/sport",
      items: [
        { title: "Tous les articles sport", link: "/collections/sport" },
        { title: "Running", link: "/collections/sport/running" },
        { title: "Fitness", link: "/collections/sport/fitness" },
        { title: "Football", link: "/collections/sport/football" },
        { title: "Basketball", link: "/collections/sport/basketball" },
        { title: "Natation", link: "/collections/sport/natation" },
        { title: "Équipements", link: "/collections/sport/equipements" }
      ]
    },
    "Nouveautés": {
      hasDropdown: false,
      link: "/collections/nouveautes"
    },
    "Soldes": {
      hasDropdown: false,
      link: "/collections/soldes"
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

            {/* Navigation statique */}
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