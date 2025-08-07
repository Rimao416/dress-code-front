// Imports mis à jour pour utiliser les types unifiés
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { X, Gift, Truck, Crown, Loader2, CheckCircle, AlertCircle, EyeOff, Eye } from "lucide-react";
import Button from "../ui/button";
import BottomSheet from "../common/BottomSheet";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import {FormErrors, SubmissionState} from "@/types/auth.type";

// Types pour les props du composant
interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Type pour les données du formulaire
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Modal d'inscription
const SignUpModal = ({ isOpen, onClose, onSuccess }: SignUpModalProps) => {
  const { setLoading, user, setUser } = useAuth();
 
  // Utilisation de useRef pour éviter les re-renders excessifs
  const formDataRef = useRef<FormData>({
    firstName: '',
    lastName: '',
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
        firstName: '',
        lastName: '',
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

  // Fonction pour gérer les changements d'input - VERSION OPTIMISÉE
  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    console.log(`Changing ${field} to:`, value);
   
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

    if (!formData.firstName.trim()) {
      errors.firstName = 'Le prénom est requis';
      hasErrors = true;
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Le nom est requis';
      hasErrors = true;
    }

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
    } else if (formData.password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
      hasErrors = true;
    }

    setFormErrors(errors);
    return !hasErrors;
  };

// Extrait de la fonction handleSubmit corrigée
 const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmissionState(prev => ({ ...prev, isSubmitting: true, error: null }));
    setLoading(true);

    try {
      const formData = formDataRef.current;
     
      // Préparer les données pour l'inscription
      const registrationData = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      const response = await authService.register(registrationData);
      console.log(response)

      if (response.success && response.data) {
        // ✅ CORRIGÉ: Accéder à l'utilisateur via response.data.user avec les bons types
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
        }, 2000);
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
  };

  // Composant pour afficher les messages de statut
  const StatusMessage = () => {
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
  };

  // Composant Input personnalisé pour éviter les conflits
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
    field: keyof FormData;
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
          
          <CustomInput
            label="Prénom"
            placeholder="Votre prénom"
            field="firstName"
            error={formErrors.firstName}
            disabled={submissionState.isSubmitting || submissionState.isSuccess}
            required
          />
          
          <CustomInput
            label="Nom"
            placeholder="Votre nom"
            field="lastName"
            error={formErrors.lastName}
            disabled={submissionState.isSubmitting || submissionState.isSuccess}
            required
          />
          
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
  );

  // Contenu pour desktop avec disposition en colonnes
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
              <CustomInput
                label="Prénom"
                placeholder="Votre prénom"
                field="firstName"
                error={formErrors.firstName}
                disabled={submissionState.isSubmitting || submissionState.isSuccess}
                required
              />
              
              <CustomInput
                label="Nom"
                placeholder="Votre nom"
                field="lastName"
                error={formErrors.lastName}
                disabled={submissionState.isSubmitting || submissionState.isSuccess}
                required
              />
            </div>
            
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
  );

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