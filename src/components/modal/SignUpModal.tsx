import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { X, Loader2, CheckCircle, AlertCircle, EyeOff, Eye } from "lucide-react";

// Types
interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

interface SubmissionState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

const SignUpModal = ({ isOpen, onClose, onSuccess, onSwitchToLogin }: SignUpModalProps) => {
  const formDataRef = useRef<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [, forceUpdate] = useState({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitting: false,
    isSuccess: false,
    error: null
  });
  const [isMobile, setIsMobile] = useState(false);

  const checkIsMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [checkIsMobile]);

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
      forceUpdate({});
    }
  }, [isOpen]);

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    formDataRef.current = {
      ...formDataRef.current,
      [field]: value
    };
    
    setFormErrors(prev => {
      if (prev[field]) {
        return {
          ...prev,
          [field]: undefined
        };
      }
      return prev;
    });
    
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
      errors.email = "L'email est requis";
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmissionState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSubmissionState({
        isSubmitting: false,
        isSuccess: true,
        error: null
      });

      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (error) {
      setSubmissionState({
        isSubmitting: false,
        isSuccess: false,
        error: "Une erreur inattendue est survenue. Veuillez réessayer."
      });
    }
  };

  const handleLoginClick = () => {
    onClose();
    onSwitchToLogin?.();
  };

  const StatusMessage = () => {
    if (submissionState.isSuccess) {
      return (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
          <CheckCircle className="h-4 w-4" />
          <span>Inscription réussie ! Bienvenue chez DressCode !</span>
        </div>
      );
    }

    if (submissionState.error) {
      return (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{submissionState.error}</span>
        </div>
      );
    }

    return null;
  };

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
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-900">
          {label} {required && <span className="text-red-900">*</span>}
        </label>
        <div className="relative">
          <input
            type={inputType}
            placeholder={placeholder}
            value={localValue}
            onChange={handleChange}
            disabled={disabled}
            className={`
              w-full px-4 py-3 border rounded-md text-sm transition-all
              focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900
              ${error
                ? 'border-red-600 focus:ring-red-900/30'
                : 'border-stone-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed bg-stone-50' : 'bg-white'}
            `}
          />
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  };

  const FormContent = () => (
    <div className="space-y-6">
      <StatusMessage />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
        placeholder="votre.email@exemple.com"
        field="email"
        error={formErrors.email}
        disabled={submissionState.isSubmitting || submissionState.isSuccess}
        required
      />
      
      <CustomInput
        label="Mot de passe"
        type="password"
        placeholder="Créez un mot de passe"
        field="password"
        error={formErrors.password}
        disabled={submissionState.isSubmitting || submissionState.isSuccess}
        showPasswordToggle
        required
      />
      
      <div className="space-y-3 pt-2">
        <p className="text-xs text-neutral-500 leading-relaxed">
          Les mots de passe doivent contenir au moins 8 caractères et être difficiles à deviner - les mots de passe couramment utilisés ou risqués ne sont pas autorisés.
        </p>
        <p className="text-xs text-neutral-500 leading-relaxed">
          En créant un compte, j'accepte les{' '}
          <a href="#" className="text-red-900 hover:underline font-medium">
            Conditions d'utilisation
          </a>
          . J'ai lu la{' '}
          <a href="#" className="text-red-900 hover:underline font-medium">
            Politique de confidentialité
          </a>
          .
        </p>
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={submissionState.isSubmitting || submissionState.isSuccess}
        className="w-full bg-gradient-to-r from-red-900 to-red-800 text-white px-6 py-3.5 rounded-md text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        {submissionState.isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Inscription en cours...
          </>
        ) : submissionState.isSuccess ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Inscription réussie !
          </>
        ) : (
          'Créer un compte'
        )}
      </button>

      <div className="text-center pt-4 border-t border-stone-200/60">
        <p className="text-sm text-neutral-600">
          Vous avez déjà un compte ?{' '}
          <button
            onClick={handleLoginClick}
            className="text-red-900 font-medium hover:underline"
            disabled={submissionState.isSubmitting}
          >
            Connectez-vous
          </button>
        </p>
      </div>
    </div>
  );

  const DesktopContent = () => (
    <div className="flex h-full relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-neutral-400 hover:text-neutral-900 transition-colors"
        disabled={submissionState.isSubmitting}
      >
        <X className="h-6 w-6" />
      </button>

      {/* Colonne gauche - Header */}
      <div className="flex-1 bg-gradient-to-br from-stone-50 to-stone-100 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neutral-900/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-md mx-auto space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl lg:text-5xl font-serif text-neutral-900 leading-tight">
              DressCode
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-px bg-red-900"></div>
              <h3 className="text-lg font-medium tracking-widest text-red-900 uppercase">
                Inscription
              </h3>
            </div>
          </div>
         
          <p className="text-neutral-600 leading-relaxed text-base">
            Bienvenue parmi nous ! Nous sommes ravis de vous avoir à bord. Profitez
            dès maintenant de notre service de livraison gratuite sur toutes vos
            commandes, d'un cadeau spécial pour votre anniversaire, ainsi que d'un
            accès privilégié aux nouveaux produits et à leurs exclusivités.
          </p>

          <div className="pt-6">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-stone-200/50">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">NEW</span>
              </div>
              <span className="text-xs text-neutral-700 font-medium tracking-wide">Rejoignez notre communauté</span>
            </div>
          </div>
        </div>
      </div>

      {/* Colonne droite - Formulaire */}
      <div className="flex-1 bg-white p-8 lg:p-10 overflow-y-auto border-l border-stone-200/50">
        <div className="h-full flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <FormContent />
          </div>
        </div>
      </div>
    </div>
  );

  const MobileContent = () => (
    <div className="bg-white rounded-t-3xl overflow-hidden max-h-[90vh] overflow-y-auto">
      <div className="relative bg-gradient-to-br from-stone-50 to-stone-100 text-neutral-900 p-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors"
          disabled={submissionState.isSubmitting}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-3 pt-2">
          <h2 className="text-3xl font-serif text-neutral-900">
            DressCode
          </h2>
          <div className="flex items-center gap-2 justify-center">
            <div className="w-8 h-px bg-red-900"></div>
            <h3 className="text-sm font-medium tracking-widest text-red-900 uppercase">
              Inscription
            </h3>
            <div className="w-8 h-px bg-red-900"></div>
          </div>
        </div>
        
        <p className="text-sm text-neutral-600 leading-relaxed mt-4">
          Créez votre compte pour profiter d'avantages exclusifs et d'une expérience shopping personnalisée.
        </p>
      </div>

      <div className="p-6 pb-8">
        <FormContent />
      </div>
    </div>
  );

  if (!isOpen) return null;

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={submissionState.isSubmitting ? undefined : onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full"
        >
          <MobileContent />
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={submissionState.isSubmitting ? undefined : onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[650px] overflow-hidden"
        >
          <DesktopContent />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SignUpModal;