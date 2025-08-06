"use client";
import React from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import {
  normalizeProductForCard,
  ProductCardItem,
} from "@/types/product";

interface ProductCardProps {
  product: ProductCardItem;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
  onClick?: (product: ProductCardItem) => void;
  className?: string;
  showBrand?: boolean;
  showPrice?: boolean;
  imageClassName?: string;
  contentClassName?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onClick,
  className = "",
  showBrand = true,
  showPrice = true,
  imageClassName = "",
  contentClassName = "",
}) => {
  const normalizedProduct = normalizeProductForCard(product);
  
  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(product.id);
  };
  
  // Image par défaut SVG en base64
  const defaultImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwTDE5MCAxNDBIMTcwVjE4MEgxMzBWMTQwSDExMEwxNTAgMTAwWiIgZmlsbD0iIzk0OTRBNCIvPgo8L3N2Zz4K";
  
  // Correction : utiliser l'image par défaut si pas d'image disponible
  const productImage = product.images?.[0] && product.images[0].trim() !== "" 
    ? product.images[0] 
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
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback SVG en cas d'erreur
            e.currentTarget.src = defaultImage;
          }}
        />
        {/* Bouton favori */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 group/heart"
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-200 ${
              isFavorite
                ? "fill-black text-black"
                : "text-gray-600 hover:text-black"
            }`}
          />
        </button>
        {/* Badge nouveau */}
        {product.isNewIn && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-black text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded">
            NOUVEAU
          </div>
        )}
        {/* Badge vedette */}
        {/* {product.featured && (
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-red-600 text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded">
            VEDETTE
          </div>
        )} */}
      </div>
      {/* Informations produit */}
      <div className={`pt-2 sm:pt-3 space-y-1 ${contentClassName}`}>
        {showBrand && product.brand && (
          <h3 className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wide">
            {product.brand.name}
          </h3>
        )}
        <p className="text-xs sm:text-sm text-black font-medium line-clamp-2 leading-tight">
          {product.name}
        </p>
        {showPrice && (
          <div className="flex items-center space-x-2">
            <p className="text-xs sm:text-sm font-semibold text-black">
              ${product.price.toFixed(2)}
            </p>
            {product.comparePrice &&
              product.comparePrice > product.price && (
                <p className="text-xs sm:text-sm text-gray-500 line-through">
                  ${product.comparePrice.toFixed(2)}
                </p>
              )}
          </div>
        )}
        {/* Stock faible */}
        {typeof product.stock === "number" && product.stock > 0 && product.stock <= 5 && (
          <p className="text-[10px] sm:text-xs text-red-600 font-medium">
            Plus que {product.stock} en stock
          </p>
        )}
        {/* Rupture de stock */}
        {product.stock === 0 && (
          <p className="text-[10px] sm:text-xs text-red-600 font-medium">
            Rupture de stock
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;