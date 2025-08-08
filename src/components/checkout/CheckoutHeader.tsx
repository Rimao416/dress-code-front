"use client";
import React from "react";

interface CheckoutHeaderProps {
  currentStep: number;
}

const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ currentStep }) => {
  return (
    <div className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className={currentStep >= 1 ? "text-black font-medium" : ""}>
            Informations
          </span>
          <span className="text-gray-400">&gt;</span>
          <span className={currentStep >= 2 ? "text-black font-medium" : ""}>
            Livraison
          </span>
          <span className="text-gray-400">&gt;</span>
          <span className={currentStep >= 3 ? "text-black font-medium" : ""}>
            Paiement
          </span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutHeader;
