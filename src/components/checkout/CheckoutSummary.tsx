"use client";
import React from "react";
import { useCart } from "@/hooks/cart/useCart";

const CheckoutSummary: React.FC = () => {
  const { items, totalPrice, updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) removeItem(itemId);
    else updateQuantity(itemId, newQuantity);
  };

  const formatPrice = (price: number) => `${price.toFixed(2)} €`;
  const shippingCost = totalPrice > 100 ? 0 : 8.5;
  const finalTotal = totalPrice + shippingCost;

  return (
    <div className="lg:sticky lg:top-8 lg:self-start">
      <div className="bg-gray-50 p-6 space-y-6">
        {/* Articles du panier */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 bg-white">
              <div className="relative">
                <img
                  src={item.product.images?.[0] || "/api/placeholder/60/60"}
                  alt={item.product.name}
                  className="w-15 h-15 object-cover"
                />
                <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.product.name}</p>
                <p className="text-xs text-gray-600">
                  {item.selectedColor && `${item.selectedColor} / `}
                  {item.selectedSize || "M"}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-6 h-6 border border-gray-300 flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-6 h-6 border border-gray-300 flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-medium">
                    {formatPrice((item.variant.price || item.product.price) * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span>Sous-total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Livraison</span>
            <span>{shippingCost === 0 ? "Gratuit" : formatPrice(shippingCost)}</span>
          </div>
          <div className="flex justify-between font-medium text-lg border-t pt-3">
            <span>Total</span>
            <div className="text-right">
              <span className="text-xs text-gray-500">EUR</span>
              <span className="ml-1">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>

        {/* Infos supplémentaires */}
        <div className="text-xs text-gray-600 space-y-3 border-t pt-4">
          <p className="text-center">Limite de 15 articles par commande.</p>
          <p className="text-center">Aucune modification possible après validation.</p>
          <p className="text-center">
            2 à 3 jours ouvrés pour les commandes standard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
