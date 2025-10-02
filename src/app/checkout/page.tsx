// pages/checkout/CheckoutPage.tsx
"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import CheckoutLayout from "@/components/layouts/CheckoutLayout";
import CheckoutPaiement from "@/components/checkout/CheckoutPaiement";
import CheckoutLivraison from "@/components/checkout/CheckoutLivraison";
import CheckoutInformations from "@/components/checkout/CheckoutInformations";
import { OrderItem } from "@/types/payment";
import { useCart } from "@/hooks/cart/useCart";

const CheckoutPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    country: "France",
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    postalCode: "",
  });
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  
  const { items: cartItems, totalPrice, clearCart } = useCart();
  
  // Conversion des CartItem vers OrderItem
  const convertCartItemsToOrderItems = useMemo((): OrderItem[] => {
    return cartItems.map(cartItem => {
      const orderItem: OrderItem = {
        id: cartItem.productId.toString(),
        name: cartItem.product.name,
        price: cartItem.variant?.price || cartItem.product.price || 0,
        quantity: cartItem.quantity,
        productId: cartItem.productId.toString(),
        variantInfo: {
          size: cartItem.selectedSize,
          color: cartItem.selectedColor,
        }
      };

      // ✅ Ajouter variantId seulement s'il existe et est valide
      if (cartItem.variant?.id) {
        orderItem.variantId = cartItem.variant.id.toString();
      }

      return orderItem;
    });
  }, [cartItems]);

  // Calcul du résumé de commande
  const orderSummary = useMemo(() => {
    const subtotal = totalPrice;
   
    let shipping = 0;
    if (subtotal < 100) {
      shipping = shippingMethod === "express" ? 9.99 : 4.99;
    } else {
      shipping = shippingMethod === "express" ? 9.99 : 0;
    }
   
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

  const handleConfirm = (orderId: string) => {
    console.log("✅ Commande confirmée:", orderId);
    
    // Marquer la commande comme terminée
    setOrderCompleted(true);
    setCompletedOrderId(orderId);
    
    // Vider le panier localement
    clearCart();
    
    // Rediriger vers la page de confirmation après 3 secondes
    setTimeout(() => {
      router.push(`/order/confirmation/${orderId}`);
    }, 3000);
  };

  // Vérifier si le panier est vide
  if (cartItems.length === 0 && !orderCompleted) {
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
            onClick={() => router.push('/shop')}
            className="bg-amber-200 hover:bg-amber-300 text-black py-3 px-6 font-medium"
          >
            CONTINUER LES ACHATS
          </button>
        </div>
      </CheckoutLayout>
    );
  }

  // Afficher le succès de la commande
  if (orderCompleted && completedOrderId) {
    return (
      <CheckoutLayout currentStep={3}>
        <div className="text-center py-12">
          <div className="text-6xl mb-6 animate-bounce">✅</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            Commande confirmée !
          </h2>
          <p className="text-gray-600 mb-2">
            Numéro de commande : <strong>{completedOrderId}</strong>
          </p>
          <p className="text-gray-500 mb-6">
            Un email de confirmation vous a été envoyé.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto mb-6">
            <p className="text-sm text-green-700">
              Redirection vers la page de confirmation dans quelques instants...
            </p>
          </div>
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