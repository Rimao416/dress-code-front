"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowRight, Star, Heart, ShoppingBag, Plus, Check, X } from 'lucide-react';
import Header from '@/components/common/Header';

const productsData = [
  {
    "id": "prd0001",
    "name": "Sweat à Capuche Uniqlo",
    "description": "Sweat en coton bio avec capuche ajustable et poche kangourou",
    "shortDescription": "Sweat à capuche coton bio",
    "price": 39.99,
    "comparePrice": 49.99,
    "images": [
      "https://res.cloudinary.com/demo/image/upload/v1753970634/uploads/hoodie-uniqlo.jpg"
    ],
    "categoryId": "cat0001",
    "brandId": "brand0001",
    "brand": { "name": "UNIQLO" },
    "sku": "SKU-1001",
    "stock": 58,
    "available": true,
    "featured": true,
    "isNewIn": false,
    "tags": ["coton", "bio", "décontracté"],
    "slug": "sweat-a-capuche-uniqlo",
    "averageRating": 4.8,
    "reviewCount": 124
  },
  {
    "id": "prd0002",
    "name": "Chaise Scandinave",
    "description": "Chaise design scandinave en bois et assise rembourrée",
    "shortDescription": "Chaise bois et tissu scandinave",
    "price": 119.99,
    "comparePrice": 149.99,
    "images": [
      "https://res.cloudinary.com/demo/image/upload/v1753970634/uploads/chair-scandinave.jpg"
    ],
    "categoryId": "cat0002",
    "brandId": "brand0002",
    "brand": { "name": "NORDIC DESIGN" },
    "sku": "SKU-1002",
    "stock": 24,
    "available": true,
    "featured": false,
    "isNewIn": true,
    "tags": ["design", "bois", "maison"],
    "slug": "chaise-scandinave",
    "averageRating": 4.6,
    "reviewCount": 89
  },
  {
    "id": "prd0003",
    "name": "MacBook Air M3",
    "description": "Ordinateur portable Apple avec puce M3 et écran Retina",
    "shortDescription": "MacBook Air 13'' M3",
    "price": 1399.99,
    "comparePrice": null,
    "images": [
      "https://res.cloudinary.com/demo/image/upload/v1753970634/uploads/macbook-air-m3.jpg"
    ],
    "categoryId": "cat0003",
    "brandId": "brand0003",
    "brand": { "name": "APPLE" },
    "sku": "SKU-1003",
    "stock": 35,
    "available": true,
    "featured": true,
    "isNewIn": true,
    "tags": ["ordinateur", "apple", "retina"],
    "slug": "macbook-air-m3",
    "averageRating": 4.9,
    "reviewCount": 256
  },
  {
    "id": "prd0004",
    "name": "Bougie parfumée Diptyque",
    "description": "Bougie parfumée artisanale aux notes florales et boisées",
    "shortDescription": "Bougie Diptyque parfum floral",
    "price": 54.99,
    "comparePrice": null,
    "images": [
      "https://res.cloudinary.com/demo/image/upload/v1753970634/uploads/bougie-diptyque.jpg"
    ],
    "categoryId": "cat0004",
    "brandId": "brand0004",
    "brand": { "name": "DIPTYQUE" },
    "sku": "SKU-1004",
    "stock": 120,
    "available": true,
    "featured": false,
    "isNewIn": true,
    "tags": ["parfum", "maison", "artisanale"],
    "slug": "bougie-parfumee-diptyque",
    "averageRating": 4.7,
    "reviewCount": 67
  }
];

// Button Component
const Button = ({ children, variant = "black", size = "md", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    black: "bg-black text-white hover:bg-gray-800 active:bg-gray-900",
    white: "bg-white text-black border border-gray-300 hover:bg-gray-50 active:bg-gray-100",
    outline: "border-2 border-black text-black hover:bg-black hover:text-white"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Header Component


// Product Card Component
const ProductCard = ({ product, featured = false, showBrand = true, showPrice = true, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  const handleAddToBag = (e) => {
    e.stopPropagation();
    setShowAddedFeedback(true);
    setTimeout(() => setShowAddedFeedback(false), 2000);
  };

  const handleProductClick = () => {
    onClick?.(product);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? 'fill-black text-black'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div
      className={`group relative overflow-hidden cursor-pointer ${featured ? 'col-span-2 row-span-2' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      <div className={`relative overflow-hidden bg-gray-50 ${featured ? 'h-96' : 'h-80'}`}>
        {/* Badge Nouveau */}
        {product.isNewIn && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded">
              Nouveau
            </span>
          </div>
        )}

        {/* Bouton Favoris */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-110"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {/* Image du produit */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className={`w-full h-full bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 transition-transform duration-500 ${isHovered ? 'scale-105' : ''}`}>
            <span className="text-6xl font-light">{product.name.charAt(0)}</span>
          </div>
        </div>

        {/* Overlay hover */}
        <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

        {/* Bouton d'action */}
        <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 transform ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}>
          <Button
            variant="white"
            size="sm"
            className="w-full shadow-lg"
            onClick={handleAddToBag}
          >
            {showAddedFeedback ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-600" />
                Ajouté
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter au panier
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Informations produit */}
      <div className="p-4 space-y-2">
        {showBrand && product.brand && (
          <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {product.brand.name}
          </div>
        )}
        
        <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-tight">
          {product.name}
        </h3>
        
        <p className="text-xs text-gray-500 line-clamp-1">
          {product.shortDescription}
        </p>

        <div className="flex items-center justify-between">
          {showPrice && (
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900 text-sm">
                €{product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-xs text-gray-400 line-through">
                  €{product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>
          )}

          {product.averageRating > 0 && (
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {renderStars(product.averageRating)}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviewCount})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Input Component
const Input = ({ label, error, className = "", ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black transition-colors ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

// Categories Component
const Categories = () => {
  const categories = [
    { name: 'Vêtements', count: '2,400 produits', color: 'from-pink-100 to-rose-100', image: null },
    { name: 'Maison', count: '890 produits', color: 'from-blue-100 to-indigo-100', image: null },
    { name: 'Tech', count: '340 produits', color: 'from-gray-100 to-slate-100', image: null },
    { name: 'Parfums', count: '156 produits', color: 'from-purple-100 to-violet-100', image: null }
  ];

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category.name);
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-serif text-black mb-4">
            Explorez nos collections
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez une sélection soigneusement choisie de produits dans chaque catégorie
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="group cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              <div className={`h-48 rounded-2xl bg-gradient-to-br ${category.color} p-6 flex flex-col justify-between transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg relative overflow-hidden`}>
                <div className="self-end">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <ArrowRight className="w-4 h-4 text-gray-700 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 uppercase tracking-wide">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm opacity-90">
                    {category.count}
                  </p>
                </div>
                
                {/* Effet de survol */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Support Section Component
const SupportSection = () => {
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
      title: "BESOIN D'AIDE ?",
      description: "Contactez les conseillers de notre Service client"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {supportItems.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
            >
              <div className="flex flex-col items-start space-y-4">
                <div className="text-gray-700 group-hover:text-black transition-colors duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 uppercase tracking-wide">
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
  );
};

// Newsletter Component
const Newsletter = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    acceptNewsletters: false
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', formData);
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Colonne gauche - Informations */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                DressCode
              </h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 uppercase tracking-wide">
                MEMBER PROGRAM
              </h3>
            </div>
            
            <p className="text-gray-600 leading-relaxed">
              Bienvenue parmi nous ! Nous sommes ravis de vous avoir à bord. Profitez
              dès maintenant de notre service de livraison gratuite sur toutes vos
              commandes, d'un cadeau spécial pour votre anniversaire, ainsi que d'un
              accès privilégié aux nouveaux produits et à leurs exclusivités.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold text-sm">%</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    -10% sur votre commande en vous inscrivant à notre newsletter
                  </h4>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Livraison et retours GRATUITS
                  </h4>
                </div>
              </div>
            </div>
          </div>
          
          {/* Colonne droite - Formulaire */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  placeholder="Votre prénom"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  error={errors.firstName}
                  required
                />
                <Input
                  label="Nom"
                  placeholder="Votre nom"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  error={errors.lastName}
                  required
                />
              </div>
              
              <Input
                type="email"
                label="E-mail"
                placeholder="votre.email@exemple.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                required
              />
              
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="newsletters"
                  checked={formData.acceptNewsletters}
                  onChange={(e) => handleInputChange('acceptNewsletters', e.target.checked)}
                  className="mt-1 w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="newsletters" className="text-xs text-gray-500 leading-tight">
                  J'accepte de recevoir des informations sur les nouveautés, les offres spéciales et les événements de DressCode.
                </label>
              </div>
              
              <Button
                type="submit"
                variant="black"
                size="lg"
                className="w-full uppercase tracking-wide font-semibold"
              >
                Rejoindre le programme
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="font-bold text-xl">DressCode</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Votre destination mode et lifestyle pour une garde-robe moderne et élégante.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wide">Collections</h4>
            <ul className="space-y-2 text-gray-400">
              {['Femme', 'Homme', 'Enfant', 'Sport'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wide">Aide</h4>
            <ul className="space-y-2 text-gray-400">
              {['Contact', 'FAQ', 'Livraison', 'Retours'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wide">Suivez-nous</h4>
            <ul className="space-y-2 text-gray-400">
              {['Instagram', 'Facebook', 'Twitter', 'Pinterest'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p className="text-sm">&copy; 2025 DressCode. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

// Main HomePage Component
const HomePage = () => {
  const featuredProducts = productsData.filter(product => product.featured);
  const newProducts = productsData.filter(product => product.isNewIn);
  
  const handleProductClick = (product) => {
    console.log('Product clicked:', product.name);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6TTM0IDM0djItMlYzNGgyem0wIDJoMnYtMmgtMnYyek0zMCAzNHYySDI4VjM0aDJ6bTAgMmgydi0yaC0ydjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">
            Style moderne,<br />
            <span className="italic">simplicité absolue</span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 text-neutral-300 max-w-2xl mx-auto">
            Découvrez notre collection soigneusement sélectionnée pour un style contemporain et intemporel
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="white" 
              size="lg" 
              className="text-lg font-medium transform hover:scale-105"
            >
              Découvrir la collection
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg font-medium border-white text-white hover:bg-white hover:text-black"
            >
              Nouveautés
            </Button>
          </div>
        </div>
      </section>

      {/* Section Produits mis en avant */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs sm:text-sm font-medium text-black tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-4">
              Les marques qui retiennent notre attention
            </div>
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Nos favoris
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Une sélection de produits qui définissent notre style et notre vision de la mode contemporaine
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                featured={index === 0}
                onClick={handleProductClick}
                showBrand={true}
                showPrice={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <Categories />

      {/* Section Nouveautés */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/3 text-center lg:text-left">
              <div className="text-sm text-gray-600 mb-2 tracking-wider uppercase">
                {newProducts.length} NOUVEAUTÉS
              </div>
              <h2 className="text-4xl lg:text-5xl font-serif text-black mb-6">
                Nouveautés
              </h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Nouveautés disponibles dès maintenant - découvrez les dernières sorties 
                et les pièces tendances qui viennent enrichir notre collection
              </p>
              <Button variant="black" size="lg" className="uppercase tracking-wide">
                Voir toutes les nouveautés
              </Button>
            </div>
            
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {newProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={handleProductClick}
                    showBrand={true}
                    showPrice={true}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Engagement/Valeurs */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Notre engagement
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Chez DressCode, nous croyons en une mode responsable et durable. 
              Chaque produit est sélectionné avec soin pour allier style, qualité et respect de l'environnement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-200">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                Mode Éthique
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Partenariat avec des marques respectueuses de l'environnement et des conditions de travail équitables
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-200">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                Qualité Premium
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Sélection rigoureuse de produits durables et intemporels pour un investissement à long terme
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-200">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                Livraison Rapide
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Expédition sous 24h et livraison gratuite dès 50€ d'achat avec un packaging éco-responsable
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <SupportSection />

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer */}
      <Footer />

      {/* Styles personnalisés */}
      <style jsx global>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        /* Focus states pour l'accessibilité */
        button:focus-visible,
        input:focus-visible,
        a:focus-visible {
          outline: 2px solid #000;
          outline-offset: 2px;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Améliorations pour les animations de hover */
        .group:hover .group-hover\:scale-105 {
          transform: scale(1.05);
        }
        
        .group:hover .group-hover\:scale-110 {
          transform: scale(1.1);
        }
        
        .group:hover .group-hover\:translate-x-0\.5 {
          transform: translateX(0.125rem);
        }
      `}</style>
    </div>
  );
};

export default HomePage