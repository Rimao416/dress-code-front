// context/ModalContext.tsx
"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  isSignUpModalOpen: boolean;
  isLoginModalOpen: boolean;
  openSignUpModal: () => void;
  openLoginModal: () => void;
  closeSignUpModal: () => void;
  closeLoginModal: () => void;
  switchToLogin: () => void;
  switchToSignUp: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openSignUpModal = () => {
    setIsLoginModalOpen(false);
    setIsSignUpModalOpen(true);
  };

  const openLoginModal = () => {
    setIsSignUpModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const switchToLogin = () => {
    setIsSignUpModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const switchToSignUp = () => {
    setIsLoginModalOpen(false);
    setIsSignUpModalOpen(true);
  };

  return (
    <ModalContext.Provider
      value={{
        isSignUpModalOpen,
        isLoginModalOpen,
        openSignUpModal,
        openLoginModal,
        closeSignUpModal,
        closeLoginModal,
        switchToLogin,
        switchToSignUp,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};