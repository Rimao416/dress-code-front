import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { X, Gift, Truck, Crown, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Input from "../ui/input";
import Button from "../ui/button";
import BottomSheet from "../common/BottomSheet";
import { authService } from "@/services/auth.service";
import { Gender } from '@/generated/prisma';
import { useAuth } from "@/context/AuthContext";

// Types pour les props du composant
interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Type pour le state de soumission
interface SubmissionState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

// Modal d'inscription
const SignUpModal = ({ isOpen, onClose, onSuccess }: SignUpModalProps) => {
  const {
    userData,
    updateUserData,
    resetUserData,
    loading,
    setLoading,
    errors,
    setError,
    clearAllErrors
  } = useAuth();

  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitting: false,
    isSuccess: false,
    error: null
  });

  const [isMobile, setIsMobile] = useState(false);

  // Détecter si on est sur mobile - avec useCallback pour éviter la re-création
  const checkIsMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
   
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [checkIsMobile]);

  // Reset du state lors de l'ouverture/fermeture - FIXE: dépendances stables
  useEffect(() => {
    if (isOpen) {
      setSubmissionState({
        isSubmitting: false,
        isSuccess: false,
        error: null
      });
      clearAllErrors();
    }
  }, [isOpen]); // ENLEVÉ clearAllErrors des dépendances

  // Fonction memoïsée pour éviter les re-créations - CORRIGÉE
  const handleInputChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUserData(field as keyof typeof userData, e.target.value);
    // Clear submission error when user starts typing
    setSubmissionState(prev => {
      if (prev.error) {
        return { ...prev, error: null };
      }
      return prev;
    });
  }, [updateUserData]);

  // Fonction de validation memoïsée
  const validateForm = useCallback((): boolean => {
    let hasErrors = false;

    if (!userData.firstName.trim()) {
      setError('firstName', 'Le prénom est requis');
      hasErrors = true;
    }

    if (!userData.lastName.trim()) {
      setError('lastName', 'Le nom est requis');
      hasErrors = true;
    }

    if (!userData.email.trim()) {
      setError('email', 'L\'email est requis');
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      setError('email', 'Email invalide');
      hasErrors = true;
    }

    if (!userData.password.trim()) {
      setError('password', 'Le mot de passe est requis');
      hasErrors = true;
    } else if (userData.password.length < 8) {
      setError('password', 'Le mot de passe doit contenir au moins 8 caractères');
      hasErrors = true;
    }

    return !hasErrors;
  }, [userData.firstName, userData.lastName, userData.email, userData.password, setError]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setSubmissionState(prev => ({ ...prev, isSubmitting: true, error: null }));
    setLoading(true);

    try {
      // Préparer les données pour l'inscription
      const registrationData = {
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.password, // Ajout du champ manquant
        firstName: userData.firstName,
        lastName: userData.lastName,
      };

      const response = await authService.register(registrationData);

      if (response.success) {
        setSubmissionState({
          isSubmitting: false,
          isSuccess: true,
          error: null
        });

        // Attendre un peu pour montrer le succès
        setTimeout(() => {
          resetUserData();
          onSuccess?.();
          onClose();
        }, 2000);
      } else {
        // Gestion des erreurs de validation du serveur
        if (response.errors) {
          Object.entries(response.errors).forEach(([field, message]) => {
            setError(field, message);
          });
        }

        setSubmissionState({
          isSubmitting: false,
          isSuccess: false,
          error: response.message || 'Une erreur est survenue lors de l\'inscription'
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setSubmissionState({
        isSubmitting: false,
        isSuccess: false,
        error: 'Une erreur inattendue est survenue. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  }, [validateForm, userData, setLoading, setError, resetUserData, onSuccess, onClose]);

  // Composant pour afficher les messages de statut - memoïsé
  const StatusMessage = useCallback(() => {
    if (submissionState.isSuccess) {
      return (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          <CheckCircle className="h-4 w-4" />
          <span>Inscription réussie ! Bienvenue dans DressCodeCLUB !</span>
        </div>
      );
    }

    if (submissionState.error) {
      return (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{submissionState.error}</span>
        </div>
      );
    }

    return null;
  }, [submissionState.isSuccess, submissionState.error]);

  // Contenu du formulaire pour mobile
  const MobileFormContent = useCallback(() => (
    <>
      {/* Header */}
      <div className="relative bg-gradient-to-r from-red-800 to-red-700 text-white p-4 text-center rounded-t-3xl">
        <div className="mb-4">
          <div className="text-2xl font-bold tracking-tight">
            DressCode<span className="text-red-200">CLUB</span>
          </div>
          <div className="text-sm font-medium mt-1">MEMBER PROGRAM</div>
        </div>
       
        <p className="text-sm text-red-100 leading-relaxed">
          Rejoignez-nous et profitez dès maintenant de la livraison gratuite sur toutes vos commandes,
          d'une surprise pour votre anniversaire, de l'accès exclusif aux lancements de produits,
          de jeux exclusifs et plus encore.
        </p>
      </div>

      {/* Benefits */}
      <div className="px-4 py-4 bg-red-50 border-b">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Gift className="h-4 w-4 text-red-700" />
            </div>
            <span className="font-medium text-gray-900">
              10% sur votre commande en vous inscrivant à notre newsletter
            </span>
          </div>
         
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Truck className="h-4 w-4 text-red-700" />
            </div>
            <span className="font-medium text-gray-900">
              Livraison et retours GRATUITS
            </span>
          </div>
         
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Crown className="h-4 w-4 text-red-700" />
            </div>
            <span className="font-medium text-gray-900">
              Accès EXCLUSIF aux réductions et aux nouveautés
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 pb-8">
        <div className="space-y-4">
          <StatusMessage />
          
          <Input
            label="Prénom"
            placeholder="Votre prénom"
            value={userData.firstName}
            onChange={handleInputChange('firstName')}
            error={errors.firstName}
            disabled={submissionState.isSubmitting || submissionState.isSuccess}
            required
          />
         
          <Input
            label="Nom"
            placeholder="Votre nom"
            value={userData.lastName}
            onChange={handleInputChange('lastName')}
            error={errors.lastName}
            disabled={submissionState.isSubmitting || submissionState.isSuccess}
            required
          />
         
          <Input
            label="E-mail"
            type="email"
            placeholder="votre@email.com"
            value={userData.email}
            onChange={handleInputChange('email')}
            error={errors.email}
            disabled={submissionState.isSubmitting || submissionState.isSuccess}
            required
          />
         
          <Input
            label="Mot de passe"
            type="password"
            placeholder="Votre mot de passe"
            value={userData.password}
            onChange={handleInputChange('password')}
            error={errors.password}
            disabled={submissionState.isSubmitting || submissionState.isSuccess}
            showPasswordToggle
            required
          />
         
          <div className="text-xs text-gray-500 leading-relaxed">
            Les mots de passe doivent contenir au moins 8 caractères et être difficiles à deviner -
            les mots de passe couramment utilisés ou risqués ne sont pas autorisés.
          </div>
         
          <Button
            variant="primary"
            size="lg"
            className="w-full mt-6"
            onClick={handleSubmit}
            disabled={submissionState.isSubmitting || submissionState.isSuccess}
          >
            {submissionState.isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Inscription en cours...
              </>
            ) : submissionState.isSuccess ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Inscription réussie !
              </>
            ) : (
              'S\'inscrire maintenant'
            )}
          </Button>
         
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </div>
      </div>
    </>
  ), [userData, errors, submissionState, handleInputChange, handleSubmit, StatusMessage]);

  // Contenu pour desktop avec disposition en colonnes
  const DesktopFormContent = useCallback(() => (
    <div className="flex h-full">
      {/* Bouton fermer */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white transition-colors"
        disabled={submissionState.isSubmitting}
      >
        <X className="h-6 w-6" />
      </button>

      {/* Colonne gauche - Header et Benefits */}
      <div className="flex-1 bg-gradient-to-br from-red-800 to-red-700 text-white p-6 flex flex-col justify-center">
        {/* Header */}
        <div className="mb-8">
          <div className="text-3xl font-bold tracking-tight mb-2">
            DressCode<span className="text-red-200">CLUB</span>
          </div>
          <div className="text-sm font-medium mb-4">MEMBER PROGRAM</div>
         
          <p className="text-red-100 leading-relaxed">
            Rejoignez-nous et profitez dès maintenant de la livraison gratuite sur toutes vos commandes,
            d'une surprise pour votre anniversaire, de l'accès exclusif aux lancements de produits,
            de jeux exclusifs et plus encore.
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-600/30 rounded-full flex items-center justify-center">
              <Gift className="h-5 w-5 text-red-200" />
            </div>
            <div>
              <div className="font-medium text-white">Réduction immédiate</div>
              <div className="text-sm text-red-200">10% sur votre première commande</div>
            </div>
          </div>
         
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-600/30 rounded-full flex items-center justify-center">
              <Truck className="h-5 w-5 text-red-200" />
            </div>
            <div>
              <div className="font-medium text-white">Livraison gratuite</div>
              <div className="text-sm text-red-200">Livraison et retours GRATUITS</div>
            </div>
          </div>
         
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-600/30 rounded-full flex items-center justify-center">
              <Crown className="h-5 w-5 text-red-200" />
            </div>
            <div>
              <div className="font-medium text-white">Accès exclusif</div>
              <div className="text-sm text-red-200">Réductions et nouveautés en avant-première</div>
            </div>
          </div>
        </div>
      </div>

      {/* Colonne droite - Formulaire */}
      <div className="flex-1 bg-white p-6 overflow-y-auto">
        <div className="h-full flex flex-col justify-center">
          <div className="space-y-4">
            <StatusMessage />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                placeholder="Votre prénom"
                value={userData.firstName}
                onChange={handleInputChange('firstName')}
                error={errors.firstName}
                disabled={submissionState.isSubmitting || submissionState.isSuccess}
                required
              />
             
              <Input
                label="Nom"
                placeholder="Votre nom"
                value={userData.lastName}
                onChange={handleInputChange('lastName')}
                error={errors.lastName}
                disabled={submissionState.isSubmitting || submissionState.isSuccess}
                required
              />
            </div>
           
            <Input
              label="E-mail"
              type="email"
              placeholder="votre@email.com"
              value={userData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              disabled={submissionState.isSubmitting || submissionState.isSuccess}
              required
            />
           
            <Input
              label="Mot de passe"
              type="password"
              placeholder="Votre mot de passe"
              value={userData.password}
              onChange={handleInputChange('password')}
              error={errors.password}
              disabled={submissionState.isSubmitting || submissionState.isSuccess}
              showPasswordToggle
              required
            />
           
            <div className="text-xs text-gray-500 leading-relaxed">
              Les mots de passe doivent contenir au moins 8 caractères et être difficiles à deviner.
            </div>
           
            <Button
              variant="primary"
              size="lg"
              className="w-full mt-6"
              onClick={handleSubmit}
              disabled={submissionState.isSubmitting || submissionState.isSuccess}
            >
              {submissionState.isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Inscription en cours...
                </>
              ) : submissionState.isSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Inscription réussie !
                </>
              ) : (
                'S\'inscrire maintenant'
              )}
            </Button>
           
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            </p>
          </div>
        </div>
      </div>
    </div>
  ), [onClose, submissionState, userData, errors, handleInputChange, handleSubmit, StatusMessage]);

  if (!isOpen) return null;

  // Version mobile avec BottomSheet
  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        snapLevels={[0, 0.25, 0.5, 1]}
        initialLevel={0.85}
        showHandle={true}
        closeOnOverlayClick={!submissionState.isSubmitting}
        maxHeight="95vh"
      >
        <MobileFormContent />
      </BottomSheet>
    );
  }

  // Version desktop avec modal en colonnes
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={submissionState.isSubmitting ? undefined : onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
       
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 h-[600px] overflow-hidden"
        >
          <DesktopFormContent />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SignUpModal;