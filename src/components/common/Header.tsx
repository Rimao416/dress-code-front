// components/Header/Header.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { DropdownContent, FeaturedItem, navigationData, NavigationItem, NavLink, NavSection } from '@/components/Header/NavigationData';
import Link from 'next/link';
import { useFavorites } from '@/hooks/product/useFavorites';
import { useCartStore } from '@/store/useCartStore';
import { useCartSidebarStore } from '@/store/useCartSidebarStore'; // NOUVEAU
import SignUpModal from '../modal/SignUpModal';
import CartSidebar from '../cart/CartSidebar';

interface HeaderProps {
  forceScrolledStyle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ forceScrolledStyle = false }) => {
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  
  // MODIFIÉ: Utilisation du store pour la sidebar
  const { isOpen: isCartSidebarOpen, toggleSidebar: toggleCartSidebar, closeSidebar: closeCartSidebar } = useCartSidebarStore();
  
  const { favoritesCount } = useFavorites();
  const cartItemsCount = useCartStore((state) => state.getCartItemsCount());
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const shouldApplyScrolledStyle = forceScrolledStyle || isNavbarHovered || isScrolled;
  
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
      { key: 'Nouveau', label: 'Nouveau', hasDropdown: false, link: '/nouveau' },
      { key: 'Meilleures Ventes', label: 'Meilleures Ventes', hasDropdown: false, link: '/meilleures-ventes' },
      { key: 'Vêtements', label: 'Vêtements', hasDropdown: true },
      { key: 'Soutiens-gorge', label: 'Soutiens-gorge', hasDropdown: true },
      { key: 'Sous-vêtements', label: 'Sous-vêtements', hasDropdown: true },
      { key: 'Gainage', label: 'Gainage', hasDropdown: true },
      { key: 'Maillots de bain', label: 'Maillots de bain', hasDropdown: true },
      { key: 'Homme', label: 'Homme', hasDropdown: false, link: '/homme' },
      { key: 'Collections', label: 'Collections', hasDropdown: true },
      { key: 'Plus', label: 'Plus', hasDropdown: true }
    ];
    
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
                          {navigationData[item.key].content!.left.map((linkItem, index) => (
                            <a
                              key={index}
                              href={linkItem.link}
                              className="block py-2 pl-4 text-sm text-gray-700 hover:text-gray-900"
                            >
                              {linkItem.title}
                            </a>
                          ))}
                          
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
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          shouldApplyScrolledStyle ? 'bg-white backdrop-blur-sm shadow-sm' : 'bg-transparent backdrop-blur-sm'
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
            
            <nav className="hidden md:flex items-center space-x-4">
              {Object.entries(navigationData).map(([key, nav]: [string, NavigationItem]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => nav.hasDropdown && handleMouseEnter(key)}
                  onMouseLeave={() => nav.hasDropdown && handleMouseLeave()}
                >
                  {nav.hasDropdown ? (
                    <button
                      className={`flex items-center text-sm font-medium px-2 py-2 rounded transition-colors duration-300 ${
                        shouldApplyScrolledStyle ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-300'
                      }`}
                    >
                      {key}
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </button>
                  ) : nav.link ? (
                    <Link
                      href={nav.link}
                      className={`text-sm font-medium px-2 py-2 rounded transition-colors duration-300 ${
                        shouldApplyScrolledStyle ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-300'
                      }`}
                    >
                      {key}
                    </Link>
                  ) : null}
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
                onClick={() => setIsSignUpModalOpen(true)}
                className={`hidden sm:block p-2 transition-colors duration-300 ${
                  shouldApplyScrolledStyle ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-300'
                }`}
              >
                <User className="h-5 w-5" />
              </button>
              
              <button
                className={`p-2 relative transition-colors duration-300 ${
                  shouldApplyScrolledStyle ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-300'
                }`}
              >
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
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
                {cartItemsCount > 0 && (
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