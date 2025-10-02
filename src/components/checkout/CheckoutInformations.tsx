"use client";
import React, { useState } from "react";
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
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    // Nettoyer l'erreur si l'utilisateur commence à remplir
    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ✅ Validation par champ
  const handleNext = () => {
    const newErrors: any = {};

    if (!formData.email) newErrors.email = "L'email est obligatoire";
    if (!formData.firstName) newErrors.firstName = "Le prénom est obligatoire";
    if (!formData.lastName) newErrors.lastName = "Le nom est obligatoire";
    if (!formData.address) newErrors.address = "L'adresse est obligatoire";
    if (!formData.phone) newErrors.phone = "Le téléphone est obligatoire";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
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
          className={`w-full p-3 border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } focus:outline-none ${
            isAuthenticated ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""
          }`}
        />
        {isAuthenticated && (
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        )}
      </div>
      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

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
            className={`w-full p-3 border ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            } ${
              isAuthenticated ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""
            }`}
          />
          {isAuthenticated && (
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          )}
        </div>
        {errors.firstName && (
          <p className="text-red-500 text-sm col-span-1">{errors.firstName}</p>
        )}

        <div className="relative">
          <input
            type="text"
            name="lastName"
            placeholder="Nom"
            value={formData.lastName}
            onChange={handleInputChange}
            disabled={isAuthenticated}
            className={`w-full p-3 border ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            } ${
              isAuthenticated ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""
            }`}
          />
          {isAuthenticated && (
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          )}
        </div>
        {errors.lastName && (
          <p className="text-red-500 text-sm col-span-1">{errors.lastName}</p>
        )}
      </div>

      <div>
        <textarea
          name="address"
          placeholder="Adresse"
          value={formData.address}
          onChange={handleInputChange}
          className={`w-full p-3 border resize-none focus:outline-none ${
            errors.address ? "border-red-500" : "border-gray-300"
          }`}
          rows={3}
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      <div className="relative">
        <input
          type="tel"
          name="phone"
          placeholder="Téléphone"
          value={formData.phone}
          onChange={handleInputChange}
          className={`w-full p-3 border ${
            errors.phone ? "border-red-500" : "border-gray-300"
          }`}
        />
      </div>
      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}

      {isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 flex items-start gap-2 mt-4">
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
