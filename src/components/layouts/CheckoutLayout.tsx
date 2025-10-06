"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Info, X, Package, MapPin, Truck, Globe } from "lucide-react";
import CheckoutSummary from "../checkout/CheckoutSummary";

interface CheckoutLayoutProps {
  currentStep: number;
  children: React.ReactNode;
}

const stepTitles = ["Informations", "Livraison", "Paiement"];

const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({ currentStep, children }) => {
  const [showShippingInfo, setShowShippingInfo] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Lien retour */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour à l'accueil</span>
          </Link>
          
          {/* Étapes */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {stepTitles.map((title, index) => (
              <React.Fragment key={title}>
                <span
                  className={
                    currentStep === index + 1 ? "text-black font-medium" : ""
                  }
                >
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
      
      {/* Bannière d'information sur la livraison */}
      <div className="bg-amber-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-600" />
              <p className="text-sm text-amber-900">
                <strong>Livraison gratuite</strong> dès 65€ d'achat en France métropolitaine
              </p>
            </div>
            <button
              onClick={() => setShowShippingInfo(true)}
              className="text-sm text-amber-700 hover:text-amber-900 underline flex items-center gap-1"
            >
              <Info className="w-4 h-4" />
              Voir toutes les infos
            </button>
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

      {/* Modal d'informations de livraison */}
      {showShippingInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Informations de livraison</h2>
              <button
                onClick={() => setShowShippingInfo(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* France Métropolitaine */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    France Métropolitaine
                  </h3>
                </div>

                <div className="space-y-3">
                  {/* Colissimo Domicile */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">Colissimo Domicile</h4>
                      </div>
                      <span className="text-lg font-bold text-amber-600">7,99€</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Livraison à votre domicile</p>
                    <p className="text-xs text-green-600 font-medium">
                      ✓ Offert dès 65€ d'achat
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Délai : 24 à 72h à partir de l'expédition
                    </p>
                  </div>

                  {/* Colissimo Retrait */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">Colissimo Retrait</h4>
                      </div>
                      <span className="text-lg font-bold text-amber-600">3,99€</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Point relais ou bureau de poste</p>
                    <p className="text-xs text-green-600 font-medium">
                      ✓ Offert dès 65€ d'achat
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Délai : 24 à 72h à partir de l'expédition
                    </p>
                  </div>

                  {/* Mondial Relay */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">Mondial Relay</h4>
                      </div>
                      <span className="text-lg font-bold text-amber-600">3,99€</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Retrait en point relais</p>
                    <p className="text-xs text-green-600 font-medium">
                      ✓ Offert dès 65€ d'achat
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Délai : 24 à 72h à partir de l'expédition
                    </p>
                  </div>
                </div>
              </div>

              {/* Livraison hors France Métropolitaine */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Globe className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Livraison hors France Métropolitaine
                  </h3>
                </div>

                <div className="space-y-3">
                  {/* DOM-TOM */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">DOM-TOM</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Les frais de livraison varient en fonction du poids du colis
                    </p>
                    <p className="text-xs text-gray-500">Délai : 5 à 7 jours ouvrés</p>
                  </div>

                  {/* Europe */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Europe</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Les frais de livraison varient selon le pays de destination et le poids du colis
                    </p>
                    <p className="text-xs text-gray-500">Délai : 2 à 4 jours ouvrés</p>
                  </div>

                  {/* International */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">International</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Livraison disponible dans plusieurs pays, avec un tarif calculé en fonction de la destination et du poids du colis
                    </p>
                    <p className="text-xs text-gray-500">Délai : 3 à 8 jours</p>
                  </div>
                </div>

                {/* Avertissement douanes */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <div className="flex gap-2">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-900 font-medium mb-1">
                        Important pour les livraisons hors France
                      </p>
                      <p className="text-xs text-amber-800">
                        Toute commande passée sur le site et livrée en dehors de la France pourra être soumise à des taxes et droits de douane imposés à l'arrivée du colis. Ces frais sont à votre charge et relèvent de votre responsabilité. Nous vous conseillons de vous renseigner auprès des autorités compétentes de votre pays.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Note sur les délais */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note :</strong> Les délais de livraison sont donnés à titre indicatif et peuvent varier selon les cas de force majeure ou les périodes de forte activité.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowShippingInfo(false)}
                className="w-full bg-amber-200 hover:bg-amber-300 text-black py-3 px-6 font-medium rounded-lg transition-colors"
              >
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutLayout;