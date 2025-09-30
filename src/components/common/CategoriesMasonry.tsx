"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Package } from "lucide-react";
import { useCategories } from "@/hooks/category/useCategory";

const CategoriesMasonry: React.FC = () => {
  const router = useRouter();
  const { mainCategories, isLoading, error } = useCategories();

  const handleCategoryClick = (slug: string) => {
    router.push(`/collections/${slug}`);
  };

  if (isLoading) {
    return (
      <section className="bg-gradient-to-b from-white to-stone-50 py-12">
        <div className="text-center text-neutral-600">Chargement des catégories...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-b from-white to-stone-50 py-12">
        <div className="text-center text-red-600">
          Erreur lors du chargement des catégories : {error}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-white to-stone-50">
      <div className="w-full">
        {/* En-tête de section */}
        <div className="text-center max-w-2xl mx-auto pt-12 lg:pt-16 mb-8 lg:mb-12 px-6">
          <div className="inline-flex items-center gap-2 bg-red-900/5 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Package className="h-4 w-4 text-red-900" />
            <span className="text-xs text-red-900 font-medium tracking-wide uppercase">
              Explorez nos collections
            </span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif text-neutral-900 mb-4 leading-tight">
            Découvrez nos
            <br />
            <span className="relative inline-block mt-1">
              catégories
              <div className="absolute -bottom-1 left-0 w-full h-2.5 bg-red-900/15 -rotate-1 rounded-sm"></div>
            </span>
          </h2>
          
          <p className="text-neutral-600 leading-relaxed">
            Parcourez notre sélection soigneusement organisée pour trouver exactement ce que vous cherchez
          </p>
        </div>

        {/* Grille catégories parentes */}
        <div className="w-full overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-6">
            {mainCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className="group relative rounded-lg overflow-hidden shadow hover:shadow-xl transition-all cursor-pointer"
              >
                <img
                  src={category.image || "https://via.placeholder.com/600"}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-lg font-serif text-white">{category.name}</h3>
                  {category.productCount !== undefined && (
                    <span className="text-xs text-stone-200">
                      {category.productCount} produits
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesMasonry;