"use client";
import React from "react";
import CheckoutHeader from "../checkout/CheckoutHeader";
import CheckoutSummary from "../checkout/CheckoutSummary";

interface CheckoutLayoutProps {
  currentStep: number;
  children: React.ReactNode;
}

const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({ currentStep, children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <CheckoutHeader currentStep={currentStep} />

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Colonne gauche (variable selon étape) */}
          <div className="space-y-8">{children}</div>

          {/* Colonne droite (fixe) */}
          <CheckoutSummary />
        </div>
      </div>
    </div>
  );
};

export default CheckoutLayout;
