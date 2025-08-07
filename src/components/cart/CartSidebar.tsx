// components/Cart/CartSidebar.tsx
"use client"
import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/cart/useCart';
import Image from 'next/image';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const {
    items,
    totalPrice,
    removeItem,
    updateQuantity,
    clearCart,
    isEmpty,
    itemsCount,
    totalSavings
  } = useCart();

  // Correction 1: Typer correctement les variants avec le type "spring"
  const sidebarVariants: Variants = {
    closed: {
      x: '100%',
      transition: {
        type: 'spring' as const, // Ajout de "as const" pour que TypeScript reconnaisse le type literal
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants: Variants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />
          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 h-full w-96 bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-6 w-6 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Panier ({itemsCount})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {/* Content */}
            {isEmpty ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Votre panier est vide
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Découvrez nos collections et ajoutez vos articles préférés
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Continuer mes achats
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="flex items-start space-x-4 pb-6 mb-6 border-b border-gray-200 last:border-b-0"
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            // Correction 2: item.product.images est un array de strings, pas d'objets
                            src={item.product.images[0] || '/placeholder-image.jpg'}
                            // Correction 3: Utiliser item.product.name au lieu de title
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          {/* Correction 4: Utiliser item.product.name au lieu de title */}
                          <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">
                            {item.product.name}
                          </h3>
                         
                          {/* Variant Info */}
                          <div className="text-xs text-gray-500 space-y-1">
                            {item.selectedSize && (
                              <p>Taille: {item.selectedSize}</p>
                            )}
                            {item.selectedColor && (
                              <p>Couleur: {item.selectedColor}</p>
                            )}
                          </div>
                          {/* Price */}
                          <div className="mt-2 flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">
                              {formatPrice(item.variant.price || item.product.price)}
                            </span>
                            {item.product.comparePrice && item.product.comparePrice > (item.variant.price || item.product.price) && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(item.product.comparePrice)}
                              </span>
                            )}
                          </div>
                          {/* Quantity Controls */}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-1.5 hover:bg-gray-100 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3 text-gray-600" />
                              </button>
                              <span className="px-3 py-1.5 text-sm font-medium min-w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-gray-100 transition-colors"
                                disabled={item.quantity >= item.variant.stock}
                              >
                                <Plus className="h-3 w-3 text-gray-600" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {/* Footer */}
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  {/* Savings */}
                  {totalSavings > 0 && (
                    <div className="flex justify-between items-center mb-3 text-sm text-green-600">
                      <span>Vous économisez:</span>
                      <span className="font-semibold">
                        -{formatPrice(totalSavings)}
                      </span>
                    </div>
                  )}
                  {/* Total */}
                  <div className="flex justify-between items-center mb-4 text-lg font-semibold">
                    <span>Total:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                      Finaliser la commande
                    </button>
                    <div className="flex space-x-3">
                      <button
                        onClick={onClose}
                        className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Continuer mes achats
                      </button>
                      <button
                        onClick={clearCart}
                        className="flex-1 text-red-600 border border-red-300 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
                      >
                        Vider le panier
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;