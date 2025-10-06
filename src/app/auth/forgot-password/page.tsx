"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle, Mail } from "lucide-react";

/* -------------------------------
   Composant enfant : FormContent
-------------------------------- */
interface FormContentProps {
  email: string;
  setEmail: (val: string) => void;
  status: {
    loading: boolean;
    success: boolean;
    error: string;
  };
  handleSubmit: () => void;
}

const FormContent = ({ email, setEmail, status, handleSubmit }: FormContentProps) => {
  return (
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
        <a
          href="/login"
          className="text-sm text-red-900 font-medium hover:underline"
        >
          ← Retour à la connexion
        </a>
      </div>
    </div>
  );
};

/* -------------------------------
   Page principale
-------------------------------- */
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
      >
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
          <FormContent
            email={email}
            setEmail={setEmail}
            status={status}
            handleSubmit={handleSubmit}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
