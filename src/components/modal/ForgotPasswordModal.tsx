import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Loader2, CheckCircle, AlertCircle, Mail } from "lucide-react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin?: () => void;
}

const ForgotPasswordModal = ({
  isOpen,
  onClose,
  onBackToLogin,
}: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setStatus({ loading: false, success: false, error: "" });
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setStatus({
        loading: false,
        success: false,
        error: "Veuillez entrer votre adresse email",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setStatus({
        loading: false,
        success: false,
        error: "Veuillez entrer une adresse email valide",
      });
      return;
    }

    setStatus({ loading: true, success: false, error: "" });

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setStatus({ loading: false, success: true, error: "" });
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue",
      });
    }
  };

  if (!isOpen) return null;

  const FormContent = () => (
    <div className="space-y-6">
      {status.success && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Email envoyé !</p>
            <p className="mt-1 text-green-600">
              Si cet email existe dans notre base, vous recevrez un lien de
              réinitialisation dans quelques minutes.
            </p>
          </div>
        </div>
      )}

      {status.error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{status.error}</span>
        </div>
      )}

      {!status.success && (
        <>
          <div className="space-y-2">
            <p className="text-sm text-neutral-600">
              Entrez votre adresse email et nous vous enverrons un lien pour
              réinitialiser votre mot de passe.
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-neutral-900">
              E-mail <span className="text-red-900">*</span>
            </label>
            <input
              type="email"
              placeholder="votre.email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status.loading}
              className="w-full px-4 py-3 border rounded-md text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900 border-stone-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !status.loading) {
                  handleSubmit();
                }
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={status.loading}
            className="w-full bg-gradient-to-r from-red-900 to-red-800 text-white px-6 py-3.5 rounded-md text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {status.loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Envoyer le lien
              </>
            )}
          </button>
        </>
      )}

      <div className="text-center pt-4 border-t border-stone-200/60">
        <button
          onClick={() => {
            onClose();
            onBackToLogin?.();
          }}
          className="text-sm text-red-900 font-medium hover:underline"
          disabled={status.loading}
        >
          ← Retour à la connexion
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={status.loading ? undefined : onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full"
        >
          <div className="bg-white rounded-t-3xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="relative bg-gradient-to-br from-stone-50 to-stone-100 p-6 text-center">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900"
                disabled={status.loading}
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-3xl font-serif text-neutral-900 pt-2">
                DressCode
              </h2>
              <div className="flex items-center gap-2 justify-center mt-3">
                <div className="w-8 h-px bg-red-900"></div>
                <h3 className="text-sm font-medium tracking-widest text-red-900 uppercase">
                  Mot de passe oublié
                </h3>
                <div className="w-8 h-px bg-red-900"></div>
              </div>
            </div>
            <div className="p-6 pb-8">
              <FormContent />
            </div>
          </div>
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
          onClick={status.loading ? undefined : onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-neutral-400 hover:text-neutral-900"
            disabled={status.loading}
          >
            <X className="h-6 w-6" />
          </button>

          <div className="bg-gradient-to-br from-stone-50 to-stone-100 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-900 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-serif text-neutral-900">
              Mot de passe oublié ?
            </h2>
            <p className="text-sm text-neutral-600 mt-2">
              Pas de souci, on va vous aider
            </p>
          </div>

          <div className="p-8">
            <FormContent />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;