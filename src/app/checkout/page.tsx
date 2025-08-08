"use client";
import React, { useState } from "react";
import CheckoutLayout from "@/components/layouts/CheckoutLayout";
import CheckoutPaiement from "@/components/checkout/CheckoutPaiement";
import CheckoutLivraison from "@/components/checkout/CheckoutLivraison";
import CheckoutInformations from "@/components/checkout/CheckoutInformations";

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

  // Tu peux récupérer les items du panier depuis un context ou un store
  const cartItems = [
    { id: 1, name: "Produit exemple 1", price: 89.99, quantity: 1 },
    { id: 2, name: "Produit exemple 2", price: 59.99, quantity: 2 }
  ];

  // Calcul dynamique de l'orderSummary
  const calculateOrderSummary = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Frais de livraison selon la méthode choisie
    const shippingCosts = {
      standard: 5.99,
      express: 12.99,
      premium: 0 // gratuit
    };
    const shipping = shippingCosts[shippingMethod as keyof typeof shippingCosts] || 0;
    
    const tax = subtotal * 0.2; // TVA 20%
    const total = subtotal + shipping + tax;
    
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      items: cartItems
    };
  };

  const orderSummary = calculateOrderSummary();

  const handleConfirm = () => {
    console.log("Commande confirmée", { formData, shippingMethod, paymentMethod });
    // ici tu peux envoyer la commande au backend
  };

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
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onBack={() => setCurrentStep(2)}
          onConfirm={handleConfirm}
          formData={formData}           // ✅ Ajouté
          shippingMethod={shippingMethod} // ✅ Ajouté
          orderSummary={orderSummary}    // ✅ Ajouté
        />
      )}
    </CheckoutLayout>
  );
};

export default CheckoutPage;