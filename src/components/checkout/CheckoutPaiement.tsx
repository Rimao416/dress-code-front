"use client";
import React from "react";

interface Props {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}

const CheckoutPaiement: React.FC<Props> = ({ paymentMethod, setPaymentMethod, onBack, onConfirm }) => {
  return (
    <>
      <h2 className="text-xl font-medium text-gray-900">PAIEMENT</h2>

      <div className="space-y-4">
        <label className="flex items-center justify-between border p-4 cursor-pointer">
          <span>Carte bancaire</span>
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "card"}
            onChange={() => setPaymentMethod("card")}
          />
        </label>

        <label className="flex items-center justify-between border p-4 cursor-pointer">
          <span>PayPal</span>
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "paypal"}
            onChange={() => setPaymentMethod("paypal")}
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
          onClick={onConfirm}
          className="w-1/2 bg-green-500 hover:bg-green-600 text-white py-4 px-6 font-medium"
        >
          CONFIRMER LA COMMANDE
        </button>
      </div>
    </>
  );
};

export default CheckoutPaiement;
