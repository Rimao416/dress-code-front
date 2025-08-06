"use client"
import React, { use, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import du router Next.js
import { Loader2, AlertCircle, Star, Filter, ChevronDown, X } from 'lucide-react';
import Header from '@/components/common/Header';
import { useCategory, useCategoryNavigation } from '@/hooks/category/useCategory';
import { Product, Category } from '@/types/category';

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

const CollectionPage: React.FC<CollectionPageProps> = ({ params }) => {
  const router = useRouter(); // Hook Next.js pour la navigation
 
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
 
  // Fonction pour naviguer vers une sous-catégorie
  const handleSubcategoryClick = (subcategory: Category) => {
    // Naviguer vers la nouvelle URL avec le slug de la sous-catégorie
    router.push(`/collections/${subcategory.slug}`);
  };

  // Extraire les options de filtres des produits
  const filterOptions = useMemo(() => {
    if (!products.length) return {
      brands: [],
      colors: [],
      sizes: [],
      tags: [],
      priceRange: { min: 0, max: 1000 }
    };
   
    const brands = [...new Set(products.map(p => p.brand?.name).filter((name): name is string => Boolean(name)))];
    const colors = [...new Set(products.flatMap(p => p.variants?.map(v => v.color).filter((color): color is string => Boolean(color)) || []))];
    const sizes = [...new Set(products.flatMap(p => p.variants?.map(v => v.size).filter((size): size is string => Boolean(size)) || []))];
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
 
  // CORRECTION : Grouper les produits filtrés par catégorie
  const productsByCategory = useMemo(() => {
    if (!category) return [];
    
    const result: { category: Category; products: Product[] }[] = [];
    
    // 1. Si la catégorie courante a des produits DIRECTS, on les ajoute
    if (category.products && category.products.length > 0) {
      const directProducts = filteredProducts.filter(p => 
        category.products.some(cp => cp.id === p.id)
      );
      
      if (directProducts.length > 0) {
        result.push({
          category: category,
          products: directProducts
        });
      }
    }
    
    // 2. Si la catégorie a des enfants avec des produits, on les ajoute aussi
    if (category.children && category.children.length > 0) {
      category.children.forEach(child => {
        if (child.products && child.products.length > 0) {
          const categoryProductIds = child.products.map(p => p.id);
          const childProducts = filteredProducts.filter(p => 
            categoryProductIds.includes(p.id)
          );
          
          if (childProducts.length > 0) {
            result.push({
              category: child,
              products: childProducts
            });
          }
        }
      });
    }
    
    return result;
  }, [category, filteredProducts]);
 
  // Fonctions de gestion des filtres
  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: (prev[type as keyof Pick<FilterState, 'brands' | 'colors' | 'sizes' | 'tags'>] as string[]).includes(value)
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
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-gray-600">Loading category...</span>
          </div>
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
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error || 'Collection not found'}
            </h2>
            <p className="text-gray-600">
              We couldn't load this category. Please try again later.
            </p>
          </div>
        </div>
      </>
    );
  }
 
  // Composant pour afficher un produit
  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div key={product.id} className="group cursor-pointer">
      <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-4 relative">
        <img
          src={product.images?.[0] || '/api/placeholder/310/400'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
       
        {/* Tags */}
        {product.tags?.slice(0, 1).map((tag: string) => (
          <div
            key={tag}
            className="absolute bottom-4 left-4 bg-black text-white text-xs px-3 py-1 font-medium"
          >
            {tag}
          </div>
        ))}
       
        {product.isNewIn && (
          <div className="absolute top-4 left-4 bg-white text-black text-xs px-3 py-1 font-medium">
            NEW IN
          </div>
        )}
       
        {product.featured && (
          <div className="absolute top-4 right-4">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        )}
      </div>
     
      {/* Informations produit */}
      <div className="space-y-2">
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
          <div className="flex gap-2 py-2">
            {product.variants.slice(0, 5).map((variant, index: number) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border-2 border-gray-200 cursor-pointer hover:border-black transition-colors duration-200"
                style={{ backgroundColor: variant.colorHex || '#ccc' }}
                title={variant.color || 'Color variant'}
              />
            ))}
            {product.variants.length > 5 && (
              <span className="text-xs text-gray-500 self-center">
                +{product.variants.length - 5}
              </span>
            )}
          </div>
        )}
       
        {/* Prix */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-black">
            ${product.price}
          </span>
          {product.comparePrice && (
            <span className="text-gray-500 line-through text-sm">
              ${product.comparePrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
 
  // Composant FilterSection
  const FilterSection: React.FC<{
    title: string;
    children: React.ReactNode;
  }> = ({ title, children }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <h3 className="font-medium text-black mb-3">{title}</h3>
      {children}
    </div>
  );
 
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="py-4 px-4 max-w-7xl mx-auto">
          <div className="text-sm text-gray-600">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                {index > 0 && <span className="mx-2">/</span>}
                <span className={index === breadcrumbs.length - 1 ? 'text-black' : 'hover:text-black cursor-pointer'}>
                  {crumb.name}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
       
        {/* En-tête de catégorie principale - Espacement réduit */}
        <div className="py-4 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-serif text-black mb-4">
                {category.name.toUpperCase()}
              </h1>
              {category.description && (
                <p className="text-gray-700 text-lg leading-relaxed">
                  {category.description}
                </p>
              )}
              <p className="text-gray-700 leading-relaxed mt-4">
                Showing {filteredProducts.length} products across {productsByCategory.length} categories
              </p>
            </div>
          </div>
        </div>
       
        {/* Section 1: Sous-catégories - Espacement réduit */}
        {hasSubcategories && (
          <section className="px-4">
            <div className="max-w-7xl mx-auto">
              {/* Grille des sous-catégories */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
                {subcategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="group cursor-pointer"
                    onClick={() => handleSubcategoryClick(subcategory)}
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-3 relative">
                      {subcategory.image ? (
                        <img
                          src={subcategory.image}
                          alt={subcategory.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">{subcategory.name}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-black text-center tracking-wide group-hover:text-gray-600 transition-colors duration-200">
                      {subcategory.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
       
        {/* NOUVELLE SECTION: Filtres et Tri */}
        {products.length > 0 && (
          <section className="px-4 py-6 border-t border-gray-200">
            <div className="max-w-7xl mx-auto">
              {/* Barre de contrôle des filtres */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-black transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    {hasActiveFilters && (
                      <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                        {filters.brands.length + filters.colors.length + filters.sizes.length + filters.tags.length}
                      </span>
                    )}
                  </button>
                 
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-600 hover:text-black transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
               
                {/* Tri */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-black"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>
             
              {/* Panneau de filtres */}
              {showFilters && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {/* Filtres par marque */}
                    {filterOptions.brands.length > 0 && (
                      <FilterSection title="Brands">
                        <div className="space-y-2">
                          {filterOptions.brands.map(brand => (
                            <label key={brand} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={filters.brands.includes(brand)}
                                onChange={() => toggleFilter('brands', brand)}
                                className="mr-2 rounded"
                              />
                              <span className="text-sm">{brand}</span>
                            </label>
                          ))}
                        </div>
                      </FilterSection>
                    )}
                   
                    {/* Filtres par couleur */}
                    {filterOptions.colors.length > 0 && (
                      <FilterSection title="Colors">
                        <div className="space-y-2">
                          {filterOptions.colors.slice(0, 8).map(color => (
                            <label key={color} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={filters.colors.includes(color)}
                                onChange={() => toggleFilter('colors', color)}
                                className="mr-2 rounded"
                              />
                              <span className="text-sm capitalize">{color}</span>
                            </label>
                          ))}
                        </div>
                      </FilterSection>
                    )}
                   
                    {/* Filtres par taille */}
                    {filterOptions.sizes.length > 0 && (
                      <FilterSection title="Sizes">
                        <div className="grid grid-cols-3 gap-2">
                          {filterOptions.sizes.slice(0, 9).map(size => (
                            <button
                              key={size}
                              onClick={() => toggleFilter('sizes', size)}
                              className={`px-3 py-2 text-sm border rounded ${
                                filters.sizes.includes(size)
                                  ? 'bg-black text-white border-black'
                                  : 'border-gray-300 hover:border-black'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </FilterSection>
                    )}
                   
                    {/* Filtres par tags */}
                    {filterOptions.tags.length > 0 && (
                      <FilterSection title="Tags">
                        <div className="space-y-2">
                          {filterOptions.tags.slice(0, 6).map(tag => (
                            <label key={tag} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={filters.tags.includes(tag)}
                                onChange={() => toggleFilter('tags', tag)}
                                className="mr-2 rounded"
                              />
                              <span className="text-sm">{tag}</span>
                            </label>
                          ))}
                        </div>
                      </FilterSection>
                    )}
                   
                    {/* Filtres par prix */}
                    <FilterSection title="Price Range">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>${filters.priceRange.min}</span>
                          <span>${filters.priceRange.max}</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.priceRange.min}
                            onChange={(e) => updatePriceRange(Number(e.target.value), filters.priceRange.max)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.priceRange.max}
                            onChange={(e) => updatePriceRange(filters.priceRange.min, Number(e.target.value))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    </FilterSection>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
       
        {/* Section 2: Produits groupés par catégorie (avec filtrage) */}
        {productsByCategory.length > 0 ? (
          <div className="py-8 px-4">
            <div className="max-w-7xl mx-auto space-y-16">
              {productsByCategory.map(({ category: subCategory, products: categoryProducts }) => (
                <section key={subCategory.id} className="space-y-8">
                  {/* Titre de la sous-catégorie */}
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-serif text-black mb-2">
                          {subCategory.name.toUpperCase()}
                        </h2>
                        {subCategory.description && (
                          <p className="text-gray-700 leading-relaxed mb-2">
                            {subCategory.description}
                          </p>
                        )}
                        <p className="text-gray-700 leading-relaxed">
                          {categoryProducts.length} product{categoryProducts.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Grille de produits pour cette catégorie */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              {hasActiveFilters ? 'No products match your filters' : 'No products found in this category'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};
 
export default CollectionPage;