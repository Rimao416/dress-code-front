// pages/checkout/CheckoutPage.tsx (ou l'emplacement approprié)
"use client";
import React, { useState, useMemo } from "react";
import CheckoutLayout from "@/components/layouts/CheckoutLayout";
import CheckoutPaiement from "@/components/checkout/CheckoutPaiement";
import CheckoutLivraison from "@/components/checkout/CheckoutLivraison";
import CheckoutInformations from "@/components/checkout/CheckoutInformations";
import { OrderItem } from "@/types/payment";
import { useCart } from "@/hooks/cart/useCart";

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    country: "France",
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
  });
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  // ✅ Utiliser le hook useCart au lieu d'accéder directement au store
  const { items: cartItems, totalPrice, clearCart } = useCart();
  
  // Conversion des CartItem vers OrderItem pour l'API de paiement
  const convertCartItemsToOrderItems = useMemo((): OrderItem[] => {
    return cartItems.map(cartItem => ({
      id: cartItem.productId.toString(), // ID du produit réel
      name: cartItem.product.name,
      price: cartItem.variant?.price || cartItem.product.price || 0,
      quantity: cartItem.quantity,
      productId: cartItem.productId.toString(),
      variantId: cartItem.variant?.id?.toString() || "", 
      variantInfo: {
        size: cartItem.selectedSize,
        color: cartItem.selectedColor,
      }
    }));
  }, [cartItems]);

  // Calcul automatique du résumé de commande
  const orderSummary = useMemo(() => {
    const subtotal = totalPrice;
   
    // Logique de livraison : gratuite dès 100€, sinon selon méthode
    let shipping = 0;
    if (subtotal < 100) {
      shipping = shippingMethod === "express" ? 9.99 : 4.99;
    } else {
      shipping = shippingMethod === "express" ? 9.99 : 0;
    }
   
    // Calcul TVA (20% en France)
    const taxRate = formData.country === "France" ? 0.20 : 0.19;
    const tax = subtotal * taxRate;
   
    const total = subtotal + shipping + tax;
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      items: convertCartItemsToOrderItems
    };
  }, [totalPrice, shippingMethod, formData.country, convertCartItemsToOrderItems]);

  const handleConfirm = () => {
    console.log("Commande confirmée", {
      formData,
      shippingMethod,
      paymentMethod,
      orderSummary
    });
   
    // Vider le panier après confirmation réussie
    // clearCart(); // Décommentez après que le paiement soit confirmé côté serveur
  };

  // Vérifier si le panier est vide
  if (cartItems.length === 0) {
    return (
      <CheckoutLayout currentStep={currentStep}>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Votre panier est vide
          </h2>
          <p className="text-gray-500 mb-4">
            Ajoutez des produits à votre panier pour procéder au checkout.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-amber-200 hover:bg-amber-300 text-black py-3 px-6 font-medium"
          >
            CONTINUER LES ACHATS
          </button>
        </div>
      </CheckoutLayout>
    );
  }

  return (
    <CheckoutLayout currentStep={currentStep}>
      {currentStep === 1 && (
        <CheckoutInformations
          formData={formData}
          setFormData={setFormData}
          onNext={() => setCurrentStep(2)}
        />
      )}
      {currentStep === 2 && (
        <CheckoutLivraison
          shippingMethod={shippingMethod}
          setShippingMethod={setShippingMethod}
          onBack={() => setCurrentStep(1)}
          onNext={() => setCurrentStep(3)}
        />
      )}
      {currentStep === 3 && (
        <CheckoutPaiement
          formData={formData}
          shippingMethod={shippingMethod}
          orderSummary={orderSummary}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onBack={() => setCurrentStep(2)}
          onConfirm={handleConfirm}
        />
      )}
    </CheckoutLayout>
  );
};

export default CheckoutPage;