"use client"
import React, { use, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Star, Filter, X, ChevronRight } from 'lucide-react';
import Header from '@/components/common/Header';
import BottomSheet from '@/components/common/BottomSheet';
import { useCategory, useCategoryNavigation } from '@/hooks/category/useCategory';
import { Category } from '@/types/category';
import { Product, ProductVariant } from '@/types/product';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

interface FilterState {
  brands: string[];
  priceRange: { min: number; max: number };
  colors: string[];
  sizes: string[];
  tags: string[];
  sortBy: string;
}

const CollectionPage: React.FC<CollectionPageProps> = ({ params }) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  const { category, isLoading, error } = useCategory(slug);
  const { breadcrumbs, subcategories, hasSubcategories } = useCategoryNavigation();
  
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    priceRange: { min: 0, max: 1000 },
    colors: [],
    sizes: [],
    tags: [],
    sortBy: 'featured'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  
  const products = useMemo(() => category?.allProducts || [], [category?.allProducts]);
  
  const handleSubcategoryClick = (subcategory: Category) => {
    router.push(`/collections/${subcategory.slug}`);
  };
  
  const filterOptions = useMemo(() => {
    if (!products.length) return {
      brands: [],
      colors: [],
      sizes: [],
      tags: [],
      priceRange: { min: 0, max: 1000 }
    };
   
    const brands = [...new Set(products.map(p => p.brand?.name).filter((name): name is string => Boolean(name)))];
      
    const tags = [...new Set(products.flatMap(p => p.tags || []))];
    const prices = products.map(p => p.price);
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
   
    return { brands, tags, priceRange };
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
   
    // Filtre par marques
    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => p.brand?.name && filters.brands.includes(p.brand.name));
    }
   
    // Filtre par prix
    filtered = filtered.filter(p => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max);
   
    // Filtre par couleurs
    if (filters.colors.length > 0) {
      filtered = filtered.filter(p =>
        (p.variants || []).some((v: ProductVariant) => v.color && filters.colors.includes(v.color))
      );
    }
   
    // Filtre par tailles
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(p =>
        (p.variants || []).some((v: ProductVariant) => v.size && filters.sizes.includes(v.size))
      );
    }
   
    // Filtre par tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter(p =>
        (p.tags || []).some((tag: string) => filters.tags.includes(tag))
      );
    }
     
    // Tri
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
  
  const productsByCategory = useMemo(() => {
    if (!category) return [];
   
    const result: { category: Category; products: Product[] }[] = [];
   
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
  
  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters(prev => {
      const filterArray = prev[type as keyof Pick<FilterState, 'brands' | 'colors' | 'sizes' | 'tags'>] as string[];
      
      return {
        ...prev,
        [type]: filterArray.includes(value)
          ? filterArray.filter(v => v !== value)
          : [...filterArray, value]
      };
    });
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

  const activeFiltersCount = filters.brands.length + filters.colors.length + 
    filters.sizes.length + filters.tags.length;

  const handleFilterClick = () => {
    if (window.innerWidth < 768) {
      setIsBottomSheetOpen(true);
    } else {
      setShowFilters(!showFilters);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header forceScrolledStyle={true} />
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-red-900" />
            <span className="text-neutral-700 font-medium">Chargement...</span>
          </div>
        </div>
      </>
    );
  }

  if (error || !category) {
    return (
      <>
        <Header forceScrolledStyle={true} />
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-900 mx-auto mb-4" />
            <h2 className="text-xl font-serif text-neutral-900 mb-2">
              {error || 'Collection introuvable'}
            </h2>
            <p className="text-neutral-600">
              Nous n'avons pas pu charger cette collection.
            </p>
          </div>
        </div>
      </>
    );
  }

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="group cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-200 mb-4 rounded-sm">
        <div className="absolute -inset-1 border-2 border-red-900/0 group-hover:border-red-900/20 transition-all duration-300 rounded-sm transform group-hover:rotate-1"></div>
        
        <img
          src={product.images?.[0] || '/api/placeholder/310/400'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
       
        {product.tags?.slice(0, 1).map((tag: string) => (
          <div
            key={tag}
            className="absolute bottom-4 left-4 bg-gradient-to-r from-red-900 to-red-800 text-white text-xs px-4 py-1.5 font-medium rounded-full shadow-lg"
          >
            {tag}
          </div>
        ))}
       
        {product.isNewIn && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-neutral-900 text-xs px-3 py-1 font-bold tracking-wide rounded-full border border-stone-200/50">
            NOUVEAU
          </div>
        )}
       
        {product.featured && (
          <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-red-900 to-red-700 rounded-full flex items-center justify-center shadow-lg">
            <Star className="w-4 h-4 fill-white text-white" />
          </div>
        )}
      </div>
     
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900 text-sm tracking-wide">
            {product.brand?.name || 'Marque'}
          </h3>
        </div>
       
        <h4 className="font-serif text-neutral-900 text-base">
          {product.name}
        </h4>
       
        {product.shortDescription && (
          <p className="text-neutral-600 text-sm leading-relaxed line-clamp-2">
            {product.shortDescription}
          </p>
        )}
       
        {product.variants?.length > 0 && (
          <div className="flex gap-2 py-2">
            {product.variants.slice(0, 5).map((variant: ProductVariant, index: number) => (
              <div
                key={variant.id || index}
                className="w-7 h-7 rounded-full border-2 border-stone-300 cursor-pointer hover:border-red-900 hover:scale-110 transition-all duration-200 shadow-sm"
                style={{ backgroundColor: variant.colorHex || '#ccc' }}
                title={variant.color || 'Variante'}
              />
            ))}
            {product.variants.length > 5 && (
              <span className="text-xs text-neutral-500 self-center font-medium">
                +{product.variants.length - 5}
              </span>
            )}
          </div>
        )}
       
        <div className="flex items-center gap-3 pt-1">
          <span className="font-bold text-neutral-900 text-lg">
            ${product.price}
          </span>
          {product.comparePrice && (
            <span className="text-neutral-500 line-through text-sm">
              ${product.comparePrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const FilterSection: React.FC<{
    title: string;
    children: React.ReactNode;
  }> = ({ title, children }) => (
    <div className="pb-6 mb-6 border-b border-stone-200/60 last:border-b-0 last:pb-0 last:mb-0">
      <h3 className="font-serif text-neutral-900 mb-4 text-lg">{title}</h3>
      {children}
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between py-4 px-6 border-b border-stone-200/60">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-red-900" />
          <h2 className="text-xl font-serif text-neutral-900">Filtres</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-gradient-to-r from-red-900 to-red-800 text-white text-xs px-2.5 py-1 rounded-full font-medium">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-neutral-600 hover:text-red-900 transition-colors font-medium"
          >
            Effacer tout
          </button>
        )}
      </div>

      <div className="px-6 space-y-6">
        <FilterSection title="Trier par">
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-900 focus:ring-2 focus:ring-red-900/20 bg-white"
          >
            <option value="featured">Mis en avant</option>
            <option value="newest">Nouveautés</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="name">Nom A-Z</option>
          </select>
        </FilterSection>

        {filterOptions.brands.length > 0 && (
          <FilterSection title="Marques">
            <div className="space-y-3">
              {filterOptions.brands.map(brand => (
                <label key={brand} className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggleFilter('brands', brand)}
                    className="w-4 h-4 text-red-900 border-stone-300 rounded focus:ring-red-900 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-neutral-700 group-hover:text-red-900 transition-colors">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}
        
        {/* {filterOptions.colors.length > 0 && (
          <FilterSection title="Couleurs">
            <div className="space-y-3">
              {filterOptions.colors.slice(0, 8).map(color => (
                <label key={color} className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(color)}
                    onChange={() => toggleFilter('colors', color)}
                    className="w-4 h-4 text-red-900 border-stone-300 rounded focus:ring-red-900 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-neutral-700 group-hover:text-red-900 transition-colors capitalize">
                    {color}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}
        
        {filterOptions.sizes.length > 0 && (
          <FilterSection title="Tailles">
            <div className="grid grid-cols-3 gap-3">
              {filterOptions.sizes.slice(0, 9).map(size => (
                <button
                  key={size}
                  onClick={() => toggleFilter('sizes', size)}
                  className={`px-4 py-3 text-sm font-medium border rounded-lg transition-all duration-200 ${
                    filters.sizes.includes(size)
                      ? 'bg-gradient-to-r from-red-900 to-red-800 text-white border-red-900 shadow-md'
                      : 'border-stone-300 text-neutral-700 hover:border-red-900 hover:text-red-900'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </FilterSection>
        )} */}
        
        {filterOptions.tags.length > 0 && (
          <FilterSection title="Tags">
            <div className="space-y-3">
              {filterOptions.tags.slice(0, 6).map(tag => (
                <label key={tag} className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.tags.includes(tag)}
                    onChange={() => toggleFilter('tags', tag)}
                    className="w-4 h-4 text-red-900 border-stone-300 rounded focus:ring-red-900 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-neutral-700 group-hover:text-red-900 transition-colors">
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}
        
        <FilterSection title="Fourchette de prix">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-neutral-600">
              <span className="font-medium">${filters.priceRange.min}</span>
              <span className="font-medium">${filters.priceRange.max}</span>
            </div>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange.min}
                onChange={(e) => updatePriceRange(Number(e.target.value), filters.priceRange.max)}
                className="flex-1 px-4 py-3 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-red-900 focus:ring-2 focus:ring-red-900/20"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange.max}
                onChange={(e) => updatePriceRange(filters.priceRange.min, Number(e.target.value))}
                className="flex-1 px-4 py-3 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-red-900 focus:ring-2 focus:ring-red-900/20"
              />
            </div>
          </div>
        </FilterSection>
      </div>

      <div className="md:hidden px-6 py-4 border-t border-stone-200/60 bg-stone-50">
        <button
          onClick={() => setIsBottomSheetOpen(false)}
          className="w-full bg-gradient-to-r from-red-900 to-red-800 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
        >
          Afficher {filteredProducts.length} produits
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Header forceScrolledStyle={true} />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-1/3 h-96 bg-stone-200/40 transform rotate-6 opacity-40"></div>
        <div className="absolute top-1/3 right-10 w-1/4 h-80 bg-gradient-to-br from-red-900 to-red-800 transform -rotate-12 opacity-5"></div>
        <div className="absolute bottom-20 left-10 w-1/4 h-72 bg-neutral-900 transform rotate-3 opacity-5"></div>
      </div>

      <div className="relative min-h-screen bg-stone-50">
        <div className="py-6 px-4 max-w-7xl mx-auto border-b border-stone-200/60">
          <div className="flex items-center text-sm text-neutral-600">
            {breadcrumbs.map((crumb: { name: string; href: string }, index: number) => (
              <React.Fragment key={crumb.href}>
                {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-stone-400" />}
                <span className={`${index === breadcrumbs.length - 1 ? 'text-red-900 font-medium' : 'hover:text-red-900 cursor-pointer'} transition-colors`}>
                  {crumb.name}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
       
        <div className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-stone-200/50 mb-6">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">NEW</span>
                </div>
                <span className="text-xs text-neutral-700 font-medium tracking-wide">Collection {new Date().getFullYear()}</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-serif text-neutral-900 mb-4 leading-tight">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-neutral-600 text-lg leading-relaxed max-w-3xl">
                  {category.description}
                </p>
              )}
              
              <div className="flex gap-8 pt-6 mt-6 border-t border-stone-300/60">
                <div>
                  <div className="text-3xl font-bold text-neutral-900 mb-0.5">{filteredProducts.length}</div>
                  <div className="text-xs text-neutral-500 tracking-wide">Produits disponibles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-neutral-900 mb-0.5">{productsByCategory.length}</div>
                  <div className="text-xs text-neutral-500 tracking-wide">Catégories</div>
                </div>
              </div>
            </div>
          </div>
        </div>
       
        {hasSubcategories && (
          <section className="px-4 pb-12">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-serif text-neutral-900 mb-8">Explorer par catégorie</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {subcategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="group cursor-pointer"
                    onClick={() => handleSubcategoryClick(subcategory)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-stone-200 mb-3 rounded-sm">
                      <div className="absolute -inset-1 border-2 border-red-900/0 group-hover:border-red-900/20 transition-all duration-300 rounded-sm"></div>
                      {subcategory.image ? (
                        <img
                          src={subcategory.image}
                          alt={subcategory.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                          <span className="text-neutral-400 text-sm font-serif">{subcategory.name}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-900 text-center tracking-wide group-hover:text-red-900 transition-colors duration-200">
                      {subcategory.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
       
        {products.length > 0 && (
          <section className="px-4 py-6 border-y border-stone-200/60 bg-white/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <button
                    onClick={handleFilterClick}
                    className="flex items-center gap-2 px-5 py-2.5 border-2 border-stone-300 rounded-lg hover:border-red-900 hover:text-red-900 transition-all duration-200 bg-white shadow-sm"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="font-medium">Filtres</span>
                    {activeFiltersCount > 0 && (
                      <span className="bg-gradient-to-r from-red-900 to-red-800 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                 
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-neutral-600 hover:text-red-900 transition-colors font-medium"
                    >
                      Réinitialiser
                    </button>
                  )}
                </div>
               
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-sm text-neutral-600 font-medium">Trier par:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                    className="border-2 border-stone-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-900 bg-white shadow-sm"
                  >
                    <option value="featured">Mis en avant</option>
                    <option value="newest">Nouveautés</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="name">Nom A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
        )}
       
        {productsByCategory.length > 0 ? (
          <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto space-y-20">
              {productsByCategory.map(({ category: subCategory, products: categoryProducts }) => (
                <section key={subCategory.id} className="space-y-8">
                  <div className="border-b border-stone-200/60 pb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-serif text-neutral-900 mb-3">
                          {subCategory.name}
                        </h2>
                        {subCategory.description && (
                          <p className="text-neutral-600 leading-relaxed mb-2">
                            {subCategory.description}
                          </p>
                        )}
                        <p className="text-neutral-500 text-sm">
                          {categoryProducts.length} produit{categoryProducts.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-900/10 to-red-800/10 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-900/60" />
              </div>
              <p className="text-neutral-600 text-lg mb-2">
                {hasActiveFilters ? 'Aucun produit ne correspond à vos filtres' : 'Aucun produit dans cette collection'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-6 px-8 py-3 bg-gradient-to-r from-red-900 to-red-800 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>
        )}

        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          snapLevels={[0, 0.3, 0.6, 0.9]}
          initialLevel={0.6}
          className="md:hidden"
        >
          <FilterContent />
        </BottomSheet>

        {showFilters && (
          <div className="hidden md:block fixed left-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 overflow-y-auto border-r border-stone-200">
            <div className="relative">
              <button
                onClick={() => setShowFilters(false)}
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
              <FilterContent />
            </div>
          </div>
        )}

        {showFilters && (
          <div 
            className="hidden md:block fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-40"
            onClick={() => setShowFilters(false)}
          />
        )}
      </div>
    </>
  );
};

export default CollectionPage;