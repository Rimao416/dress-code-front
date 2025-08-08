"use client";
import React from "react";

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
}

const CheckoutInformations: React.FC<Props> = ({ formData, setFormData, onNext }) => {
const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setFormData((prev: FormData) => ({
    ...prev,
    [name]: value,
  }));
};


  return (
    <>
      <h2 className="text-xl font-medium text-gray-900">CONTACT</h2>
      <input
        type="email"
        name="email"
        placeholder="E-mail"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 focus:outline-none"
      />

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
        <input
          type="text"
          name="firstName"
          placeholder="Prénom"
          value={formData.firstName}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Nom"
          value={formData.lastName}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300"
        />
      </div>

    <textarea
  name="address"
  placeholder="Adresse"
  value={formData.address}
  onChange={handleInputChange}
  className="w-full p-3 border border-gray-300 resize-none"
  rows={3}
/>


      <input
        type="tel"
        name="phone"
        placeholder="Téléphone"
        value={formData.phone}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300"
      />

      <button
        onClick={onNext}
        className="w-full bg-amber-200 hover:bg-amber-300 text-black py-4 px-6 font-medium mt-6"
      >
        CONTINUER VERS LA LIVRAISON
      </button>
    </>
  );
};

export default CheckoutInformations;
