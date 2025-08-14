"use client"
import React, { useState } from 'react';
import { ChevronDown, ArrowRight, Star, Heart, ShoppingBag } from 'lucide-react';

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
    "sku": "SKU-1001",
    "stock": 58,
    "available": true,
    "featured": true,
    "isNewIn": false,
    "tags": ["coton", "bio", "décontracté"],
    "slug": "sweat-a-capuche-uniqlo"
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
    "sku": "SKU-1002",
    "stock": 24,
    "available": true,
    "featured": false,
    "isNewIn": true,
    "tags": ["design", "bois", "maison"],
    "slug": "chaise-scandinave"
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
    "sku": "SKU-1003",
    "stock": 35,
    "available": true,
    "featured": true,
    "isNewIn": true,
    "tags": ["ordinateur", "apple", "retina"],
    "slug": "macbook-air-m3"
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
    "sku": "SKU-1004",
    "stock": 120,
    "available": true,
    "featured": false,
    "isNewIn": true,
    "tags": ["parfum", "maison", "artisanale"],
    "slug": "bougie-parfumee-diptyque"
  }
];

// Header Component (simplifié pour l'exemple)
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="/" className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
              isScrolled ? 'text-black' : 'text-white'
            }`}>
              DressCode
            </a>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            {['Femme', 'Homme', 'Enfant', 'Sport', 'Nouveautés'].map((item) => (
              <a key={item} href="#" className={`text-sm font-medium transition-colors duration-300 ${
                isScrolled ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-300'
              }`}>
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <button className={`transition-colors duration-300 ${
              isScrolled ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-300'
            }`}>
              <ShoppingBag className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Product Card Component
const ProductCard = ({ product, featured = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl ${featured ? 'col-span-2 row-span-2' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative overflow-hidden rounded-2xl ${featured ? 'h-96' : 'h-80'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 via-neutral-50 to-white"></div>
        
        {/* Badge Nouveau */}
        {product.isNewIn && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
              Nouveau
            </span>
          </div>
        )}

        {/* Bouton Favoris */}
        <button 
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {/* Image du produit */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className={`w-full h-full bg-neutral-200 rounded-xl flex items-center justify-center text-neutral-400 transition-transform duration-500 ${isHovered ? 'scale-105' : ''}`}>
            <span className="text-6xl font-light">{product.name.charAt(0)}</span>
          </div>
        </div>

        {/* Overlay hover */}
        <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

        {/* Bouton d'action */}
        <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 transform ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}>
          <button className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-neutral-50 transition-colors duration-200">
            Ajouter au panier
          </button>
        </div>
      </div>

      {/* Informations produit */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.shortDescription}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900">{product.price}€</span>
            {product.comparePrice && (
              <span className="text-sm text-gray-400 line-through">{product.comparePrice}€</span>
            )}
          </div>
          
          {product.featured && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">4.8</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Newsletter Component
const Newsletter = () => {
  const [email, setEmail] = useState('');

  return (
    <section className="py-20 bg-neutral-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-light text-white mb-4">
          Restez informé
        </h2>
        <p className="text-neutral-300 mb-8 text-lg">
          Découvrez en avant-première nos nouveautés et offres exclusives
        </p>
        
        <div className="max-w-md mx-auto">
          <div className="flex rounded-full bg-white p-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-full border-none outline-none text-gray-900 placeholder-gray-500"
            />
            <button className="bg-neutral-900 text-white px-6 py-3 rounded-full font-medium hover:bg-neutral-800 transition-colors duration-200">
              S'inscrire
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Categories Component
const Categories = () => {
  const categories = [
    { name: 'Vêtements', count: '2,400 produits', color: 'from-pink-100 to-rose-100' },
    { name: 'Maison', count: '890 produits', color: 'from-blue-100 to-indigo-100' },
    { name: 'Tech', count: '340 produits', color: 'from-gray-100 to-slate-100' },
    { name: 'Parfums', count: '156 produits', color: 'from-purple-100 to-violet-100' }
  ];

  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-gray-900 mb-4">
            Explorez nos collections
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez une sélection soigneusement choisie de produits dans chaque catégorie
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="group cursor-pointer">
              <div className={`h-48 rounded-2xl bg-gradient-to-br ${category.color} p-8 flex flex-col justify-between transition-transform duration-300 group-hover:scale-105`}>
                <div className="self-end">
                  <ArrowRight className="w-6 h-6 text-gray-600 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.count}</p>
                </div>
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
      icon: "👤",
      title: "PASSER COMMANDE",
      description: "Votre guide shopping sur DRESSCODE"
    },
    {
      icon: "❓",
      title: "FAQ",
      description: "Toutes nos réponses à vos questions"
    },
    {
      icon: "💬",
      title: "BESOIN D'AIDE ?",
      description: "Contactez les conseillers de notre Service client"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {supportItems.map((item, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-xl mb-4">DressCode</h3>
            <p className="text-neutral-400 leading-relaxed">
              Votre destination mode et lifestyle pour une garde-robe moderne et élégante.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Collections</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">Femme</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Homme</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Enfant</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sport</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Aide</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Livraison</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Retours</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Suivez-nous</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pinterest</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8 text-center text-neutral-400">
          <p>&copy; 2025 DressCode. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

const HomePage = () => {
  const featuredProducts = productsData.filter(product => product.featured);
  const newProducts = productsData.filter(product => product.isNewIn);
  
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
          <p className="text-xl md:text-2xl font-light mb-8 text-neutral-300">
            Découvrez notre collection soigneusement sélectionnée
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-neutral-100 transition-all duration-200 transform hover:scale-105">
              Découvrir la collection
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white hover:text-black transition-all duration-200">
              Nouveautés
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Nos favoris
            </h2>
            <p className="text-gray-600 text-lg">
              Une sélection de produits qui définissent notre style
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                featured={index === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <Categories />

      {/* New Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Nouveautés
            </h2>
            <p className="text-gray-600 text-lg">
              Les dernières additions à notre collection
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

      {/* Support Section */}
      <SupportSection />

      <Footer />
    </div>
  );
};

export default HomePage;