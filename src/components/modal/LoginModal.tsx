// components/modal/LoginModal.tsx
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { X, Loader2, CheckCircle, AlertCircle, EyeOff, Eye } from "lucide-react";
import Button from "../ui/button";
import BottomSheet from "../common/BottomSheet";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import { FormErrors, SubmissionState } from "@/types/auth.type";

// Types pour les props du composant
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSwitchToSignUp?: () => void; // Changé de onSignUpClick à onSwitchToSignUp
}
// Type pour les données du formulaire de connexion
interface LoginFormData {
  email: string;
  password: string;
}

const LoginModal = ({ isOpen, onClose, onSuccess, onSwitchToSignUp }: LoginModalProps) => {
  const { setLoading, setUser } = useAuth();
  
  // Utilisation de useRef pour éviter les re-renders excessifs
  const formDataRef = useRef<LoginFormData>({
    email: '',
    password: ''
  });

  // État local pour forcer le re-render quand nécessaire
  const [, forceUpdate] = useState({});
  const triggerUpdate = () => forceUpdate({});

  // État local pour les erreurs
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitting: false,
    isSuccess: false,
    error: null
  });
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si on est sur mobile
  const checkIsMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [checkIsMobile]);

  // Reset du state lors de l'ouverture/fermeture
  useEffect(() => {
    if (isOpen) {
      formDataRef.current = {
        email: '',
        password: ''
      };
      setFormErrors({});
      setSubmissionState({
        isSubmitting: false,
        isSuccess: false,
        error: null
      });
      triggerUpdate();
    }
  }, [isOpen]);

  // Fonction pour gérer les changements d'input
  const handleInputChange = useCallback((field: keyof LoginFormData, value: string) => {
    // Mettre à jour les données du formulaire dans la ref
    formDataRef.current = {
      ...formDataRef.current,
      [field]: value
    };

    // Effacer l'erreur pour ce champ
    setFormErrors(prev => {
      if (prev[field]) {
        return {
          ...prev,
          [field]: undefined
        };
      }
      return prev;
    });

    // Effacer l'erreur de soumission
    setSubmissionState(prev => {
      if (prev.error) {
        return {
          ...prev,
          error: null
        };
      }
      return prev;
    });
  }, []);

  // Fonction de validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let hasErrors = false;
    const formData = formDataRef.current;

    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email invalide';
      hasErrors = true;
    }

    if (!formData.password.trim()) {
      errors.password = 'Le mot de passe est requis';
      hasErrors = true;
    }

    setFormErrors(errors);
    return !hasErrors;
  };

  // Fonction de soumission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmissionState(prev => ({ ...prev, isSubmitting: true, error: null }));
    setLoading(true);

    try {
      const formData = formDataRef.current;
      
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success && response.data) {
        if (response.data.user) {
          setUser(response.data.user);
        }

        setSubmissionState({
          isSubmitting: false,
          isSuccess: true,
          error: null
        });

        // Attendre un peu pour montrer le succès
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        // Gestion des erreurs de validation du serveur
        if (response.errors) {
          const serverErrors: FormErrors = {};
          Object.entries(response.errors).forEach(([field, message]) => {
            if (field in formDataRef.current) {
              serverErrors[field as keyof FormErrors] = message as string;
            }
          });
          setFormErrors(serverErrors);
        }

        setSubmissionState({
          isSubmitting: false,
          isSuccess: false,
          error: response.message || 'Email ou mot de passe incorrect'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setSubmissionState({
        isSubmitting: false,
        isSuccess: false,
        error: 'Une erreur inattendue est survenue. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Gérer le clic sur "S'inscrire"
 // Gérer le clic sur "S'inscrire"
const handleSignUpClick = () => {
  onClose();
  onSwitchToSignUp?.();
};
  // Composant pour afficher les messages de statut
  const StatusMessage = () => {
    if (submissionState.isSuccess) {
      return (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          <CheckCircle className="h-4 w-4" />
          <span>Connexion réussie ! Bienvenue !</span>
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
  };

  // Composant Input personnalisé
  const CustomInput = ({
    label,
    type = "text",
    placeholder,
    field,
    error,
    disabled,
    required,
    showPasswordToggle = false
  }: {
    label: string;
    type?: string;
    placeholder: string;
    field: keyof LoginFormData;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    showPasswordToggle?: boolean;
  }) => {
    const [localValue, setLocalValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Sync avec la ref au montage et quand le modal s'ouvre
    useEffect(() => {
      setLocalValue(formDataRef.current[field]);
    }, [field, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalValue(value);
      formDataRef.current[field] = value;
      handleInputChange(field, value);
    };

    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <input
            type={inputType}
            placeholder={placeholder}
            value={localValue}
            onChange={handleChange}
            disabled={disabled}
            className={`
              w-full px-4 py-3 border rounded-md transition-all duration-200
              text-neutral-900 placeholder-neutral-400 bg-neutral-50
              hover:bg-white outline-none focus:outline-none
              ${error
                ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
                : 'border-neutral-300 focus:ring-2 focus:ring-neutral-800 focus:border-transparent'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${(type === 'password' && showPasswordToggle) || error ? 'pr-12' : ''}
            `}
          />
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  };

  // Contenu du formulaire pour mobile
  const MobileFormContent = () => (
    <>
      {/* Header */}
      <div className="relative bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-6 text-center rounded-t-3xl">
        <div className="mb-4">
          <div className="text-2xl font-bold tracking-tight">
            Bienvenue sur DressCode
          </div>
        </div>
        
        <p className="text-sm text-neutral-300 leading-relaxed">
          Connectez-vous à votre compte pour accéder à vos favoris, 
          suivre vos commandes et profiter d'une expérience personnalisée.
        </p>
      </div>

      {/* Form */}
      <div className="p-6 pb-8">
        <div className="space-y-4">
          <StatusMessage />
          
          <CustomInput
            label="E-mail"
            type="email"
            placeholder="votre@email.com"
            field="email"
            error={formErrors.email}
            disabled={submissionState.isSubmitting || submissionState.isSuccess}
            required
          />
          
          <CustomInput
            label="Mot de passe"
            type="password"
            placeholder="Votre mot de passe"
            field="password"
            error={formErrors.password}
            disabled={submissionState.isSubmitting || submissionState.isSuccess}
            showPasswordToggle
            required
          />
          
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
                Connexion en cours...
              </>
            ) : submissionState.isSuccess ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Connecté !
              </>
            ) : (
              'Se connecter'
            )}
          </Button>

          {/* Lien vers inscription */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Vous n'avez pas encore de compte ?{' '}
              <button
                onClick={handleSignUpClick}
                className="text-neutral-900 font-medium hover:underline"
                disabled={submissionState.isSubmitting}
              >
                Créer un compte
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );

  // Contenu pour desktop
  const DesktopFormContent = () => (
    <div className="flex h-full">
      {/* Bouton fermer */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white transition-colors"
        disabled={submissionState.isSubmitting}
      >
        <X className="h-6 w-6" />
      </button>

      {/* Colonne gauche - Header */}
      <div className="flex-1 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-8 flex flex-col justify-center">
        <div className="max-w-sm mx-auto text-center">
          <div className="text-3xl font-bold tracking-tight mb-4">
            Bienvenue sur DressCode
          </div>
          
          <p className="text-neutral-300 leading-relaxed mb-8">
            Connectez-vous à votre compte pour accéder à vos favoris, 
            suivre vos commandes et profiter d'une expérience personnalisée.
          </p>

          {/* Illustration ou logo */}
        
        </div>
      </div>

      {/* Colonne droite - Formulaire */}
      <div className="flex-1 bg-white p-8 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full">
          <div className="space-y-6">
            <StatusMessage />
            
            <CustomInput
              label="E-mail"
              type="email"
              placeholder="votre@email.com"
              field="email"
              error={formErrors.email}
              disabled={submissionState.isSubmitting || submissionState.isSuccess}
              required
            />
            
            <CustomInput
              label="Mot de passe"
              type="password"
              placeholder="Votre mot de passe"
              field="password"
              error={formErrors.password}
              disabled={submissionState.isSubmitting || submissionState.isSuccess}
              showPasswordToggle
              required
            />
            
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={submissionState.isSubmitting || submissionState.isSuccess}
            >
              {submissionState.isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Connexion en cours...
                </>
              ) : submissionState.isSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Connecté !
                </>
              ) : (
                'Se connecter'
              )}
            </Button>

            {/* Lien vers inscription */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Vous n'avez pas encore de compte ?{' '}
                <button
                  onClick={handleSignUpClick}
                  className="text-neutral-900 font-medium hover:underline"
                  disabled={submissionState.isSubmitting}
                >
                  Créer un compte
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  // Version mobile avec BottomSheet
  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        snapLevels={[0, 0.25, 0.5, 1]}
        initialLevel={0.7}
        showHandle={true}
        closeOnOverlayClick={!submissionState.isSubmitting}
        maxHeight="90vh"
      >
        <MobileFormContent />
      </BottomSheet>
    );
  }

  // Version desktop avec modal
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
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 h-[500px] overflow-hidden"
        >
          <DesktopFormContent />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;