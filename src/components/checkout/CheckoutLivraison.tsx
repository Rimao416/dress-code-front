"use client";
import React from "react";

interface Props {
  shippingMethod: string;
  setShippingMethod: (method: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const CheckoutLivraison: React.FC<Props> = ({ shippingMethod, setShippingMethod, onNext, onBack }) => {
  return (
    <>
      <h2 className="text-xl font-medium text-gray-900">MODE DE LIVRAISON</h2>

      <div className="space-y-4">
        <label className="flex items-center justify-between border p-4 cursor-pointer">
          <div>
            <p className="font-medium">Standard (2-3 jours)</p>
            <p className="text-sm text-gray-500">Gratuit dès 100 €</p>
          </div>
          <input
            type="radio"
            name="shipping"
            checked={shippingMethod === "standard"}
            onChange={() => setShippingMethod("standard")}
          />
        </label>

        <label className="flex items-center justify-between border p-4 cursor-pointer">
          <div>
            <p className="font-medium">Express (1 jour)</p>
            <p className="text-sm text-gray-500">9,99 €</p>
          </div>
          <input
            type="radio"
            name="shipping"
            checked={shippingMethod === "express"}
            onChange={() => setShippingMethod("express")}
          />
        </label>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={onBack}
          className="w-1/2 bg-gray-200 hover:bg-gray-300 text-black py-4 px-6 font-medium"
        >
          RETOUR
        </button>
        <button
          onClick={onNext}
          className="w-1/2 bg-amber-200 hover:bg-amber-300 text-black py-4 px-6 font-medium"
        >
          CONTINUER VERS LE PAIEMENT
        </button>
      </div>
    </>
  );
};

export default CheckoutLivraison;
