"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}

const CheckoutPaiement: React.FC<Props> = ({ paymentMethod, setPaymentMethod, onBack, onConfirm }) => {
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
    nameOnCard: ""
  });

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
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
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-sm text-gray-500 mb-6"
      >
        All transactions are secure and encrypted.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="border border-gray-300 rounded-lg overflow-hidden"
      >
        {/* Credit Card Option */}
        <motion.label 
          whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-between p-4 cursor-pointer border-b border-gray-200"
        >
          <div className="flex items-center">
            <motion.input
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.1 }}
              type="radio"
              name="payment"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
              className="w-4 h-4 text-black mr-3"
            />
            <span className="font-medium">Credit or Debit Card</span>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center space-x-2"
          >
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%231434CB'/%3E%3Cpath d='M9.5 7.5h5v1h-5z' fill='white'/%3E%3C/svg%3E" alt="Visa" className="w-8 h-5" />
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%23EB001B'/%3E%3Ccircle cx='9' cy='8' r='5' fill='%23EB001B'/%3E%3Ccircle cx='15' cy='8' r='5' fill='%23FF5F00'/%3E%3C/svg%3E" alt="Mastercard" className="w-8 h-5" />
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%23006FCF'/%3E%3Cpath d='M7 4h10v8H7z' fill='white'/%3E%3C/svg%3E" alt="American Express" className="w-8 h-5" />
            <span className="text-sm text-gray-500">+2</span>
          </motion.div>
        </motion.label>

        {/* Card Form - Only show when card is selected */}
        <AnimatePresence>
          {paymentMethod === "card" && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="p-4 bg-gray-50 overflow-hidden"
            >
              <motion.div 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-4"
              >
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="relative"
                >
                  <motion.input
                    whileFocus={{ scale: 1.01, borderColor: "#3B82F6" }}
                    transition={{ duration: 0.2 }}
                    type="text"
                    name="cardNumber"
                    placeholder="Card number"
                    value={cardData.cardNumber}
                    onChange={handleCardInputChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13 4H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <motion.input
                    whileFocus={{ scale: 1.01, borderColor: "#3B82F6" }}
                    transition={{ duration: 0.2 }}
                    type="text"
                    name="expiryDate"
                    placeholder="Expiration date (MM / YY)"
                    value={cardData.expiryDate}
                    onChange={handleCardInputChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <motion.div className="relative">
                    <motion.input
                      whileFocus={{ scale: 1.01, borderColor: "#3B82F6" }}
                      transition={{ duration: 0.2 }}
                      type="text"
                      name="securityCode"
                      placeholder="Security code"
                      value={cardData.securityCode}
                      onChange={handleCardInputChange}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="2"/>
                        <path d="M5.5 8.5L7 10l3.5-3.5" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="relative"
                >
                  <motion.input
                    whileFocus={{ scale: 1.01, borderColor: "#3B82F6" }}
                    transition={{ duration: 0.2 }}
                    type="text"
                    name="nameOnCard"
                    placeholder="Name on card"
                    value={cardData.nameOnCard}
                    onChange={handleCardInputChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                    </svg>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PayPal Option */}
        <motion.label 
          whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-between p-4 cursor-pointer"
        >
          <div className="flex items-center">
            <motion.input
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.1 }}
              type="radio"
              name="payment"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
              className="w-4 h-4 text-black mr-3"
            />
            <span className="font-medium">More Payment Options</span>
          </div>
          <motion.div 
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
            className="text-blue-500"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 4l4 4-4 4V4z"/>
            </svg>
          </motion.div>
        </motion.label>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex gap-4 mt-6"
      >
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#D1D5DB" }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
          onClick={onBack}
          className="w-1/2 bg-gray-200 hover:bg-gray-300 text-black py-4 px-6 font-medium rounded"
        >
          RETOUR
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#059669" }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
          onClick={onConfirm}
          className="w-1/2 bg-green-500 hover:bg-green-600 text-white py-4 px-6 font-medium rounded"
        >
          CONFIRMER LA COMMANDE
        </motion.button>
      </motion.div>
    </>
  );
};

export default CheckoutPaiement;