import { Category } from "@/app/page";
import { ArrowRight } from "lucide-react";

const Categories = () => {
  const categories: Category[] = [
    { name: 'Vêtements', count: '2,400 produits', color: 'from-pink-100 to-rose-100', image: null },
    { name: 'Maison', count: '890 produits', color: 'from-blue-100 to-indigo-100', image: null },
    { name: 'Tech', count: '340 produits', color: 'from-gray-100 to-slate-100', image: null },
    { name: 'Parfums', count: '156 produits', color: 'from-purple-100 to-violet-100', image: null }
  ];

  const handleCategoryClick = (category: Category) => {
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

export default Categories;