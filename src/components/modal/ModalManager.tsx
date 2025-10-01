// components/modal/ModalManager.tsx
"use client"

import React from 'react';
import { useModal } from '@/context/ModalContext';
import SignUpModal from './SignUpModal';
import LoginModal from './LoginModal';

const ModalManager = () => {
  const {
    isSignUpModalOpen,
    isLoginModalOpen,
    closeSignUpModal,
    closeLoginModal,
    switchToLogin,
    switchToSignUp,
  } = useModal();

  return (
    <>
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={closeSignUpModal}
        onSwitchToLogin={switchToLogin}
      />
     
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSwitchToSignUp={switchToSignUp}
      />
    </>
  );
};

export default ModalManager;