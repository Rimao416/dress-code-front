"use client";
import CheckoutLayout from "@/components/layouts/CheckoutLayout";
import React, { useState } from "react";
const InformationsPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <CheckoutLayout currentStep={1}>
      <h2 className="text-xl font-medium text-gray-900">CONTACT</h2>
      <input
        type="email"
        name="email"
        placeholder="E-mail"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 focus:outline-none"
      />
      {/* ...autres champs */}
    </CheckoutLayout>
  );
};

export default InformationsPage;
