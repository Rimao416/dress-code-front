"use client";
import React from "react";
import CheckoutSummary from "../checkout/CheckoutSummary";
interface CheckoutLayoutProps {
  currentStep: number;
  children: React.ReactNode;
}

const stepTitles = ["Informations", "Livraison", "Paiement"];

const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({ currentStep, children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {stepTitles.map((title, index) => (
              <React.Fragment key={title}>
                <span className={currentStep === index + 1 ? "text-black font-medium" : ""}>
                  {title}
                </span>
                {index < stepTitles.length - 1 && (
                  <span className="text-gray-400">&gt;</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">{children}</div>
          <CheckoutSummary />
        </div>
      </div>
    </div>
  );
};

export default CheckoutLayout;
