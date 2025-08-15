import { Heart } from "lucide-react";
import { useState, MouseEvent } from "react";

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
  onClick?: (product: Product) => void;
  className?: string;
  imageClassName?: string;
  contentClassName?: string;
}

const ProductCard = ({
  product,
  featured = false,
  onClick,
  className = "",
  imageClassName = "",
  contentClassName = "",
}: ProductCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleProductClick = () => {
    onClick?.(product);
  };

  const handleFavoriteClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  // Image par défaut SVG en base64
  const defaultImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwTDE5MCAxNDBIMTcwVjE4MEgxMzBWMTQwSDExMEwxNTAgMTAwWiIgZmlsbD0iIzk0OTRBNCIvPgo8L3N2Zz4K";

  // Utiliser la première image du produit ou l'image par défaut
  const productImage = product.images?.[0] && product.images[0].trim() !== ""
    ? product.images[0]
    : defaultImage;

  return (
    <div
      className={`group cursor-pointer ${
        featured ? "col-span-2 row-span-2" : ""
      } ${className}`}
      onClick={handleProductClick}
    >
      <div
        className={`aspect-square overflow-hidden bg-gray-100 relative rounded-sm ${imageClassName}`}
      >
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback SVG en cas d'erreur
            e.currentTarget.src = defaultImage;
          }}
        />
        
        {/* Bouton favori */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 group/heart"
          aria-label={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-200 ${
              isFavorited
                ? "fill-red-500 text-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>
        
        {/* Badge nouveau */}
        {product.isNewIn && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-black text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded">
            NOUVEAU
          </div>
        )}
      </div>
      
      {/* Informations produit */}
      <div className={`pt-2 sm:pt-3 space-y-1 ${contentClassName}`}>
        {/* Stock faible */}
        {typeof product.stock === "number" && product.stock > 0 && product.stock <= 5 && (
          <p className="text-[10px] sm:text-xs text-red-600 font-medium">
            Plus que {product.stock} en stock
          </p>
        )}
        
        {/* Rupture de stock */}
     
      </div>
    </div>
  );
};

export default ProductCard;