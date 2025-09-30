'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Package } from 'lucide-react';
import { useCategories } from '@/hooks/category/useCategory';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const CollectionPage = () => {
  const { mainCategories, isLoading, error } = useCategories();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Loading state
  if (isLoading || !isClient) {
    return (
      <>
        <Header forceScrolledStyle={true} />
        <div className="min-h-screen bg-stone-50 pt-32">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-12">
              <div className="h-10 w-64 bg-stone-200 rounded animate-pulse mb-4"></div>
              <div className="h-5 w-96 bg-stone-200 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white rounded-sm border border-stone-200 overflow-hidden">
                  <div className="h-64 bg-stone-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 w-3/4 bg-stone-200 rounded animate-pulse mb-3"></div>
                    <div className="h-4 w-full bg-stone-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-2/3 bg-stone-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header forceScrolledStyle={true} />
        <div className="min-h-screen bg-stone-50 pt-32">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="bg-white rounded-sm border border-stone-200 p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-red-900" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Erreur de chargement
              </h2>
              <p className="text-neutral-600 mb-6">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-900 text-white rounded-sm hover:bg-red-800 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Empty state
  if (!mainCategories || mainCategories.length === 0) {
    return (
      <>
        <Header forceScrolledStyle={true} />
        <div className="min-h-screen bg-stone-50 pt-32">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="bg-white rounded-sm border border-stone-200 p-8 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-neutral-400" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Aucune collection disponible
              </h2>
              <p className="text-neutral-600">
                Nos collections seront bientôt disponibles.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Sort categories by sortOrder
  const sortedCategories = [...mainCategories].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <Header forceScrolledStyle={true} />
      <div className="min-h-screen bg-stone-50 pt-32">
        {/* Hero Section */}
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <nav className="flex items-center space-x-2 text-sm text-neutral-600 mb-6">
              <Link href="/" className="hover:text-red-900 transition-colors">
                Accueil
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-neutral-900 font-medium">Collections</span>
            </nav>
            
            <h1 className="text-4xl font-serif text-neutral-900 mb-4">
              Nos Collections
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl">
              Découvrez notre sélection exclusive de collections soigneusement organisées pour vous offrir le meilleur de la mode.
            </p>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCategories.map((category) => (
              <Link
                key={category.id}
                href={`/collections/${category.slug}`}
                className="group bg-white rounded-sm border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-stone-100">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-neutral-300" />
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-semibold text-neutral-900 group-hover:text-red-900 transition-colors">
                      {category.name}
                    </h2>
                    <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-red-900 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>

                  {category.description && (
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <span className="text-sm text-neutral-500">
                      {category.productCount} {category.productCount === 1 ? 'produit' : 'produits'}
                    </span>
                    
                    {category.children && category.children.length > 0 && (
                      <span className="text-xs text-neutral-400 bg-stone-50 px-2 py-1 rounded">
                        {category.children.length} {category.children.length === 1 ? 'sous-catégorie' : 'sous-catégories'}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Summary Section */}
          <div className="mt-16 bg-white rounded-sm border border-stone-200 p-8 text-center">
            <h3 className="text-2xl font-serif text-neutral-900 mb-3">
              Explorez notre univers
            </h3>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              Avec {sortedCategories.length} {sortedCategories.length === 1 ? 'collection principale' : 'collections principales'} et des centaines de produits, 
              trouvez les pièces qui correspondent à votre style unique.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div>
                <div className="text-2xl font-bold text-red-900 mb-1">
                  {sortedCategories.reduce((acc, cat) => acc + cat.productCount, 0)}
                </div>
                <div className="text-neutral-500">Produits</div>
              </div>
              <div className="w-px h-12 bg-stone-200"></div>
              <div>
                <div className="text-2xl font-bold text-red-900 mb-1">
                  {sortedCategories.length}
                </div>
                <div className="text-neutral-500">Collections</div>
              </div>
              <div className="w-px h-12 bg-stone-200"></div>
              <div>
                <div className="text-2xl font-bold text-red-900 mb-1">
                  {sortedCategories.reduce((acc, cat) => acc + (cat.children?.length || 0), 0)}
                </div>
                <div className="text-neutral-500">Sous-catégories</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default CollectionPage;