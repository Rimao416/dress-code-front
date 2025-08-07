// components/product/ProductInfo.tsx
"use client";
import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp, Minus, Plus, Check } from 'lucide-react';
import { ProductWithFullData, ProductVariant } from '@/types/product';
import Header from '../common/Header';
import { useCartStore } from '@/store/useCartStore';

interface ProductInfoProps {
  product: ProductWithFullData;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    details: false,
    fit: false,
    shipping: false,
  });
  const [showError, setShowError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Store actions
  const addItem = useCartStore((state) => state.addItem);

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

  // Trouver la variante sélectionnée
  React.useEffect(() => {
    if (selectedSize || selectedColor) {
      const variant = product.variants.find(v =>
        v.isActive &&
        (!selectedSize || v.size === selectedSize) &&
        (!selectedColor || v.color === selectedColor)
      );
      setSelectedVariant(variant || null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedSize, selectedColor, product.variants]);

  const validateSelection = (): string | null => {
    // Si le produit a des tailles disponibles mais aucune n'est sélectionnée
    if (availableSizes.length > 0 && !selectedSize) {
      return 'Veuillez sélectionner une taille';
    }

    // Si le produit a des couleurs disponibles mais aucune n'est sélectionnée
    if (availableColors.length > 0 && !selectedColor) {
      return 'Veuillez sélectionner une couleur';
    }

    // Si pas de variante trouvée avec la combinaison sélectionnée
    if ((selectedSize || selectedColor) && !selectedVariant) {
      return 'Cette combinaison n\'est pas disponible';
    }

    return null;
  };

  const handleAddToBag = () => {
    const errorMessage = validateSelection();
    
    if (errorMessage) {
      setShowError(errorMessage);
      setTimeout(() => setShowError(''), 3000);
      return;
    }

    // Si pas de variantes, utiliser le produit principal
    const variantToAdd = selectedVariant || {
      id: `main-${product.id}`,
      productId: product.id,
      size: selectedSize || null,
      color: selectedColor || null,
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
      addItem(product, variantToAdd, quantity, selectedSize, selectedColor);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      setShowError('');
    } catch (error) {
      setShowError('Erreur lors de l\'ajout au panier');
      setTimeout(() => setShowError(''), 3000);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    const maxStock = selectedVariant?.stock || product.stock;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    const maxStock = selectedVariant?.stock || product.stock;
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
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

  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant?.stock || product.stock;
  const isOutOfStock = currentStock === 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  return (
    <>
      <Header forceScrolledStyle={true} />
      <div className="space-y-6">
        {/* Messages de succès et d'erreur */}
        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
            <Check className="h-5 w-5 mr-2" />
            Produit ajouté au panier avec succès !
          </div>
        )}

        {showError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {showError}
          </div>
        )}

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

        {/* Sélecteur de couleur */}
        {availableColors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                Couleur: <span className="text-red-500">*</span>
              </span>
              {selectedColor && (
                <span className="text-sm text-gray-600">{selectedColor}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {availableColors.map(({ color, hex, id }) => (
                <button
                  key={id}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? 'border-black ring-2 ring-gray-300'
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: hex || '#e5e7eb' }}
                  aria-label={`Couleur ${color}`}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sélecteur de taille */}
        {availableSizes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Taille <span className="text-red-500">*</span>
              </span>
              <button className="text-sm text-gray-600 underline hover:text-black">
                Guide des tailles
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {availableSizes.map((size) => {
                const sizeVariant = product.variants.find(v =>
                  v.size === size && v.isActive &&
                  (!selectedColor || v.color === selectedColor)
                );
                const isAvailable = sizeVariant && sizeVariant.stock > 0;
               
                return (
                  <button
                    key={size}
                    onClick={() => isAvailable ? setSelectedSize(size) : null}
                    disabled={!isAvailable}
                    className={`p-3 text-sm font-medium border transition-all ${
                      selectedSize === size
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
                disabled={quantity >= currentStock}
                className={`w-12 h-12 flex items-center justify-center border border-l-0 ${
                  quantity >= currentStock
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

        {/* Bouton Add to Bag */}
        <button
          onClick={handleAddToBag}
          disabled={isOutOfStock}
          className={`w-full py-4 px-6 text-sm font-semibold uppercase tracking-wide transition-all ${
            isOutOfStock
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
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
    </>
  );
};

export default ProductInfo;