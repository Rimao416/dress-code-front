import { ChevronDown, ChevronUp, Minus, Plus, Star, Check, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/cart/useCart";
import { useCartSidebarStore } from "@/store/useCartSidebarStore";
import { ProductWithFullData } from "@/types/product";

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

type ExpandedSectionsType = {
  details: boolean;
  fit: boolean;
  shipping: boolean;
};

type SectionKey = keyof ExpandedSectionsType;

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [expandedSections, setExpandedSections] = useState<ExpandedSectionsType>({
    details: false,
    fit: false,
    shipping: false,
  });
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [showMiniCart, setShowMiniCart] = useState<boolean>(false);
  const [addedItem, setAddedItem] = useState<any>(null);

  // DÉCOMMENTEZ CES LIGNES !
  const { addToCart, itemsCount } = useCart();
  const { openSidebar } = useCartSidebarStore();

const handleAddToBag = (): void => {
  // Créer un variant temporaire
  const variant = {
    id: `${product.id}-default`,
    price: product.price,
    stock: product.stock,
    available: product.available
  };

  // ✅ Adapter le produit pour correspondre à ProductWithFullData
  const productWithFullData: ProductWithFullData = {
    ...product,
    // Adapter la brand si elle existe
    brand: product.brand ? {
      id: product.brandId, // Utilise brandId comme fallback
      name: product.brand.name,
      slug: undefined,
      description: undefined
    } : undefined
  };

  // AJOUT RÉEL AU PANIER
  const result = addToCart(
    productWithFullData,
    variant,
    quantity,
    selectedSize,
    selectedColor
  );

  if (result.success) {
    console.log('✅ Produit ajouté au panier avec succès');
   
    setAddedItem({
      product,
      quantity,
      selectedSize,
      selectedColor
    });
   
    setShowMiniCart(true);
    setTimeout(() => setShowMiniCart(false), 5000);
  } else {
    console.error('❌ Erreur lors de l\'ajout:', result.error);
  }
};
  const handleQuantityChange = (newQuantity: number): void => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const toggleSection = (section: SectionKey): void => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-black text-black'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <>
      {/* Mini-panier flottant */}
      {showMiniCart && addedItem && (
        <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50 animate-slide-in">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center text-green-600">
              <Check className="h-5 w-5 mr-2" />
              <span className="font-medium">Ajouté au panier</span>
            </div>
            <button
              onClick={() => setShowMiniCart(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
         
          <div className="flex items-start space-x-3">
            {addedItem.product.images && addedItem.product.images.length > 0 && (
              <img
                src={`/${addedItem.product.images[0]}`}
                alt={addedItem.product.name}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {addedItem.product.name}
              </h4>
              {(addedItem.selectedColor || addedItem.selectedSize) && (
                <p className="text-sm text-gray-500">
                  {addedItem.selectedColor && `${addedItem.selectedColor}`}
                  {addedItem.selectedColor && addedItem.selectedSize && ' - '}
                  {addedItem.selectedSize && `${addedItem.selectedSize}`}
                </p>
              )}
              <p className="text-sm font-medium text-gray-900">
                €{product.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                Qté: {addedItem.quantity}
              </p>
            </div>
          </div>
         
          <button
            className="w-full mt-4 bg-gray-900 text-white py-2 px-4 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
            onClick={() => {
              setShowMiniCart(false);
              openSidebar(); // Ouvre réellement la sidebar du panier
            }}
          >
            <ShoppingBag className="h-4 w-4 inline mr-2" />
            Voir le panier ({itemsCount}) {/* Affiche le vrai count */}
          </button>
        </div>
      )}

      <div className="space-y-6">
        {product.brand && (
          <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {product.brand.name}
          </div>
        )}
       
        <h1 className="text-2xl sm:text-3xl font-bold text-black">
          {product.name}
        </h1>

        {product.reviewCount > 0 && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(product.averageRating)}
            </div>
            <span className="text-sm text-gray-600 underline cursor-pointer hover:text-black">
              {product.reviewCount} Reviews
            </span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          {product.isNewIn && (
            <span className="text-xs bg-black text-white px-2 py-1 rounded">
              Nouveau
            </span>
          )}
          {product.featured && (
            <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
              Vedette
            </span>
          )}
        </div>
       
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-black">
            €{product.price.toFixed(2)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-lg text-gray-500 line-through">
              €{product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>

        {product.comparePrice && product.comparePrice > product.price && (
          <div className="text-center">
            <span className="text-sm text-red-600 font-semibold">
              Article non échangeable, non remboursable
            </span>
          </div>
        )}
     
        <div className="space-y-3">
          <span className="text-sm font-medium">Sélectionner la quantité</span>
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="w-12 h-12 flex items-center justify-center border border-r-0 border-gray-300 text-gray-600 hover:border-black hover:text-black transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
           
            <div className="w-16 h-12 flex items-center justify-center border-t border-b border-gray-300 bg-white">
              <span className="text-sm font-medium">{quantity}</span>
            </div>
           
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-12 h-12 flex items-center justify-center border border-l-0 border-gray-300 text-gray-600 hover:border-black hover:text-black transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
     
        <button
          onClick={handleAddToBag}
          className="w-full py-4 px-6 text-sm font-semibold uppercase tracking-wide transition-all bg-black text-white hover:bg-gray-800"
        >
          Ajouter au panier
        </button>
   
        {product.shortDescription && (
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.shortDescription}
          </p>
        )}
       
        <div className="space-y-4 border-t pt-6">
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection('details')}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="font-medium">Détails</span>
              {expandedSections.details ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {expandedSections.details && (
              <div className="pb-4 text-sm text-gray-600 space-y-2">
                <p>{product.description}</p>
                {product.tags.length > 0 && (
                  <div>
                    <strong>Tags:</strong> {product.tags.join(', ')}
                  </div>
                )}
                <div>
                  <strong>SKU:</strong> {product.sku}
                </div>
              </div>
            )}
          </div>
         
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection('fit')}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="font-medium">Fit & Fabric</span>
              {expandedSections.fit ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {expandedSections.fit && (
              <div className="pb-4 text-sm text-gray-600 space-y-2">
                <p>Informations sur la coupe et le tissu...</p>
                <p>Matériaux de qualité premium</p>
                <p>Coupe moderne et confortable</p>
              </div>
            )}
          </div>
         
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection('shipping')}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="font-medium">Shipping & Returns</span>
              {expandedSections.shipping ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {expandedSections.shipping && (
              <div className="pb-4 text-sm text-gray-600 space-y-2">
                <p>Livraison gratuite pour les commandes de plus de 50€</p>
                <p>Retours gratuits sous 30 jours</p>
                <p>Livraison standard: 3-5 jours ouvrables</p>
                <p>Livraison express: 1-2 jours ouvrables</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ProductInfo;