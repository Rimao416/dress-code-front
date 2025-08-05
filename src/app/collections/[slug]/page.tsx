"use client"
import React, { use } from 'react';
import { Loader2, AlertCircle, Star } from 'lucide-react';
import Header from '@/components/common/Header';
import { useCategory, useCategoryNavigation } from '@/hooks/category/useCategory';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

const CollectionPage: React.FC<CollectionPageProps> = ({ params }) => {
  // Utiliser React.use() pour unwrap la Promise dans un composant client
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
 
  // Use custom hooks avec le slug résolu
  const { category, isLoading, error } = useCategory(slug);
  const { breadcrumbs, subcategories, hasSubcategories } = useCategoryNavigation();

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

  const products = category.allProducts || [];

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

        {/* Section 1: Sous-catégories */}
        {hasSubcategories && (
          <section className="py-8 px-4">
            <div className="max-w-7xl mx-auto">
              {/* En-tête de catégorie */}
              <div className="mb-12">
                <h1 className="text-4xl lg:text-5xl font-serif text-black mb-4">
                  {category.name.toUpperCase()}
                </h1>
                {category.description && (
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Grille des sous-catégories */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-16">
                {subcategories.map((subcategory) => (
                  <div key={subcategory.id} className="group cursor-pointer">
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
                    <h3 className="text-sm font-semibold text-black text-center tracking-wide">
                      {subcategory.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 2: Produits de la collection */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Titre de la section produits */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-serif text-black mb-2">
                  {category.name.toUpperCase()}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Showing {products.length} of {category.totalProductsCount} products
                </p>
              </div>
            </div>

            {/* Grille de produits */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="group cursor-pointer">
                    <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-4 relative">
                      <img
                        src={product.images[0] || '/api/placeholder/310/400'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                     
                      {/* Tags */}
                      {product.tags.slice(0, 1).map((tag) => (
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
                      {product.variants.length > 0 && (
                        <div className="flex gap-2 py-2">
                          {product.variants.slice(0, 5).map((variant, index) => (
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
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No products found in this category</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default CollectionPage;