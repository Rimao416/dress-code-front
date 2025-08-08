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
        />
      )}
    </CheckoutLayout>
  );
};

export default CheckoutPage;
