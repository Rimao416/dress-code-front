"use client"
import React, { useState } from 'react';
import { useCart } from '@/hooks/cart/useCart';

const CheckoutPage = () => {
  const {
    items,
    totalPrice,
    totalItems,
    updateQuantity,
    removeItem,
    getTotalSavings
  } = useCart();

  const [formData, setFormData] = useState({
    email: '',
    emailOptIn: false,
    country: 'France',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    postalCode: '',
    city: '',
    phone: '',
    smsOptIn: false,
    discountCode: ''
  });

  const [currentStep, setCurrentStep] = useState(1); // 1: Informations, 2: Livraison, 3: Paiement

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const formatPrice = (price) => {
    return `${price.toFixed(2)} €`;
  };

  const shippingCost = totalPrice > 100 ? 0 : 8.50;
  const finalTotal = totalPrice + shippingCost;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className={currentStep >= 1 ? "text-black font-medium" : ""}>Informations</span>
            <span className="text-gray-400">&gt;</span>
            <span className={currentStep >= 2 ? "text-black font-medium" : ""}>Livraison</span>
            <span className="text-gray-400">&gt;</span>
            <span className={currentStep >= 3 ? "text-black font-medium" : ""}>Paiement</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Colonne gauche - Formulaires */}
          <div className="space-y-8">
            {/* Avis conditions */}
            <div className="text-sm text-gray-600">
              En choisissant une option de paiement express, vous acceptez nos{' '}
              <a href="#" className="underline">Conditions générales</a> et notre{' '}
              <a href="#" className="underline">Politique de confidentialité</a>
            </div>

            {/* Section Contact */}
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-gray-900">CONTACT</h2>
              
              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-none focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Adresse de livraison */}
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-gray-900">ADRESSE DE LIVRAISON</h2>
              
              <div className="text-sm text-gray-600">
                <p>Veuillez vérifier que votre adresse est correcte.</p>
                <p>Nous ne pouvons pas modifier les adresses après la commande.</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-none focus:outline-none focus:border-black appearance-none bg-white"
                  >
                    <option value="France">France</option>
                    <option value="Belgium">Belgique</option>
                    <option value="Spain">Espagne</option>
                    <option value="Italy">Italie</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">
                    Pays / Région
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-none focus:outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Nom"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-none focus:outline-none focus:border-black"
                  />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    placeholder="Adresse"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-none focus:outline-none focus:border-black pr-10"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <input
                  type="text"
                  name="apartment"
                  placeholder="Appartement, suite, etc. (optionnel)"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-none focus:outline-none focus:border-black"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Code postal"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-none focus:outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="Ville"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-none focus:outline-none focus:border-black"
                  />
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Téléphone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-none focus:outline-none focus:border-black pr-10"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <button className="w-full bg-amber-200 hover:bg-amber-300 text-black py-4 px-6 font-medium transition-colors">
                CONTINUER VERS LA LIVRAISON
              </button>
            </div>

            {/* Liens bas de page */}
            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-black">Politique de remboursement</a>
              <a href="#" className="hover:text-black">Livraison</a>
              <a href="#" className="hover:text-black">Politique de confidentialité</a>
              <a href="#" className="hover:text-black">Conditions d’utilisation</a>
            </div>
          </div>

          {/* Colonne droite - Résumé de la commande */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-gray-50 p-6 space-y-6">

              {/* Articles du panier */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-white">
                    <div className="relative">
                      <img
                        src={item.product.images?.[0] || '/api/placeholder/60/60'}
                        alt={item.product.name}
                        className="w-15 h-15 object-cover"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-600">
                        {item.selectedColor && `${item.selectedColor} / `}
                        {item.selectedSize || 'M'}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-6 h-6 border border-gray-300 flex items-center justify-center text-sm"
                          >
                            -
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-6 h-6 border border-gray-300 flex items-center justify-center text-sm"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-medium">
                          {formatPrice((item.variant.price || item.product.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Code promo */}
              <div className="flex">
                <input
                  type="text"
                  name="discountCode"
                  placeholder="Code promo ou carte cadeau"
                  value={formData.discountCode}
                  onChange={handleInputChange}
                  className="flex-1 p-3 border border-gray-300 focus:outline-none focus:border-black"
                />
                <button className="bg-gray-200 hover:bg-gray-300 px-6 py-3 font-medium">
                  APPLIQUER
                </button>
              </div>

              {/* Résumé */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <span>Livraison</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>{shippingCost === 0 ? 'Gratuit' : formatPrice(shippingCost)}</span>
                </div>

                <div className="flex justify-between font-medium text-lg border-t pt-3">
                  <span>Total</span>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">EUR</span>
                    <span className="ml-1">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Infos supplémentaires */}
              <div className="text-xs text-gray-600 space-y-3 border-t pt-4">
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>
                    Le montant total que vous payez inclut tous les droits de douane et taxes applicables. 
                    Nous garantissons l’absence de frais supplémentaires à la livraison.
                  </p>
                </div>
                
                <p className="text-center">Limite de 15 articles par commande.</p>
                
                <p className="text-center">
                  Vérifiez que les articles dans votre panier sont corrects. Les commandes ne peuvent pas être modifiées ou annulées après validation.
                </p>
                
                <p className="text-center">
                  Prévoyez un délai de traitement de 2 à 3 jours ouvrés pour les commandes avec livraison standard. 
                  Merci de votre patience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
