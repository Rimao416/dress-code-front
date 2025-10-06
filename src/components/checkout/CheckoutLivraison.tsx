"use client";
import React from "react";
import { Package, MapPin, Truck } from "lucide-react";

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  freeThreshold: number;
  estimatedDays: string;
  icon: React.ReactNode;
}

interface Props {
  shippingMethod: string;
  setShippingMethod: (method: string) => void;
  onNext: () => void;
  onBack: () => void;
  country: string;
  subtotal: number;
}

const CheckoutLivraison: React.FC<Props> = ({ 
  shippingMethod, 
  setShippingMethod, 
  onNext, 
  onBack,
  country = "France",
  subtotal = 0
}) => {
  
  // Fonction pour obtenir les options de livraison selon le pays
  const getShippingOptions = (): ShippingOption[] => {
    const isFranceMetro = country === "France";
    
    if (isFranceMetro) {
      return [
        {
          id: "colissimo_domicile",
          name: "Colissimo Domicile",
          description: "Livraison à votre domicile",
          basePrice: 7.99,
          freeThreshold: 65,
          estimatedDays: "24 à 72h",
          icon: <Package className="w-5 h-5" />
        },
        {
          id: "colissimo_relais",
          name: "Colissimo Retrait",
          description: "Point relais ou bureau de poste",
          basePrice: 3.99,
          freeThreshold: 65,
          estimatedDays: "24 à 72h",
          icon: <MapPin className="w-5 h-5" />
        },
        {
          id: "mondial_relay",
          name: "Mondial Relay",
          description: "Retrait en point relais",
          basePrice: 3.99,
          freeThreshold: 65,
          estimatedDays: "24 à 72h",
          icon: <Truck className="w-5 h-5" />
        }
      ];
    }
    
    // Pour les autres zones (DOM-TOM, Europe, International)
    return [
      {
        id: "international",
        name: "Livraison Standard",
        description: getInternationalDescription(country),
        basePrice: 0, // Prix calculé selon poids
        freeThreshold: 0,
        estimatedDays: getInternationalDelay(country),
        icon: <Package className="w-5 h-5" />
      }
    ];
  };

  const getInternationalDescription = (country: string): string => {
    if (["Guadeloupe", "Martinique", "Guyane", "Réunion", "Mayotte"].includes(country)) {
      return "Frais variables selon le poids du colis";
    }
    if (isEuropeanCountry(country)) {
      return "Frais variables selon le poids du colis";
    }
    return "Frais variables selon destination et poids";
  };

  const getInternationalDelay = (country: string): string => {
    if (["Guadeloupe", "Martinique", "Guyane", "Réunion", "Mayotte"].includes(country)) {
      return "5 à 7 jours ouvrés";
    }
    if (isEuropeanCountry(country)) {
      return "2 à 4 jours ouvrés";
    }
    return "3 à 8 jours";
  };

  const isEuropeanCountry = (country: string): boolean => {
    const europeanCountries = [
      "Belgique", "Espagne", "Italie", "Allemagne", "Portugal", 
      "Pays-Bas", "Luxembourg", "Autriche", "Suisse"
    ];
    return europeanCountries.includes(country);
  };

  const calculateShippingCost = (option: ShippingOption): number => {
    if (option.freeThreshold > 0 && subtotal >= option.freeThreshold) {
      return 0;
    }
    return option.basePrice;
  };

  const shippingOptions = getShippingOptions();
  const isFranceMetro = country === "France";

  return (
    <>
      <h2 className="text-xl font-medium text-gray-900 mb-2">MODE DE LIVRAISON</h2>
      
      {!isFranceMetro && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
          <p className="font-medium mb-1">⚠️ Livraison hors France métropolitaine</p>
          <p className="text-xs">
            Les frais de livraison seront calculés selon le poids du colis. 
            Des taxes et droits de douane peuvent s'appliquer à la réception.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {shippingOptions.map((option) => {
          const cost = calculateShippingCost(option);
          const isFree = cost === 0 && option.freeThreshold > 0;
          const amountToFree = option.freeThreshold > 0 ? option.freeThreshold - subtotal : 0;
          
          return (
            <label 
              key={option.id}
              className={`flex items-start justify-between border-2 p-4 rounded-lg cursor-pointer transition-all ${
                shippingMethod === option.id 
                  ? 'border-amber-400 bg-amber-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <div className={`mt-0.5 ${shippingMethod === option.id ? 'text-amber-600' : 'text-gray-400'}`}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{option.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{option.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Délai estimé : {option.estimatedDays}
                  </p>
                  
                  {isFranceMetro && amountToFree > 0 && amountToFree <= 20 && (
                    <p className="text-xs text-green-600 mt-1 font-medium">
                      Plus que {amountToFree.toFixed(2)}€ pour la livraison gratuite !
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  {isFree ? (
                    <span className="text-green-600 font-semibold">Gratuit</span>
                  ) : option.basePrice === 0 ? (
                    <span className="text-gray-600 text-sm">Calculé au poids</span>
                  ) : (
                    <span className="font-semibold text-gray-900">{cost.toFixed(2)}€</span>
                  )}
                </div>
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingMethod === option.id}
                  onChange={() => setShippingMethod(option.id)}
                  className="w-4 h-4 text-amber-500"
                />
              </div>
            </label>
          );
        })}
      </div>

      {isFranceMetro && subtotal < 65 && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          <p className="font-medium">💡 Bon à savoir</p>
          <p className="text-xs mt-1">
            Livraison gratuite dès 65€ d'achat pour la France métropolitaine
          </p>
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <button
          onClick={onBack}
          className="w-1/2 bg-gray-200 hover:bg-gray-300 text-black py-4 px-6 font-medium rounded transition-colors"
        >
          RETOUR
        </button>
        <button
          onClick={onNext}
          disabled={!shippingMethod}
          className="w-1/2 bg-amber-200 hover:bg-amber-300 text-black py-4 px-6 font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          CONTINUER VERS LE PAIEMENT
        </button>
      </div>
    </>
  );
};

export default CheckoutLivraison;