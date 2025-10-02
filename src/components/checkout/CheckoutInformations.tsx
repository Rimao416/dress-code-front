"use client";
import React from "react";
import { Lock, Info } from "lucide-react";

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  isAuthenticated: boolean;
}

const CheckoutInformations: React.FC<Props> = ({ 
  formData, 
  setFormData, 
  onNext,
  isAuthenticated 
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Validation avant de passer à l'étape suivante
  const handleNext = () => {
    if (!formData.email || !formData.firstName || !formData.lastName || 
        !formData.address || !formData.phone) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    onNext();
  };

  return (
    <>
      <h2 className="text-xl font-medium text-gray-900">CONTACT</h2>
      <div className="relative">
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleInputChange}
          disabled={isAuthenticated}
          className={`w-full p-3 border border-gray-300 focus:outline-none ${
            isAuthenticated ? 'bg-gray-100 cursor-not-allowed text-gray-600' : ''
          }`}
        />
        {isAuthenticated && (
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        )}
      </div>

      <h2 className="text-xl font-medium text-gray-900 mt-6">ADRESSE DE LIVRAISON</h2>
      <select
        name="country"
        value={formData.country}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 focus:outline-none bg-white"
      >
        <option value="France">France</option>
        <option value="Belgium">Belgique</option>
        <option value="Spain">Espagne</option>
        <option value="Italy">Italie</option>
      </select>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            name="firstName"
            placeholder="Prénom"
            value={formData.firstName}
            onChange={handleInputChange}
            disabled={isAuthenticated}
            className={`w-full p-3 border border-gray-300 ${
              isAuthenticated ? 'bg-gray-100 cursor-not-allowed text-gray-600' : ''
            }`}
          />
          {isAuthenticated && (
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            name="lastName"
            placeholder="Nom"
            value={formData.lastName}
            onChange={handleInputChange}
            disabled={isAuthenticated}
            className={`w-full p-3 border border-gray-300 ${
              isAuthenticated ? 'bg-gray-100 cursor-not-allowed text-gray-600' : ''
            }`}
          />
          {isAuthenticated && (
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          )}
        </div>
      </div>

      <textarea
        name="address"
        placeholder="Adresse"
        value={formData.address}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 resize-none focus:outline-none"
        rows={3}
      />

      <div className="relative">
        <input
          type="tel"
          name="phone"
          placeholder="Téléphone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300"
        />
      </div>

      {isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 flex items-start gap-2">
          <Info className="w-5 h-5 mt-0.5 text-blue-600" />
          <p>
            Les informations provenant de votre compte sont pré-remplies et 
            sécurisées. Vous pouvez cependant modifier votre numéro de téléphone 
            et l'adresse de livraison.
          </p>
        </div>
      )}

      <button
        onClick={handleNext}
        className="w-full bg-amber-200 hover:bg-amber-300 text-black py-4 px-6 font-medium mt-6 transition-colors"
      >
        CONTINUER VERS LA LIVRAISON
      </button>
    </>
  );
};

export default CheckoutInformations;
