"use client"
import React, { use, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, Star, Filter, ChevronDown, X } from 'lucide-react';
import Header from '@/components/common/Header';
import { useCategory, useCategoryNavigation } from '@/hooks/category/useCategory';
import { Product } from '@/types/category';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

// Interface pour les filtres
interface FilterState {
  brands: string[];
  priceRange: { min: number; max: number };
  colors: string[];
  sizes: string[];
  tags: string[];
  sortBy: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const productVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15
    }
  },
  hover: {
    y: -8,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const filterPanelVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const CollectionPage: React.FC<CollectionPageProps> = ({ params }) => {
  // Utiliser React.use() pour unwrap la Promise dans un composant client
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
 
  // Use custom hooks avec le slug résolu
  const { category, isLoading, error } = useCategory(slug);
  const { breadcrumbs, subcategories, hasSubcategories } = useCategoryNavigation();
  
  // État des filtres
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    priceRange: { min: 0, max: 1000 },
    colors: [],
    sizes: [],
    tags: [],
    sortBy: 'featured'
  });
  
  const [showFilters, setShowFilters] = useState(false);
 
  // Mémoiser les produits pour éviter les recalculs
  const products = useMemo(() => category?.allProducts || [], [category?.allProducts]);
  
  // Extraire les options de filtres des produits
  const filterOptions = useMemo(() => {
    if (!products.length) return {
      brands: [],
      colors: [],
      sizes: [],
      tags: [],
      priceRange: { min: 0, max: 1000 }
    };
    
    const brands = [...new Set(products.map(p => p.brand?.name).filter(Boolean))] as string[];
    const colors = [...new Set(products.flatMap(p => p.variants?.map(v => v.color).filter(Boolean) || []))];
    const sizes = [...new Set(products.flatMap(p => p.variants?.map(v => v.size).filter(Boolean) || []))];
    const tags = [...new Set(products.flatMap(p => p.tags || []))];
    const prices = products.map(p => p.price);
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
    
    return { brands, colors, sizes, tags, priceRange };
  }, [products]);
  
  // Filtrer et trier les produits
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // Filtrer par marque
    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => p.brand?.name && filters.brands.includes(p.brand.name));
    }
    
    // Filtrer par prix
    filtered = filtered.filter(p => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max);
    
    // Filtrer par couleur
    if (filters.colors.length > 0) {
      filtered = filtered.filter(p => 
        p.variants?.some(v => v.color && filters.colors.includes(v.color))
      );
    }
    
    // Filtrer par taille
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(p => 
        p.variants?.some(v => v.size && filters.sizes.includes(v.size))
      );
    }
    
    // Filtrer par tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter(p => 
        p.tags?.some(tag => filters.tags.includes(tag))
      );
    }
    
    // Trier
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.isNewIn && !b.isNewIn) return -1;
          if (!a.isNewIn && b.isNewIn) return 1;
          return 0;
        });
        break;
    }
    
    return filtered;
  }, [products, filters]);

  // Grouper les produits filtrés par catégorie
  const productsByCategory = useMemo(() => {
    if (!category?.children) return [];
   
    return category.children
      .filter(child => {
        // Vérifier si cette catégorie a des produits après filtrage
        const categoryProductIds = child.products?.map(p => p.id) || [];
        return filteredProducts.some(p => categoryProductIds.includes(p.id));
      })
      .map(child => ({
        category: child,
        products: filteredProducts.filter(p => child.products?.some(cp => cp.id === p.id) || false)
      }));
  }, [category?.children, filteredProducts]);
  
  // Fonctions de gestion des filtres
  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type as keyof Pick<FilterState, 'brands' | 'colors' | 'sizes' | 'tags'>].includes(value)
        ? (prev[type as keyof Pick<FilterState, 'brands' | 'colors' | 'sizes' | 'tags'>] as string[]).filter(v => v !== value)
        : [...(prev[type as keyof Pick<FilterState, 'brands' | 'colors' | 'sizes' | 'tags'>] as string[]), value]
    }));
  };
  
  const updatePriceRange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      brands: [],
      priceRange: filterOptions.priceRange,
      colors: [],
      sizes: [],
      tags: [],
      sortBy: 'featured'
    });
  };
  
  const hasActiveFilters = filters.brands.length > 0 || filters.colors.length > 0 || 
    filters.sizes.length > 0 || filters.tags.length > 0 ||
    filters.priceRange.min !== filterOptions.priceRange.min ||
    filters.priceRange.max !== filterOptions.priceRange.max;

  // Loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3"
          >
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-gray-600">Loading category...</span>
          </motion.div>
        </div>
      </>
    );
  }
  
  // Error state
  if (error || !category) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error || 'Collection not found'}
            </h2>
            <p className="text-gray-600">
              We couldn't load this category. Please try again later.
            </p>
          </motion.div>
        </div>
      </>
    );
  }
  
  // Composant pour afficher un produit
  const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => (
    <motion.div
      variants={productVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      custom={index}
      className="group cursor-pointer"
    >
      <motion.div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-4 relative rounded-lg">
        <motion.img
          src={product.images?.[0] || '/api/placeholder/310/400'}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
       
        {/* Tags */}
        <AnimatePresence>
          {product.tags?.slice(0, 1).map((tag: string) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute bottom-4 left-4 bg-black text-white text-xs px-3 py-1 font-medium rounded"
            >
              {tag}
            </motion.div>
          ))}
        </AnimatePresence>
       
        {product.isNewIn && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 left-4 bg-white text-black text-xs px-3 py-1 font-medium rounded shadow-sm"
          >
            NEW IN
          </motion.div>
        )}
       
        {product.featured && (
          <motion.div 
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            className="absolute top-4 right-4"
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </motion.div>
        )}
      </motion.div>
     
      {/* Informations produit */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-black text-sm">
            {product.brand?.name || 'Brand'}
          </h3>
        </div>
       
        <h4 className="font-medium text-black text-sm">
          {product.name}
        </h4>
       
        {product.shortDescription && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {product.shortDescription}
          </p>
        )}
       
        {/* Variantes de couleur */}
        {product.variants?.length > 0 && (
          <motion.div 
            className="flex gap-2 py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {product.variants.slice(0, 5).map((variant, variantIndex: number) => (
              <motion.div
                key={variantIndex}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * variantIndex }}
                whileHover={{ scale: 1.2 }}
                className="w-6 h-6 rounded-full border-2 border-gray-200 cursor-pointer hover:border-black transition-colors duration-200"
                style={{ backgroundColor: variant.colorHex || '#ccc' }}
                title={variant.color || 'Color variant'}
              />
            ))}
            {product.variants.length > 5 && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-gray-500 self-center"
              >
                +{product.variants.length - 5}
              </motion.span>
            )}
          </motion.div>
        )}
       
        {/* Prix */}
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="font-semibold text-black">
            ${product.price}
          </span>
          {product.comparePrice && (
            <span className="text-gray-500 line-through text-sm">
              ${product.comparePrice}
            </span>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
  
  // Composant FilterSection
  const FilterSection: React.FC<{
    title: string;
    children: React.ReactNode;
  }> = ({ title, children }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-gray-200 pb-4 mb-4"
    >
      <h3 className="font-medium text-black mb-3">{title}</h3>
      {children}
    </motion.div>
  );

  return (
    <>
      <Header />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-white"
      >
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4 px-4 max-w-7xl mx-auto"
        >
          <div className="text-sm text-gray-600">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                {index > 0 && <span className="mx-2">/</span>}
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={index === breadcrumbs.length - 1 ? 'text-black' : 'hover:text-black cursor-pointer transition-colors'}
                >
                  {crumb.name}
                </motion.span>
              </React.Fragment>
            ))}
          </div>
        </motion.div>
        
        {/* En-tête de catégorie principale */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="py-4 px-4"
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl lg:text-5xl font-serif text-black mb-4"
              >
                {category.name.toUpperCase()}
              </motion.h1>
              {category.description && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-700 text-lg leading-relaxed"
                >
                  {category.description}
                </motion.p>
              )}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-700 leading-relaxed mt-4"
              >
                Showing {filteredProducts.length} products across {productsByCategory.length} categories
              </motion.p>
            </div>
          </div>
        </motion.div>
        
        {/* Section 1: Sous-catégories */}
        {hasSubcategories && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="px-4"
          >
            <div className="max-w-7xl mx-auto">
              {/* Grille des sous-catégories */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12"
              >
                {subcategories.map((subcategory, index) => (
                  <motion.div 
                    key={subcategory.id} 
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="group cursor-pointer"
                  >
                    <motion.div 
                      className="aspect-[3/4] overflow-hidden bg-gray-100 mb-3 relative rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      {subcategory.image ? (
                        <motion.img
                          src={subcategory.image}
                          alt={subcategory.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">{subcategory.name}</span>
                        </div>
                      )}
                    </motion.div>
                    <h3 className="text-sm font-semibold text-black text-center tracking-wide">
                      {subcategory.name}
                    </h3>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}
        
        {/* NOUVELLE SECTION: Filtres et Tri */}
        {products.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="px-4 py-6 border-t border-gray-200"
          >
            <div className="max-w-7xl mx-auto">
              {/* Barre de contrôle des filtres */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <motion.button
                    onClick={() => setShowFilters(!showFilters)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-black transition-colors"
                  >
                    <motion.div
                      animate={{ rotate: showFilters ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Filter className="w-4 h-4" />
                    </motion.div>
                    <span>Filters</span>
                    <AnimatePresence>
                      {hasActiveFilters && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="bg-black text-white text-xs px-2 py-1 rounded-full"
                        >
                          {filters.brands.length + filters.colors.length + filters.sizes.length + filters.tags.length}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  
                  <AnimatePresence>
                    {hasActiveFilters && (
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        onClick={clearFilters}
                        whileHover={{ scale: 1.05 }}
                        className="text-sm text-gray-600 hover:text-black transition-colors"
                      >
                        Clear all
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Tri */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                  </motion.select>
                </motion.div>
              </div>
              
              {/* Panneau de filtres */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    variants={filterPanelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="bg-gray-50 rounded-lg p-6 mb-6 overflow-hidden"
                  >
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
                    >
                      {/* Filtres par marque */}
                      {filterOptions.brands.length > 0 && (
                        <FilterSection title="Brands">
                          <div className="space-y-2">
                            {filterOptions.brands.map((brand, index) => (
                              <motion.label 
                                key={brand} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center hover:bg-white hover:bg-opacity-50 rounded p-1 transition-colors cursor-pointer"
                              >
                                <motion.input
                                  type="checkbox"
                                  checked={filters.brands.includes(brand)}
                                  onChange={() => toggleFilter('brands', brand)}
                                  whileTap={{ scale: 0.9 }}
                                  className="mr-2 rounded"
                                />
                                <span className="text-sm">{brand}</span>
                              </motion.label>
                            ))}
                          </div>
                        </FilterSection>
                      )}
                      
                      {/* Filtres par couleur */}
                      {filterOptions.colors.length > 0 && (
                        <FilterSection title="Colors">
                          <div className="space-y-2">
                            {filterOptions.colors.slice(0, 8).map((color, index) => (
                              <motion.label 
                                key={color} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center hover:bg-white hover:bg-opacity-50 rounded p-1 transition-colors cursor-pointer"
                              >
                                <motion.input
                                  type="checkbox"
                                  checked={filters.colors.includes(color)}
                                  onChange={() => toggleFilter('colors', color)}
                                  whileTap={{ scale: 0.9 }}
                                  className="mr-2 rounded"
                                />
                                <span className="text-sm capitalize">{color}</span>
                              </motion.label>
                            ))}
                          </div>
                        </FilterSection>
                      )}
                      
                      {/* Filtres par taille */}
                      {filterOptions.sizes.length > 0 && (
                        <FilterSection title="Sizes">
                          <div className="grid grid-cols-3 gap-2">
                            {filterOptions.sizes.slice(0, 9).map((size, index) => (
                              <motion.button
                                key={size}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleFilter('sizes', size)}
                                className={`px-3 py-2 text-sm border rounded transition-all ${
                                  filters.sizes.includes(size)
                                    ? 'bg-black text-white border-black'
                                    : 'border-gray-300 hover:border-black hover:bg-gray-50'
                                }`}
                              >
                                {size}
                              </motion.button>
                            ))}
                          </div>
                        </FilterSection>
                      )}
                      
                      {/* Filtres par tags */}
                      {filterOptions.tags.length > 0 && (
                        <FilterSection title="Tags">
                          <div className="space-y-2">
                            {filterOptions.tags.slice(0, 6).map((tag, index) => (
                              <motion.label 
                                key={tag} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center hover:bg-white hover:bg-opacity-50 rounded p-1 transition-colors cursor-pointer"
                              >
                                <motion.input
                                  type="checkbox"
                                  checked={filters.tags.includes(tag)}
                                  onChange={() => toggleFilter('tags', tag)}
                                  whileTap={{ scale: 0.9 }}
                                  className="mr-2 rounded"
                                />
                                <span className="text-sm">{tag}</span>
                              </motion.label>
                            ))}
                          </div>
                        </FilterSection>
                      )}
                      
                      {/* Filtres par prix */}
                      <FilterSection title="Price Range">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <motion.span
                              key={filters.priceRange.min}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              className="font-medium"
                            >
                              ${filters.priceRange.min}
                            </motion.span>
                            <motion.span
                              key={filters.priceRange.max}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              className="font-medium"
                            >
                              ${filters.priceRange.max}
                            </motion.span>
                          </div>
                          <div className="flex gap-2">
                            <motion.input
                              type="number"
                              placeholder="Min"
                              value={filters.priceRange.min}
                              onChange={(e) => updatePriceRange(Number(e.target.value), filters.priceRange.max)}
                              whileFocus={{ scale: 1.02 }}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-black transition-colors"
                            />
                            <motion.input
                              type="number"
                              placeholder="Max"
                              value={filters.priceRange.max}
                              onChange={(e) => updatePriceRange(filters.priceRange.min, Number(e.target.value))}
                              whileFocus={{ scale: 1.02 }}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-black transition-colors"
                            />
                          </div>
                        </div>
                      </FilterSection>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}
        
        {/* Section 2: Produits groupés par catégorie (avec filtrage) */}
        {productsByCategory.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="py-8 px-4"
          >
            <div className="max-w-7xl mx-auto space-y-16">
              {productsByCategory.map(({ category: subCategory, products: categoryProducts }, categoryIndex) => (
                <motion.section 
                  key={subCategory.id} 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.2 }}
                  className="space-y-8"
                >
                  {/* Titre de la sous-catégorie */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: categoryIndex * 0.2 + 0.1 }}
                    className="border-b border-gray-200 pb-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <motion.h2 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-3xl font-serif text-black mb-2"
                        >
                          {subCategory.name.toUpperCase()}
                        </motion.h2>
                        {subCategory.description && (
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-700 leading-relaxed mb-2"
                          >
                            {subCategory.description}
                          </motion.p>
                        )}
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-gray-700 leading-relaxed"
                        >
                          {categoryProducts.length} product{categoryProducts.length > 1 ? 's' : ''}
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Grille de produits pour cette catégorie */}
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    <AnimatePresence mode="popLayout">
                      {categoryProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </motion.section>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gray-500 text-lg"
            >
              {hasActiveFilters ? 'No products match your filters' : 'No products found in this category'}
            </motion.p>
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onClick={clearFilters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear Filters
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};
 
export default CollectionPage;