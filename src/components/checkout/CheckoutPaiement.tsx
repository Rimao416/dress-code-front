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

// Assure-toi d'avoir ta clé publique Stripe dans tes variables d'environnement
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Props {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  onBack: () => void;
  onConfirm: () => void;
  formData: any;
  shippingMethod: string;
  orderSummary: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    items: any[];
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
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError("Stripe n'est pas encore chargé");
      return;
    }

    setProcessing(true);

    try {
      // Créer l'intention de paiement
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: 'current-user-id', // Tu dois récupérer l'ID du client connecté
          formData,
          shippingMethod,
          paymentMethod: 'card',
          items: orderSummary.items,
          totals: {
            subtotal: orderSummary.subtotal,
            shippingCost: orderSummary.shipping,
            taxAmount: orderSummary.tax,
            totalAmount: orderSummary.total,
          },
        }),
      });

      const { clientSecret, orderId, paymentIntentId } = await response.json();

      if (!clientSecret) {
        onError("Erreur lors de la création du paiement");
        return;
      }

      // Confirmer le paiement avec Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        onError("Élément de carte non trouvé");
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.address,
                country: formData.country,
              },
            },
          },
        }
      );

      if (error) {
        onError(error.message || "Erreur de paiement");
      } else if (paymentIntent.status === 'succeeded') {
        // Confirmer la commande côté serveur
        await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            orderId,
          }),
        });

        onSuccess(orderId);
      }
    } catch (error) {
      onError("Erreur lors du traitement du paiement");
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
              },
            },
          }}
        />
      </motion.div>

      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onBack}
          className="w-1/2 bg-gray-200 hover:bg-gray-300 text-black py-4 px-6 font-medium rounded"
          disabled={processing}
        >
          RETOUR
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!stripe || processing}
          className="w-1/2 bg-green-500 hover:bg-green-600 text-white py-4 px-6 font-medium rounded disabled:opacity-50"
        >
          {processing ? "TRAITEMENT..." : "CONFIRMER LE PAIEMENT"}
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
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  const handlePaymentSuccess = (orderId: string) => {
    setPaymentSuccess(orderId);
    onConfirm(); // Appeler la fonction de confirmation parent
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  if (paymentSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          Paiement réussi !
        </h2>
        <p className="text-gray-600">
          Votre commande #{paymentSuccess} a été confirmée.
        </p>
      </motion.div>
    );
  }

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

      {paymentError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
        >
          {paymentError}
        </motion.div>
      )}

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
        {/* Option Carte de crédit */}
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
              onChange={() => setPaymentMethod("card")}
              className="w-4 h-4 text-black mr-3"
            />
            <span className="font-medium">Carte de crédit ou débit</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Visa, Mastercard, Amex</span>
          </div>
        </motion.label>

        {/* Formulaire de paiement Stripe */}
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

        {/* Option PayPal */}
        <motion.label
          whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-between p-4 cursor-pointer"
        >
          <div className="flex items-center">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
              className="w-4 h-4 text-black mr-3"
            />
            <span className="font-medium">PayPal</span>
          </div>
          <div className="text-blue-500">
            <span className="text-sm">Bientôt disponible</span>
          </div>
        </motion.label>
      </motion.div>

      {/* Résumé de la commande */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gray-50 p-4 rounded-lg mt-6"
      >
        <h3 className="font-medium mb-3">Résumé de la commande</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Sous-total</span>
            <span>{orderSummary.subtotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between">
            <span>Livraison</span>
            <span>{orderSummary.shipping.toFixed(2)} €</span>
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