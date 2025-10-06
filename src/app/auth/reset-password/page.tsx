"use client"
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!token) {
      setStatus({
        loading: false,
        success: false,
        error: "Token manquant. Le lien est invalide.",
      });
    }
  }, [token]);

  const validatePassword = (pass: string): string[] => {
    const errors: string[] = [];
    if (pass.length < 8) {
      errors.push("Au moins 8 caractères");
    }
    if (!/[A-Z]/.test(pass)) {
      errors.push("Au moins une majuscule");
    }
    if (!/[a-z]/.test(pass)) {
      errors.push("Au moins une minuscule");
    }
    if (!/[0-9]/.test(pass)) {
      errors.push("Au moins un chiffre");
    }
    return errors;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const errors = validatePassword(value);
    setValidationErrors(errors);
  };

  const handleSubmit = async () => {
    if (!token) {
      return;
    }

    // Validation
    if (!password) {
      setStatus({
        loading: false,
        success: false,
        error: "Veuillez entrer un mot de passe",
      });
      return;
    }

    if (validationErrors.length > 0) {
      setStatus({
        loading: false,
        success: false,
        error: "Le mot de passe ne respecte pas les critères requis",
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({
        loading: false,
        success: false,
        error: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    setStatus({ loading: true, success: false, error: "" });

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la réinitialisation");
      }

      setStatus({ loading: false, success: true, error: "" });
      setTimeout(() => {
        router.push("/");
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

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-serif text-neutral-900 mb-2">
            Lien invalide
          </h1>
          <p className="text-neutral-600 mb-6">
            Ce lien de réinitialisation est invalide ou a expiré.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gradient-to-r from-red-900 to-red-800 text-white px-6 py-3 rounded-md text-sm font-medium hover:shadow-lg transition-all"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-50 flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-900/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-neutral-900/5 rounded-full blur-3xl"></div>

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-900 to-red-800 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
          
          <div className="relative">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-serif text-white mb-2">
              Nouveau mot de passe
            </h1>
            <p className="text-red-100 text-sm">
              Créez un mot de passe sécurisé pour votre compte
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {status.success && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Mot de passe réinitialisé !</p>
                <p className="mt-1 text-green-600">
                  Redirection vers la page de connexion...
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
              {/* Password criteria card */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-red-900" />
                  <span className="text-xs font-medium text-neutral-700 uppercase tracking-wide">
                    Critères de sécurité
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div
                    className={`flex items-center gap-1.5 ${
                      password.length >= 8
                        ? "text-green-600"
                        : "text-neutral-500"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        password.length >= 8 ? "bg-green-600" : "bg-neutral-300"
                      }`}
                    ></div>
                    <span>8 caractères min</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      /[A-Z]/.test(password)
                        ? "text-green-600"
                        : "text-neutral-500"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        /[A-Z]/.test(password) ? "bg-green-600" : "bg-neutral-300"
                      }`}
                    ></div>
                    <span>1 majuscule</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      /[a-z]/.test(password)
                        ? "text-green-600"
                        : "text-neutral-500"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        /[a-z]/.test(password) ? "bg-green-600" : "bg-neutral-300"
                      }`}
                    ></div>
                    <span>1 minuscule</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      /[0-9]/.test(password)
                        ? "text-green-600"
                        : "text-neutral-500"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        /[0-9]/.test(password) ? "bg-green-600" : "bg-neutral-300"
                      }`}
                    ></div>
                    <span>1 chiffre</span>
                  </div>
                </div>
              </div>

              {/* Password input */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-neutral-900">
                  Nouveau mot de passe <span className="text-red-900">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre nouveau mot de passe"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    disabled={status.loading}
                    className="w-full px-4 py-3 border rounded-md text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900 border-stone-300 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password input */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-neutral-900">
                  Confirmer le mot de passe <span className="text-red-900">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmez votre mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={status.loading}
                    className="w-full px-4 py-3 border rounded-md text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900 border-stone-300 disabled:opacity-50"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !status.loading) {
                        handleSubmit();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">
                    Les mots de passe ne correspondent pas
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={status.loading || validationErrors.length > 0 || !password || !confirmPassword || password !== confirmPassword}
                className="w-full bg-gradient-to-r from-red-900 to-red-800 text-white px-6 py-3.5 rounded-md text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {status.loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Réinitialisation en cours...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Réinitialiser le mot de passe
                  </>
                )}
              </button>

              {/* Back to login */}
              <div className="text-center pt-2">
                <button
                  onClick={() => router.push("/")}
                  className="text-sm text-neutral-600 hover:text-red-900 transition-colors"
                  disabled={status.loading}
                >
                  ← Retour à l'accueil
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;