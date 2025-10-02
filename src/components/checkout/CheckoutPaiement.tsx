"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAuth } from "@/context/AuthContext";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const getCountryCode = (countryName: string): string => {
  const countryMap: { [key: string]: string } = {
    'France': 'FR',
    'Allemagne': 'DE',
    'Espagne': 'ES',
    'Italie': 'IT',
    'Belgique': 'BE',
    'Pays-Bas': 'NL',
    'Luxembourg': 'LU',
    'Portugal': 'PT',
    'Autriche': 'AT',
    'Suisse': 'CH',
    'Royaume-Uni': 'GB',
    'États-Unis': 'US',
    'Canada': 'CA',
  };
  
  return countryMap[countryName] || 'FR';
};

interface Props {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  onBack: () => void;
  onConfirm: (orderId: string) => void; // ✅ Modifié pour passer l'orderId
  formData: any;
  shippingMethod: string;
  orderSummary: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    items: any[];
    countryCode?: string;
  };
}

interface PaymentFormProps {
  formData: any;
  shippingMethod: string;
  orderSummary: any;
  onBack: () => void;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  formData,
  shippingMethod,
  orderSummary,
  onBack,
  onSuccess,
  onError,
}) => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      onError("Stripe n'est pas encore chargé");
      return;
    }

    if (!user?.id) {
      onError("Utilisateur non authentifié");
      return;
    }

    setProcessing(true);
    
    try {
      console.log('💳 Début du processus de paiement');
      console.log('User ID:', user?.id);

      // Validation et nettoyage des données
      const validatedItems = orderSummary.items.map((item: any) => {
        const productId = typeof item.productId === 'number' 
          ? item.productId.toString() 
          : item.productId;
        
        const variantId = item.variantId 
          ? (typeof item.variantId === 'number' ? item.variantId.toString() : item.variantId)
          : "";

        return {
          id: productId,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          productId: productId,
          variantId: variantId,
          variantInfo: item.variantInfo || {}
        };
      });

      const totals = {
        subtotal: Number(orderSummary.subtotal.toFixed(2)),
        shippingCost: Number(orderSummary.shipping.toFixed(2)),
        taxAmount: Number(orderSummary.tax.toFixed(2)),
        totalAmount: Number(orderSummary.total.toFixed(2)),
      };

      const countryCode = orderSummary.countryCode || getCountryCode(formData.country);

      console.log('📦 Création de l\'intention de paiement...');

      // 1. Créer l'intention de paiement
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: user.id,
          formData: {
            ...formData,
            country: countryCode
          },
          shippingMethod,
          paymentMethod: 'CARD',
          items: validatedItems,
          totals,
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('❌ Erreur API:', responseData);
        onError(responseData.error || `Erreur ${response.status}: ${response.statusText}`);
        return;
      }

      const { clientSecret, orderId, paymentIntentId } = responseData;
      
      if (!clientSecret || !orderId) {
        onError("Réponse invalide du serveur");
        return;
      }

      console.log('✅ Intention créée - Order ID:', orderId);

      // 2. Confirmer le paiement avec Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        onError("Élément de carte non trouvé");
        return;
      }

      console.log('💳 Confirmation du paiement avec Stripe...');

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone || undefined,
              address: {
                line1: formData.address,
                country: countryCode,
              },
            },
          },
        }
      );

      if (error) {
        console.error('❌ Stripe error:', error);
        onError(error.message || "Erreur de paiement Stripe");
        return;
      }

      if (paymentIntent.status !== 'succeeded') {
        console.error('❌ Payment status:', paymentIntent.status);
        onError(`Paiement non confirmé: ${paymentIntent.status}`);
        return;
      }

      console.log('✅ Paiement confirmé par Stripe');

      // 3. Confirmer la commande côté serveur
      console.log('📝 Confirmation de la commande...');

      const confirmResponse = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          orderId,
        }),
      });

      const confirmData = await confirmResponse.json();

      if (!confirmResponse.ok) {
        console.error('❌ Erreur confirmation:', confirmData);
        onError(confirmData.error || "Erreur lors de la confirmation de la commande");
        return;
      }

      console.log('✅ Commande confirmée avec succès');
      onSuccess(orderId);

    } catch (error) {
      console.error('❌ Payment error:', error);
      onError(
        error instanceof Error 
          ? error.message 
          : "Erreur lors du traitement du paiement"
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border border-gray-300 rounded-lg p-4 bg-gray-50"
      >
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
                padding: '12px',
              },
              invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
              },
            },
            hidePostalCode: true,
          }}
        />
      </motion.div>

      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onBack}
          className="w-1/2 bg-gray-200 hover:bg-gray-300 text-black py-4 px-6 font-medium rounded transition-colors"
          disabled={processing}
        >
          RETOUR
        </motion.button>
        <motion.button
          whileHover={{ scale: processing ? 1 : 1.02 }}
          whileTap={{ scale: processing ? 1 : 0.98 }}
          type="submit"
          disabled={!stripe || processing}
          className="w-1/2 bg-green-500 hover:bg-green-600 text-white py-4 px-6 font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {processing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              TRAITEMENT...
            </span>
          ) : (
            "CONFIRMER LE PAIEMENT"
          )}
        </motion.button>
      </div>
    </form>
  );
};

const CheckoutPaiement: React.FC<Props> = ({
  paymentMethod,
  setPaymentMethod,
  onBack,
  onConfirm,
  formData,
  shippingMethod,
  orderSummary,
}) => {
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePaymentSuccess = (orderId: string) => {
    setPaymentError(null);
    onConfirm(orderId); // ✅ Passe l'orderId au parent
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    setPaymentError(null);
  };

  return (
    <>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl font-medium text-gray-900 mb-6"
      >
        PAIEMENT
      </motion.h2>

      <AnimatePresence mode="wait">
        {paymentError && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{paymentError}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-sm text-gray-500 mb-6"
      >
        Toutes les transactions sont sécurisées et cryptées.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="border border-gray-300 rounded-lg overflow-hidden"
      >
        <motion.label
          whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-between p-4 cursor-pointer border-b border-gray-200"
        >
          <div className="flex items-center">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "card"}
              onChange={() => handlePaymentMethodChange("card")}
              className="w-4 h-4 text-black mr-3"
            />
            <span className="font-medium">Carte de crédit ou débit</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Visa, Mastercard, Amex</span>
          </div>
        </motion.label>

        <AnimatePresence>
          {paymentMethod === "card" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-gray-50">
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    formData={formData}
                    shippingMethod={shippingMethod}
                    orderSummary={orderSummary}
                    onBack={onBack}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.label
          whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-between p-4 cursor-pointer opacity-50"
        >
          <div className="flex items-center">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "paypal"}
              onChange={() => handlePaymentMethodChange("paypal")}
              className="w-4 h-4 text-black mr-3"
              disabled
            />
            <span className="font-medium">PayPal</span>
          </div>
          <div className="text-gray-400">
            <span className="text-sm">Bientôt disponible</span>
          </div>
        </motion.label>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gray-50 p-4 rounded-lg mt-6"
      >
        <h3 className="font-medium mb-3">Résumé de la commande</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Sous-total ({orderSummary.items?.length || 0} article{(orderSummary.items?.length || 0) > 1 ? 's' : ''})</span>
            <span>{orderSummary.subtotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between">
            <span>Livraison</span>
            <span>
              {orderSummary.shipping === 0 ? 'Gratuite' : `${orderSummary.shipping.toFixed(2)} €`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>TVA</span>
            <span>{orderSummary.tax.toFixed(2)} €</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span>{orderSummary.total.toFixed(2)} €</span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CheckoutPaiement;