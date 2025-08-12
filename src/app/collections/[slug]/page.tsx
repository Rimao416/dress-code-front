"use client"
import React, { use, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import Header from '@/components/common/Header';
import { useCategory, useCategoryNavigation } from '@/hooks/category/useCategory';
import { Category } from '@/types/category';
import { Product } from '@/types/product';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

const CollectionPage: React.FC<CollectionPageProps> = ({ params }) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  const { category, isLoading, error } = useCategory(slug);
  const { breadcrumbs, subcategories, hasSubcategories } = useCategoryNavigation();
  
  const products = useMemo(() => category?.allProducts || [], [category?.allProducts]);
  
  const handleSubcategoryClick = (subcategory: Category) => {
    router.push(`/collections/${subcategory.slug}`);
  };
  
  const productsByCategory = useMemo(() => {
    if (!category) return [];
   
    const result: { category: Category; products: Product[] }[] = [];
   
    if (category.products && category.products.length > 0) {
      const directProducts = products.filter(p =>
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
          const childProducts = products.filter(p =>
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
  }, [category, products]);

  if (isLoading) {
    return (
      <>
        <Header forceScrolledStyle={true} />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-gray-600">Chargement de la collection</span>
          </div>
        </div>
      </>
    );
  }

  if (error || !category) {
    return (
      <>
        <Header forceScrolledStyle={true} />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error || 'Collection introuvable'}
            </h2>
            <p className="text-gray-600">
              Nous n'avons pas pu charger cette catégorie. Veuillez réessayer plus tard.
            </p>
          </div>
        </div>
      </>
    );
  }

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div key={product.id} className="group cursor-pointer">
      <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-4 relative">
        <img
          src={product.images?.[0] || '/api/placeholder/310/400'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
     
      <div className="space-y-2">
        <h4 className="font-medium text-black text-sm">
          {product.name}
        </h4>
       
        {product.shortDescription && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {product.shortDescription}
          </p>
        )}
       
        <div className="flex items-center gap-2">
          <span className="font-semibold text-black">
            ${product.price}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header forceScrolledStyle={true} />
      <div className="min-h-screen bg-white">
        {/* Fil d'Ariane */}
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
       
        {/* En-tête de catégorie principale */}
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
            </div>
          </div>
        </div>
       
        {/* Section sous-catégories */}
        {hasSubcategories && (
          <section className="px-4">
            <div className="max-w-7xl mx-auto">
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
       
        {/* Section produits */}
        {productsByCategory.length > 0 ? (
          <div className="py-8 px-4">
            <div className="max-w-7xl mx-auto space-y-16">
              {productsByCategory.map(({ category: subCategory, products: categoryProducts }) => (
                <section key={subCategory.id} className="space-y-8">
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
                          {categoryProducts.length} produit{categoryProducts.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  
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
              Aucun produit trouvé dans cette catégorie
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CollectionPage;