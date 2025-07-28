"use client"
import React, { useState } from 'react';
import { ChevronDown, Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';

// Types
interface NavLink {
  title: string;
  link: string;
}

interface NavSection {
  title: string;
  items?: NavLink[];
}

interface FeaturedItem {
  title: string;
  description: string;
  image: string;
}

interface DropdownContent {
  left: NavLink[];
  right: NavSection[];
  featured?: FeaturedItem | FeaturedItem[];
}

interface NavigationItem {
  hasDropdown: boolean;
  content?: DropdownContent;
  link?: string;
}

interface NavigationData {
  [key: string]: NavigationItem;
}

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);

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

  const navigationData: NavigationData = {
    'Vêtements': {
      hasDropdown: true,
      content: {
        left: [
          { title: 'Tous les vêtements', link: '/clothing' },
          { title: 'Tous les vêtements de détente', link: '/clothing/loungewear' },
          { title: 'Guide des tissus', link: '/clothing/fabric-guide' }
        ],
        right: [
          {
            title: 'Style',
            items: [
              { title: 'T-shirts & débardeurs', link: '/clothing/tees-tanks' },
              { title: 'Robes', link: '/clothing/dresses' },
              { title: 'Bodys', link: '/clothing/bodysuits' },
              { title: 'Bas', link: '/clothing/bottoms' },
              { title: 'Sweats à capuche et sweatshirts', link: '/clothing/hoodies' },
              { title: 'Pyjamas', link: '/clothing/pajamas' },
              { title: 'Maternité', link: '/clothing/maternity' }
            ]
          }
        ],
        featured: {
          title: 'La boutique des robes',
          description: 'Robes signature pour toutes les occasions',
          image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=200&fit=crop'
        }
      }
    },
    'Soutiens-gorge': {
      hasDropdown: true,
      content: {
        left: [
          { title: 'Tous les soutiens-gorge', link: '/bras' },
          { title: 'Tous les brassières', link: '/bras/bralettes' },
          { title: 'Lingerie', link: '/bras/lingerie' },
          { title: 'Le guide des soutiens-gorge', link: '/bras/guide' }
        ],
        right: [
          {
            title: 'Silhouette',
            items: [
              { title: 'T-shirt', link: '/bras/t-shirt' },
              { title: 'Sans bretelles', link: '/bras/strapless' },
              { title: 'Couverture intégrale', link: '/bras/full-coverage' },
              { title: 'Décolleté', link: '/bras/scoop' },
              { title: 'Plongeant', link: '/bras/plunge' },
              { title: 'Balconnet', link: '/bras/balconette' },
              { title: 'Triangle', link: '/bras/triangle' },
              { title: 'Demi', link: '/bras/demi' },
              { title: 'Maternité', link: '/bras/maternity' }
            ]
          },
          {
            title: 'Doublure',
            items: [
              { title: 'Push-up', link: '/bras/push-up' },
              { title: 'Non doublé', link: '/bras/unlined' },
              { title: 'Légèrement doublé', link: '/bras/lightly-lined' }
            ]
          }
        ],
        featured: [
          {
            title: 'Soutiens-gorge T-shirt',
            description: 'Modèles du quotidien avec soutien et couverture indétectable',
            image: 'https://images.unsplash.com/photo-1571513722275-4b8c0290cd54?w=150&h=120&fit=crop'
          },
          {
            title: 'Soutiens-gorge Push-up',
            description: 'Styles sexy qui mettent en valeur le décolleté, soulèvent et soutiennent',
            image: 'https://images.unsplash.com/photo-1594736797933-d0c44efab1eb?w=150&h=120&fit=crop'
          }
        ]
      }
    },
    'Sous-vêtements': {
      hasDropdown: true,
      content: {
        left: [
          { title: 'Tous les sous-vêtements', link: '/underwear' },
          { title: 'Kits économiques', link: '/underwear/bundles' },
          { title: 'Lingerie', link: '/underwear/lingerie' }
        ],
        right: [
          {
            title: 'Style',
            items: [
              { title: 'Strings', link: '/underwear/thongs' },
              { title: 'Shorty', link: '/underwear/cheeky' },
              { title: 'Slips', link: '/underwear/briefs' },
              { title: 'Culottes boy short', link: '/underwear/boy-shorts' },
              { title: 'Boxers', link: '/underwear/boxers' },
              { title: 'Maternité', link: '/underwear/maternity' }
            ]
          }
        ],
        featured: {
          title: 'Kits économiques',
          description: 'Videz vos tiroirs ! Obtenez plus de sous-vêtements que vous adorerez, pour moins cher',
          image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=300&h=200&fit=crop'
        }
      }
    },
    'Gainage': {
      hasDropdown: true,
      content: {
        left: [
          { title: 'Tous les vêtements de gainage', link: '/shapewear' },
          { title: 'Solutions pour occasions', link: '/shapewear/occasions' },
          { title: 'Le guide du gainage', link: '/shapewear/guide' }
        ],
        right: [
          {
            title: 'Style',
            items: [
              { title: 'Bodys', link: '/shapewear/bodysuits' },
              { title: 'Sous-vêtements', link: '/shapewear/underwear' },
              { title: 'Shorts & leggings', link: '/shapewear/shorts-leggings' },
              { title: 'Redresseurs de taille', link: '/shapewear/waist-trainers' },
              { title: 'Sans dos', link: '/shapewear/backless' },
              { title: 'Brassières', link: '/shapewear/bralettes' }
            ]
          },
          {
            title: 'Niveau de compression',
            items: [
              { title: 'Léger', link: '/shapewear/light' },
              { title: 'Moyen', link: '/shapewear/mid' },
              { title: 'Fort', link: '/shapewear/strong' },
              { title: 'Très fort', link: '/shapewear/extra-strong' }
            ]
          }
        ],
        featured: [
          {
            title: 'Bodys',
            description: 'Styles galbants qui lissent, sculptent et soutiennent',
            image: 'https://images.unsplash.com/photo-1595348020949-87cdfbb44174?w=150&h=120&fit=crop'
          },
          {
            title: 'La boutique des solutions',
            description: 'Le soutien-gorge qui fait tout, nos bodys viraux et autres solutions indispensables',
            image: 'https://images.unsplash.com/photo-1582142306909-195724d44209?w=150&h=120&fit=crop'
          }
        ]
      }
    },
    'Maillots de bain': {
      hasDropdown: true,
      content: {
        left: [
          { title: 'Tous les maillots de bain', link: '/swim' }
        ],
        right: [
          {
            title: 'Style',
            items: [
              { title: 'Bikinis deux pièces', link: '/swim/two-piece' },
              { title: 'Maillots une pièce', link: '/swim/one-piece' },
              { title: 'Paréos', link: '/swim/cover-ups' },
              { title: 'Accessoires de plage', link: '/swim/accessories' }
            ]
          }
        ],
        featured: [
          {
            title: 'Bikinis deux pièces',
            description: 'Hauts et bas de bikini indispensables',
            image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=120&fit=crop'
          },
          {
            title: 'Maillots une pièce',
            description: 'Silhouettes signature pour un look de plage complet',
            image: 'https://images.unsplash.com/photo-1544966503-7521ac882d5a?w=150&h=120&fit=crop'
          }
        ]
      }
    },
    'Homme': {
      hasDropdown: false,
      link: '/mens'
    },
    'Collections': {
      hasDropdown: true,
      content: {
        left: [
          { title: 'Toutes les collections', link: '/collections' }
        ],
        right: [
          {
            title: 'Collections phares',
            items: [
              { title: 'Fits Everybody', link: '/collections/fits-everybody' },
              { title: 'Collection coton', link: '/collections/cotton' },
              { title: 'Soft Lounge', link: '/collections/soft-lounge' },
              { title: 'DRESSCODE Body', link: '/collections/dresscode-body' },
              { title: 'Seamless Sculpt', link: '/collections/seamless-sculpt' },
              { title: 'Coton polaire', link: '/collections/cotton-fleece' }
            ]
          },
          {
            title: 'Boutiques',
            items: [
              { title: 'La collection vacances', link: '/shops/vacation' },
              { title: 'La boutique été', link: '/shops/summer' },
              { title: 'Transparences', link: '/shops/sheer' },
              { title: 'Lingerie d\'été', link: '/shops/intimates' },
              { title: 'Perfection imprimée', link: '/shops/prints' },
              { title: 'Nuances d\'été', link: '/shops/shades' },
              { title: 'Boutique mariage', link: '/shops/wedding' },
              { title: 'Ensembles deux pièces', link: '/shops/two-piece-sets' },
              { title: 'La boutique nuit', link: '/shops/sleep' },
              { title: 'Sélection de Kim', link: '/shops/kims-picks' }
            ]
          }
        ]
      }
    },
    'Plus': {
      hasDropdown: true,
      content: {
        left: [],
        right: [
          {
            title: 'Plus de DRESSCODE à aimer',
            items: [
              { title: 'Accessoires', link: '/more/accessories' },
              { title: 'Chaussettes & collants', link: '/more/socks-hosiery' },
              { title: 'Chaussures', link: '/more/footwear' },
              { title: 'Cartes cadeaux', link: '/more/gift-cards' }
            ]
          }
        ]
      }
    }
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
    <>
      <header className="bg-white border-b border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="text-2xl font-bold text-black tracking-tight">
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
                    <button className="flex items-center text-sm font-medium text-gray-900 hover:text-gray-600 py-2">
                      {key}
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </button>
                  ) : (
                    <a
                      href={nav.link}
                      className="text-sm font-medium text-gray-900 hover:text-gray-600 py-2"
                    >
                      {key}
                    </a>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Search className="h-5 w-5" />
              </button>
              <button className="hidden sm:block p-2 text-gray-600 hover:text-gray-900">
                <User className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  1
                </span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <ShoppingBag className="h-5 w-5" />
              </button>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
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

      {/* Mobile Menu */}
      {renderMobileMenu()}
    </>
  );
};

export default Header;