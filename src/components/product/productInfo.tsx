// components/product/ProductInfo.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Star, ChevronDown, ChevronUp, Minus, Plus, Check, X, ShoppingBag } from 'lucide-react';
import { ProductWithFullData, ProductVariant } from '@/types/product';
import Header from '../common/Header';
import { useCartStore } from '@/store/useCartStore';
import { useCartSidebarStore } from '@/store/useCartSidebarStore';

interface ProductInfoProps {
  product: ProductWithFullData;
  selectedVariant?: ProductVariant | null;
  quantity?: number;
  maxQuantity?: number;
  effectivePrice?: number;
  isInCart?: boolean;
  cartQuantity?: number;
  isAddingToCart?: boolean;
  onAddToBag?: (variant?: ProductVariant) => void;
  onVariantChange?: (variant: ProductVariant) => void;
  onQuantityChange?: (quantity: number) => void;
  productUtils?: any;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ 
  product, 
  selectedVariant: propSelectedVariant,
  quantity: propQuantity = 1,
  maxQuantity: propMaxQuantity,
  effectivePrice: propEffectivePrice,
  isInCart = false,
  cartQuantity = 0,
  isAddingToCart = false,
  onAddToBag,
  onVariantChange,
  onQuantityChange,
  productUtils
}) => {
  const { isOpen: isCartSidebarOpen, toggleSidebar: toggleCartSidebar, closeSidebar: closeCartSidebar } = useCartSidebarStore();
  
  // États locaux - utilisés seulement si les props correspondantes ne sont pas fournies
  const [localSelectedSize, setLocalSelectedSize] = useState<string>('');
  const [localSelectedColor, setLocalSelectedColor] = useState<string>('');
  const [localSelectedVariant, setLocalSelectedVariant] = useState<ProductVariant | null>(null);
  const [localQuantity, setLocalQuantity] = useState<number>(1);
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    details: false,
    fit: false,
    shipping: false,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showMiniCart, setShowMiniCart] = useState<boolean>(false);
  const [addedItem, setAddedItem] = useState<any>(null);

  // Store actions
  const addToCart = useCartStore((state) => state.addToCart);
  const totalItems = useCartStore((state) => state.totalItems);

  // Utiliser les props si disponibles, sinon les états locaux
  const selectedVariant = propSelectedVariant !== undefined ? propSelectedVariant : localSelectedVariant;
  const quantity = propQuantity !== undefined ? propQuantity : localQuantity;
  const currentPrice = propEffectivePrice !== undefined ? propEffectivePrice : (selectedVariant?.price || product.price);
  const maxQuantity = propMaxQuantity !== undefined ? propMaxQuantity : (selectedVariant?.stock || product.stock);

  // Obtenir les tailles disponibles
  const availableSizes = [...new Set(
    product.variants
      .filter(v => v.isActive && v.size)
      .map(v => v.size!)
  )];

  // Obtenir les couleurs disponibles (avec déduplication par couleur)
  const availableColors = product.variants
    .filter(v => v.isActive && v.color)
    .reduce((acc, variant) => {
      const existingColor = acc.find(c => c.color === variant.color);
      if (!existingColor) {
        acc.push({
          color: variant.color!,
          hex: String(variant.colorHex),
          id: variant.id
        });
      }
      return acc;
    }, [] as Array<{ color: string; hex?: string; id: string }>);

  // Trouver la variante sélectionnée (seulement si on gère l'état localement)
  useEffect(() => {
    if (propSelectedVariant === undefined) {
      if (localSelectedSize || localSelectedColor) {
        const variant = product.variants.find(v =>
          v.isActive &&
          (!localSelectedSize || v.size === localSelectedSize) &&
          (!localSelectedColor || v.color === localSelectedColor)
        );
        setLocalSelectedVariant(variant || null);
      } else {
        setLocalSelectedVariant(null);
      }
    }
  }, [localSelectedSize, localSelectedColor, product.variants, propSelectedVariant]);

  // Synchroniser les couleurs/tailles avec la variante sélectionnée depuis les props
  useEffect(() => {
    if (propSelectedVariant) {
      setLocalSelectedSize(propSelectedVariant.size || '');
      setLocalSelectedColor(propSelectedVariant.color || '');
    }
  }, [propSelectedVariant]);

  const validateSelection = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // Si le produit a des tailles disponibles mais aucune n'est sélectionnée
    if (availableSizes.length > 0 && !localSelectedSize && !selectedVariant?.size) {
      errors.size = 'Veuillez sélectionner une taille';
    }
    
    // Si le produit a des couleurs disponibles mais aucune n'est sélectionnée
    if (availableColors.length > 0 && !localSelectedColor && !selectedVariant?.color) {
      errors.color = 'Veuillez sélectionner une couleur';
    }
    
    // Si pas de variante trouvée avec la combinaison sélectionnée
    if ((localSelectedSize || localSelectedColor || selectedVariant) && !selectedVariant) {
      errors.combination = 'Cette combinaison n\'est pas disponible';
    }
    
    return errors;
  };

  const handleAddToBag =async () => {
    const errors = validateSelection();
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTimeout(() => setFieldErrors({}), 3000);
      return;
    }

    // Si pas de variantes, utiliser le produit principal
    const variantToAdd = selectedVariant || {
      id: `main-${product.id}`,
      productId: product.id,
      size: localSelectedSize || null,
      color: localSelectedColor || null,
      colorHex: null,
      material: null,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      images: product.images,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    } as ProductVariant;

    try {
      // Si on utilise le store local
      if (!onAddToBag) {
        await addToCart(product, variantToAdd, quantity);
      }
      
      // Appeler la fonction parent si elle existe
      onAddToBag?.(variantToAdd);
      
      // Stocker les informations de l'article ajouté
      setAddedItem({
        product,
        variant: variantToAdd,
        quantity,
        selectedSize: localSelectedSize || selectedVariant?.size,
        selectedColor: localSelectedColor || selectedVariant?.color
      });
      
      // Afficher le mini-panier
      setShowMiniCart(true);
      setTimeout(() => setShowMiniCart(false), 5000);
      
      setFieldErrors({});
    } catch (error) {
      setFieldErrors({ general: 'Erreur lors de l\'ajout au panier' });
      setTimeout(() => setFieldErrors({}), 3000);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    const maxStock = selectedVariant?.stock || product.stock;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      if (onQuantityChange) {
        onQuantityChange(newQuantity);
      } else {
        setLocalQuantity(newQuantity);
      }
    }
  };

  const handleVariantSelection = (type: 'size' | 'color', value: string) => {
    if (type === 'size') {
      setLocalSelectedSize(value);
    } else {
      setLocalSelectedColor(value);
    }

    // Si on a un callback parent pour les changements de variante
    if (onVariantChange) {
      const newVariant = product.variants.find(v =>
        v.isActive &&
        (type === 'size' ? v.size === value : v.size === localSelectedSize || !localSelectedSize) &&
        (type === 'color' ? v.color === value : v.color === localSelectedColor || !localSelectedColor)
      );
      if (newVariant) {
        onVariantChange(newVariant);
      }
    }

    // Effacer les erreurs correspondantes
    if (fieldErrors[type]) {
      setFieldErrors(prev => ({ ...prev, [type]: '' }));
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (quantity < maxQuantity) {
      handleQuantityChange(quantity + 1);
    }
  };

  const toggleSection = (section: string) => {
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

  const currentStock = selectedVariant?.stock || product.stock;
  const isOutOfStock = currentStock === 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  return (
    <>
      <Header forceScrolledStyle={true} />
      
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
                src={addedItem.product.images[0]}
                alt={addedItem.product.name}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {addedItem.product.name}
              </h4>
              <p className="text-sm text-gray-500">
                {addedItem.selectedColor && `${addedItem.selectedColor} - `}
                {addedItem.selectedSize && `${addedItem.selectedSize}`}
              </p>
              <p className="text-sm font-medium text-gray-900">
                €{currentPrice.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                Qté: {addedItem.quantity}
              </p>
            </div>
          </div>
          
          <button className="w-full mt-4 bg-gray-900 text-white py-2 px-4 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
             onClick={toggleCartSidebar}
          >
            <ShoppingBag className="h-4 w-4 inline mr-2" />
            Voir le panier ({totalItems})
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* Marque */}
        {product.brand && (
          <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {product.brand.name}
          </div>
        )}

        {/* Nom du produit */}
        <h1 className="text-2xl sm:text-3xl font-bold text-black">
          {product.name}
        </h1>

        {/* Prix */}
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-black">
            €{currentPrice.toFixed(2)}
          </span>
          {product.comparePrice && product.comparePrice > currentPrice && (
            <span className="text-lg text-gray-500 line-through">
              €{product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Avis */}
        {product._count.reviews > 0 && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(product.averageRating)}
            </div>
            <span className="text-sm text-gray-600 underline cursor-pointer hover:text-black">
              {product._count.reviews} Reviews
            </span>
          </div>
        )}

        {/* Tags spéciaux */}
        <div className="flex items-center space-x-2">
          {product.isNewIn && (
            <span className="text-xs bg-black text-white px-2 py-1 rounded">
              Limited Edition
            </span>
          )}
          {product.featured && (
            <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
              Mercury
            </span>
          )}
        </div>

        {/* Indicateur de panier */}
        {isInCart && cartQuantity > 0 && (
          <div className="text-sm text-green-600 font-medium">
            ✓ {cartQuantity} article(s) dans le panier
          </div>
        )}

        {/* Sélecteur de couleur */}
        {availableColors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                Couleur: <span className="text-red-500">*</span>
              </span>
              {(localSelectedColor || selectedVariant?.color) && (
                <span className="text-sm text-gray-600">
                  {localSelectedColor || selectedVariant?.color}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {availableColors.map(({ color, hex, id }) => (
                <button
                  key={id}
                  onClick={() => handleVariantSelection('color', color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    (localSelectedColor || selectedVariant?.color) === color
                      ? 'border-black ring-2 ring-gray-300'
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: hex || '#e5e7eb' }}
                  aria-label={`Couleur ${color}`}
                  title={color}
                />
              ))}
            </div>
            {fieldErrors.color && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.color}</p>
            )}
          </div>
        )}

        {/* Sélecteur de taille */}
        {availableSizes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Taille <span className="text-red-500">*</span>
              </span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {availableSizes.map((size) => {
                const sizeVariant = product.variants.find(v =>
                  v.size === size && v.isActive &&
                  (!(localSelectedColor || selectedVariant?.color) || v.color === (localSelectedColor || selectedVariant?.color))
                );
                const isAvailable = sizeVariant && sizeVariant.stock > 0;
               
                return (
                  <button
                    key={size}
                    onClick={() => {
                      if (isAvailable) {
                        handleVariantSelection('size', size);
                      }
                    }}
                    disabled={!isAvailable}
                    className={`p-3 text-sm font-medium border transition-all ${
                      (localSelectedSize || selectedVariant?.size) === size
                        ? 'border-black bg-black text-white'
                        : isAvailable
                        ? 'border-gray-300 hover:border-black'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {fieldErrors.size && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.size}</p>
            )}
            {fieldErrors.combination && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.combination}</p>
            )}
          </div>
        )}

        {/* Stock information */}
        {isLowStock && (
          <p className="text-sm text-red-600 font-medium">
            Plus que {currentStock} en stock
          </p>
        )}

        {/* Sélecteur de quantité */}
        {!isOutOfStock && (
          <div className="space-y-3">
            <span className="text-sm font-medium">Sélectionner la quantité</span>
            <div className="flex items-center">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className={`w-12 h-12 flex items-center justify-center border border-r-0 ${
                  quantity <= 1
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:border-black hover:text-black'
                } transition-colors`}
                aria-label="Diminuer la quantité"
              >
                <Minus className="h-4 w-4" />
              </button>
             
              <div className="w-16 h-12 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                <span className="text-sm font-medium">{quantity}</span>
              </div>
             
              <button
                onClick={incrementQuantity}
                disabled={quantity >= maxQuantity}
                className={`w-12 h-12 flex items-center justify-center border border-l-0 ${
                  quantity >= maxQuantity
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:border-black hover:text-black'
                } transition-colors`}
                aria-label="Augmenter la quantité"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Erreur générale */}
        {fieldErrors.general && (
          <div className="text-sm text-red-500 text-center">
            {fieldErrors.general}
          </div>
        )}

        {/* Bouton Add to Bag */}
        <button
          onClick={handleAddToBag}
          disabled={isOutOfStock || isAddingToCart}
          className={`w-full py-4 px-6 text-sm font-semibold uppercase tracking-wide transition-all ${
            isOutOfStock || isAddingToCart
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {isOutOfStock 
            ? 'Rupture de stock' 
            : isAddingToCart 
            ? 'Ajout en cours...' 
            : 'Ajouter au panier'
          }
        </button>

        {/* Final Sale */}
        {product.comparePrice && product.comparePrice > currentPrice && (
          <div className="text-center">
            <span className="text-sm text-red-600 font-semibold">
             Article non échangeable, non remboursable
            </span>
          </div>
        )}

        {/* Description courte */}
        {product.shortDescription && (
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.shortDescription}
          </p>
        )}

        {/* Sections pliables */}
        <div className="space-y-4 border-t pt-6">
          {/* Détails */}
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

          {/* Fit & Fabric */}
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
                {product.weight && (
                  <div>
                    <strong>Poids:</strong> {product.weight}g
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <strong>Dimensions:</strong> {JSON.stringify(product.dimensions)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Shipping & Returns */}
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