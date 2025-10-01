import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Loader2, CheckCircle, AlertCircle, EyeOff, Eye } from "lucide-react";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const CustomInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled,
  required,
  showPasswordToggle = false,
  error,
}: any) => {
  const [show, setShow] = useState(false);
  const inputType = type === "password" && show ? "text" : type;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-neutral-900">
        {label} {required && <span className="text-red-900">*</span>}
      </label>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-3 border rounded-md text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900 border-stone-300 ${
            disabled
              ? "opacity-50 cursor-not-allowed bg-stone-50"
              : "bg-white"
          } ${error ? "border-red-500" : ""}`}
        />
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900"
          >
            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
};

type FormContentProps = {
  form: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  update: (field: string, value: string) => void;
  status: { loading: boolean; success: boolean; error: string };
  fieldErrors: Record<string, string>;
  submit: () => void;
  onClose: () => void;
  onSwitchToLogin?: () => void;
};

function FormContent({
  form,
  update,
  status,
  fieldErrors,
  submit,
  onClose,
  onSwitchToLogin,
}: FormContentProps) {
  return (
    <div className="space-y-6">
      {status.success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
          <CheckCircle className="h-4 w-4" />
          <span>Inscription réussie ! Bienvenue chez DressCode !</span>
        </div>
      )}

      {status.error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{status.error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CustomInput
          label="Prénom"
          placeholder="Votre prénom"
          value={form.firstName}
          onChange={(v: string) => update("firstName", v)}
          disabled={status.loading || status.success}
          required
          error={fieldErrors.firstName}
        />
        <CustomInput
          label="Nom"
          placeholder="Votre nom"
          value={form.lastName}
          onChange={(v: string) => update("lastName", v)}
          disabled={status.loading || status.success}
          required
          error={fieldErrors.lastName}
        />
      </div>

      <CustomInput
        label="E-mail"
        type="email"
        placeholder="votre.email@exemple.com"
        value={form.email}
        onChange={(v: string) => update("email", v)}
        disabled={status.loading || status.success}
        required
        error={fieldErrors.email}
      />

      <CustomInput
        label="Mot de passe"
        type="password"
        placeholder="Créez un mot de passe"
        value={form.password}
        onChange={(v: string) => update("password", v)}
        disabled={status.loading || status.success}
        showPasswordToggle
        required
        error={fieldErrors.password}
      />

      <CustomInput
        label="Confirmer le mot de passe"
        type="password"
        placeholder="Confirmez votre mot de passe"
        value={form.confirmPassword}
        onChange={(v: string) => update("confirmPassword", v)}
        disabled={status.loading || status.success}
        showPasswordToggle
        required
        error={fieldErrors.confirmPassword}
      />

      <div className="space-y-3 pt-2">
        <p className="text-xs text-neutral-500">
          Les mots de passe doivent contenir au moins 8 caractères et être
          difficiles à deviner.
        </p>
        <p className="text-xs text-neutral-500">
          En créant un compte, j'accepte les{" "}
          <a
            href="#"
            className="text-red-900 hover:underline font-medium"
          >
            Conditions d'utilisation
          </a>
          . J'ai lu la{" "}
          <a
            href="#"
            className="text-red-900 hover:underline font-medium"
          >
            Politique de confidentialité
          </a>
          .
        </p>
      </div>

      <button
        onClick={submit}
        disabled={status.loading || status.success}
        className="w-full bg-gradient-to-r from-red-900 to-red-800 text-white px-6 py-3.5 rounded-md text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        {status.loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Inscription en cours...
          </>
        ) : status.success ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Inscription réussie !
          </>
        ) : (
          "Créer un compte"
        )}
      </button>

      <div className="text-center pt-4 border-t border-stone-200/60">
        <p className="text-sm text-neutral-600">
          Vous avez déjà un compte ?{" "}
          <button
            onClick={() => {
              onClose();
              onSwitchToLogin?.();
            }}
            className="text-red-900 font-medium hover:underline"
            disabled={status.loading}
          >
            Connectez-vous
          </button>
        </p>
      </div>
    </div>
  );
}

const SignUpModal = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToLogin,
}: SignUpModalProps) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setStatus({ loading: false, success: false, error: "" });
      setFieldErrors({});
    }
  }, [isOpen]);

  const update = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: "" });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!form.firstName.trim()) {
      errors.firstName = "Le prénom est requis";
    }
    if (!form.lastName.trim()) {
      errors.lastName = "Le nom est requis";
    }
    if (!form.email.trim()) {
      errors.email = "L'email est requis";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        errors.email = "Veuillez entrer une adresse email valide";
      }
    }
    if (!form.password) {
      errors.password = "Le mot de passe est requis";
    } else if (form.password.length < 8) {
      errors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (!form.confirmPassword) {
      errors.confirmPassword = "Veuillez confirmer votre mot de passe";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    return errors;
  };

  const submit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setStatus({ loading: true, success: false, error: "" });

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur d'inscription");
      }

      setStatus({ loading: false, success: true, error: "" });
      setTimeout(() => {
        onSuccess?.();
        setTimeout(onClose, 500);
      }, 1500);
    } catch (err: any) {
      setStatus({
        loading: false,
        success: false,
        error: err.message || "Une erreur est survenue",
      });
    }
  };

  if (!isOpen) return null;

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
                  Inscription
                </h3>
                <div className="w-8 h-px bg-red-900"></div>
              </div>
              <p className="text-sm text-neutral-600 mt-4">
                Créez votre compte pour profiter d'avantages exclusifs.
              </p>
            </div>
            <div className="p-6 pb-8">
              <FormContent
                form={form}
                update={update}
                status={status}
                fieldErrors={fieldErrors}
                submit={submit}
                onClose={onClose}
                onSwitchToLogin={onSwitchToLogin}
              />
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
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[650px] overflow-hidden"
        >
          <div className="flex h-full relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-neutral-400 hover:text-neutral-900"
              disabled={status.loading}
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex-1 bg-gradient-to-br from-stone-50 to-stone-100 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-neutral-900/5 rounded-full blur-3xl"></div>

              <div className="relative max-w-md mx-auto space-y-8">
                <div className="space-y-3">
                  <h2 className="text-4xl lg:text-5xl font-serif text-neutral-900">
                    DressCode
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-px bg-red-900"></div>
                    <h3 className="text-lg font-medium tracking-widest text-red-900 uppercase">
                      Inscription
                    </h3>
                  </div>
                </div>
                <p className="text-neutral-600 text-base">
                  Bienvenue parmi nous ! Profitez de notre livraison gratuite,
                  d'un cadeau pour votre anniversaire, et d'un accès privilégié
                  aux nouveautés.
                </p>
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-stone-200/50">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">NEW</span>
                  </div>
                  <span className="text-xs text-neutral-700 font-medium">
                    Rejoignez notre communauté
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white p-8 lg:p-10 overflow-y-auto border-l border-stone-200/50">
              <div className="h-full flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                  <FormContent
                    form={form}
                    update={update}
                    status={status}
                    fieldErrors={fieldErrors}
                    submit={submit}
                    onClose={onClose}
                    onSwitchToLogin={onSwitchToLogin}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SignUpModal;
