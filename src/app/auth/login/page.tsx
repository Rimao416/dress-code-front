"use client";
import AuthLayout from "@/components/layouts/AuthLayout";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/formfield";
import Input from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

interface Errors {
  email: string;
  motDePasse: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [motDePasse, setMotDePasse] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({ email: '', motDePasse: '' });
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>): void => {
    e?.preventDefault();
    setLoading(true);

    const newErrors: Errors = { email: '', motDePasse: '' };

    if (!email) {
      newErrors.email = 'L&apos;email est requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format d&apos;email invalide';
    }

    if (!motDePasse) {
      newErrors.motDePasse = 'Le mot de passe est requis';
    } else if (motDePasse.length < 6) {
      newErrors.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.motDePasse) {
      setTimeout(() => {
        console.log('Connexion réussie', { email, motDePasse });
        setLoading(false);
      }, 2000);
    } else {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bienvenue"
      subtitle="à nouveau !"
      description="Connectez-vous pour accéder à votre compte"
      ctaText="Se connecter"
      heroTitle="Fleurs fraîches"
      heroSubtitle="pour toutes les occasions spéciales"
      heroDescription="Découvrez notre collection exclusive de bouquets artisanaux, créés avec passion pour sublimer vos moments les plus précieux."
    >
      <form onSubmit={handleSubmit} className="lg:space-y-5 space-y-4">
        <FormField label="Email" error={errors.email} required>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez votre adresse email"
            error={errors.email}
            required
            className="lg:text-base text-lg lg:py-2 py-3"
          />
        </FormField>

        <FormField label="Mot de passe" error={errors.motDePasse} required>
          <Input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            placeholder="Entrez votre mot de passe"
            error={errors.motDePasse}
            showPasswordToggle
            required
            className="lg:text-base text-lg lg:py-2 py-3"
          />
        </FormField>

        <div className="text-right">
          <a href="#" className="text-sm text-red-800 hover:text-red-900 transition-colors font-medium">
            Mot de passe oublié ?
          </a>
        </div>

        <Button
          onClick={handleSubmit}
          variant="primary"
          loading={loading}
          className="w-full lg:text-base text-lg lg:py-2 py-3 lg:mt-5 mt-6"
          type="submit"
        >
          {loading ? 'Connexion en cours...' : 'Connexion'}
        </Button>
      </form>

      <div className="text-center lg:mt-6 mt-4 lg:pt-0 pt-4 lg:border-0 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          Vous n&apos;avez pas de compte ?{' '}
          <Link href="/auth/register" className="text-red-800 hover:text-red-900 font-semibold transition-colors">
            Créer un compte
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}