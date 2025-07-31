import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Gift, Truck, Crown } from "lucide-react";
import Input from "../ui/input";
import Button from "../ui/button";
import BottomSheet from "../common/BottomSheet";

// Types pour les props du composant
interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Type pour les données du formulaire
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthdayGift: boolean;
}

// Type pour les erreurs
interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

// Modal d'inscription
const SignUpModal = ({ isOpen, onClose }: SignUpModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthdayGift: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
   
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
   
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
   
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
   
    if (!formData.password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
   
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      onClose();
    }
  };

  // Contenu du formulaire pour mobile (inchangé)
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
          <Input
            label="Prénom"
            placeholder="Votre prénom"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            error={errors.firstName}
            required
          />
         
          <Input
            label="Nom"
            placeholder="Votre nom"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            error={errors.lastName}
            required
          />
         
          <Input
            label="E-mail"
            type="email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            required
          />
         
          <Input
            label="Mot de passe"
            type="password"
            placeholder="Votre mot de passe"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
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
          >
            S'inscrire maintenant
          </Button>
         
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </div>
      </div>
    </>
  );

  // Nouveau contenu pour desktop avec disposition en colonnes
  const DesktopFormContent = () => (
    <div className="flex h-full">
      {/* Bouton fermer */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white transition-colors"
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
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                placeholder="Votre prénom"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={errors.firstName}
                required
              />
             
              <Input
                label="Nom"
                placeholder="Votre nom"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={errors.lastName}
                required
              />
            </div>
           
            <Input
              label="E-mail"
              type="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              required
            />
           
            <Input
              label="Mot de passe"
              type="password"
              placeholder="Votre mot de passe"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              showPasswordToggle
              required
            />
           
            <div className="text-xs text-gray-500 leading-relaxed">
              Les mots de passe doivent contenir au moins 8 caractères et être difficiles à deviner.
            </div>
           
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="birthday-desktop"
                checked={formData.birthdayGift}
                onChange={(e) => handleInputChange('birthdayGift', e.target.checked)}
                className="mt-1 w-4 h-4 text-red-700 border-gray-300 rounded focus:ring-red-700"
              />
              <label htmlFor="birthday-desktop" className="text-sm text-gray-700">
                <span className="font-medium">Surprise d'anniversaire (facultatif)</span>
                <br />
                <span className="text-gray-500">Nous aimerions vous offrir quelque chose de spécial pour votre anniversaire.</span>
              </label>
            </div>
           
            <Button
              variant="primary"
              size="lg"
              className="w-full mt-6"
              onClick={handleSubmit}
            >
              S'inscrire maintenant
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
        snapLevels={[0,0.25,0.5, 1]}
        initialLevel={0.85}
        showHandle={true}
        closeOnOverlayClick={true}
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
          onClick={onClose}
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