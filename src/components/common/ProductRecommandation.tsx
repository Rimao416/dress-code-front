import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  categoryId: string;
  brandId: string;
  brand?: { name: string };
  sku: string;
  stock: number;
  available: boolean;
  featured: boolean;
  isNewIn: boolean;
  tags: string[];
  slug: string;
  averageRating: number;
  reviewCount: number;
}

interface ProductRecommendationsProps {
  title: string;
  products: Product[];
  onProductClick: (product: Product) => void;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ 
  title, 
  products, 
  onProductClick 
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [itemsPerView, setItemsPerView] = useState<number>(4);

  // Fonction pour corriger le chemin des images
  const formatImagePath = (imagePath: string): string => {
    if (imagePath.startsWith('/') || imagePath.startsWith('http') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    return `/${imagePath}`;
  };

  // Formater les produits avec des chemins d'images corrects
  const formattedProducts: Product[] = products.map(product => ({
    ...product,
    images: product.images.map(image => formatImagePath(image))
  }));

  console.log('Produits originaux:', products);
  console.log('Produits formatés:', formattedProducts);

  useEffect(() => {
    const updateItemsPerView = (): void => {
      if (window.innerWidth < 640) setItemsPerView(2);
      else if (window.innerWidth < 768) setItemsPerView(3);
      else if (window.innerWidth < 1024) setItemsPerView(4);
      else setItemsPerView(5);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxSlide: number = Math.max(0, formattedProducts.length - itemsPerView);
  const canSlidePrev: boolean = currentSlide > 0;
  const canSlideNext: boolean = currentSlide < maxSlide;

  const slidePrev = (): void => {
    if (canSlidePrev) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const slideNext = (): void => {
    if (canSlideNext) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  if (formattedProducts.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex-1 text-center">{title}</h2>
        
        <div className="hidden md:flex items-center space-x-1">
          <button
            onClick={slidePrev}
            disabled={!canSlidePrev}
            className={`p-2 rounded-full border ${
              canSlidePrev
                ? 'border-gray-300 hover:border-black hover:bg-black hover:text-white'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            } transition-all duration-200`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={slideNext}
            disabled={!canSlideNext}
            className={`p-2 rounded-full border ${
              canSlideNext
                ? 'border-gray-300 hover:border-black hover:bg-black hover:text-white'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            } transition-all duration-200`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out gap-4"
          style={{ 
            transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)`,
            width: `${(formattedProducts.length / itemsPerView) * 100}%`
          }}
        >
          {formattedProducts.map((product: Product) => (
            <div 
              key={product.id} 
              className="flex-shrink-0"
              style={{ width: `${100 / formattedProducts.length}%` }}
            >
              <ProductCard
                product={product}
                onClick={onProductClick}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="md:hidden flex justify-between items-center px-4">
        <button
          onClick={slidePrev}
          disabled={!canSlidePrev}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
            canSlidePrev
              ? 'border-gray-300 hover:border-black'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          } transition-all duration-200`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="text-sm">Précédent</span>
        </button>
        <span className="text-sm text-gray-600">
          {currentSlide + 1} / {maxSlide + 1}
        </span>
        <button
          onClick={slideNext}
          disabled={!canSlideNext}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
            canSlideNext
              ? 'border-gray-300 hover:border-black'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          } transition-all duration-200`}
        >
          <span className="text-sm">Suivant</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductRecommendations;