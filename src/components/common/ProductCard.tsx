import { Check, Heart, Plus } from "lucide-react";
import { useState, MouseEvent } from "react";
import Button from "../ui/button";

// Type pour un produit (déduit de productsData)
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

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  showBrand?: boolean;
  showPrice?: boolean;
  onClick?: (product: Product) => void;
}

const ProductCard = ({
  product,
  featured = false,
  showBrand = true,
  showPrice = true,
  onClick,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  const handleAddToBag = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowAddedFeedback(true);
    setTimeout(() => setShowAddedFeedback(false), 2000);
  };

  const handleProductClick = () => {
    onClick?.(product);
  };

  return (
    <div
      className={`group relative overflow-hidden cursor-pointer ${
        featured ? "col-span-2 row-span-2" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      <div
        className={`relative overflow-hidden bg-gray-50 ${
          featured ? "h-96" : "h-80"
        }`}
      >
        {/* Badge Nouveau */}
        {product.isNewIn && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded">
              Nouveau
            </span>
          </div>
        )}
        {/* Bouton Favoris */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorited
                ? "fill-red-500 text-red-500"
                : "text-gray-600"
            }`}
          />
        </button>
        {/* Image du produit */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div
            className={`w-full h-full bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 transition-transform duration-500 ${
              isHovered ? "scale-105" : ""
            }`}
          >
            <span className="text-6xl font-light">
              {product.name.charAt(0)}
            </span>
          </div>
        </div>
        {/* Overlay hover */}
        <div
          className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        ></div>
        {/* Bouton d'action */}
        <div
          className={`absolute bottom-3 left-3 right-3 transition-all duration-300 transform ${
            isHovered
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0"
          }`}
        >
          <Button
            variant="white"
            size="sm"
            className="w-full shadow-lg"
            onClick={handleAddToBag}
          >
            {showAddedFeedback ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-600" />
                Ajouté
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter au panier
              </>
            )}
          </Button>
        </div>
      </div>
      {/* Informations produit */}
      <div className="p-4 space-y-2">
        {showBrand && product.brand && (
          <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {product.brand.name}
          </div>
        )}

        <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-tight">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 line-clamp-1">
          {product.shortDescription}
        </p>
        <div className="flex items-center justify-between">
          {showPrice && (
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900 text-sm">
                €{product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-xs text-gray-400 line-through">
                  €{product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
