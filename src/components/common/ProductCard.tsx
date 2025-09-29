"use client";
import React from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import {
  normalizeProductForCard,
  ProductCardItem,
} from "@/types/product";
import { useFavorites } from "@/hooks/product/useFavorites";

interface ProductCardProps {
  product: ProductCardItem;
  onClick?: (product: ProductCardItem) => void;
  className?: string;
  showBrand?: boolean;
  showPrice?: boolean;
  imageClassName?: string;
  contentClassName?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  className = "",
  showBrand = true,
  showPrice = true,
  imageClassName = "",
  contentClassName = "",
}) => {
  const normalizedProduct = normalizeProductForCard(product);
  
  // Utilisation du hook useFavorites pour la gestion des favoris
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Vérifier si le produit est dans les favoris
  const isProductFavorite = isFavorite(product.id);
 
  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };
 
  // ✅ CORRECTION: Rendre la fonction async et await la Promise
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Attendre le résultat de toggleFavorite
    const result = await toggleFavorite(product);
    
    // Optionnel : afficher un feedback à l'utilisateur
    if (result.success) {
      console.log(result.message); // "Ajouté aux favoris" ou "Retiré des favoris"
    } else if (result.error) {
      console.error('Erreur favoris:', result.error);
    }
  };
 
  // Image par défaut SVG en base64
  const defaultImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwTDE5MCAxNDBIMTcwVjE4MEgxMzBWMTQwSDExMEwxNTAgMTAwWiIgZmlsbD0iIzk0OTRBNCIvPgo8L3N2Zz4K";
 
  // Utiliser le produit normalisé pour l'affichage
  const productImage = normalizedProduct.images?.[0] && normalizedProduct.images[0].trim() !== ""
    ? normalizedProduct.images[0]
    : defaultImage;
 
  return (
    <div
      className={`group cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div
        className={`aspect-square overflow-hidden bg-gray-100 relative rounded-sm ${imageClassName}`}
      >
        <Image
          src={productImage}
          alt={normalizedProduct.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback SVG en cas d'erreur
            e.currentTarget.src = defaultImage;
          }}
        />
        {/* Bouton favori avec logique intégrée */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 group/heart"
          aria-label={isProductFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-200 ${
              isProductFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>
        {/* Badge nouveau */}
        {normalizedProduct.isNewIn && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-black text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded">
            NOUVEAU
          </div>
        )}
      </div>
      {/* Informations produit */}
      <div className={`pt-2 sm:pt-3 space-y-1 ${contentClassName}`}>
        {showBrand && normalizedProduct.brand && (
          <h3 className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wide">
            {normalizedProduct.brand.name}
          </h3>
        )}
        <p className="text-xs sm:text-sm text-black font-medium line-clamp-2 leading-tight">
          {normalizedProduct.name}
        </p>
        {showPrice && (
          <div className="flex items-center space-x-2">
            <p className="text-xs sm:text-sm font-semibold text-black">
              ${normalizedProduct.price.toFixed(2)}
            </p>
            {normalizedProduct.comparePrice &&
              normalizedProduct.comparePrice > normalizedProduct.price && (
                <p className="text-xs sm:text-sm text-gray-500 line-through">
                  ${normalizedProduct.comparePrice.toFixed(2)}
                </p>
              )}
          </div>
        )}
        {/* Stock faible */}
        {typeof normalizedProduct.stock === "number" && normalizedProduct.stock > 0 && normalizedProduct.stock <= 5 && (
          <p className="text-[10px] sm:text-xs text-red-600 font-medium">
            Plus que {normalizedProduct.stock} en stock
          </p>
        )}
        {/* Rupture de stock */}
        {normalizedProduct.stock === 0 && (
          <p className="text-[10px] sm:text-xs text-red-600 font-medium">
            Rupture de stock
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;