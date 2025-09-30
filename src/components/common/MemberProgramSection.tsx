"use client"
import React, { useState } from 'react';
import { Eye, EyeOff, Percent, Truck } from 'lucide-react';

const MemberProgramSection = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-stone-50 to-stone-100 overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-neutral-900/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Colonne gauche - Informations */}
          <div className="space-y-8">
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
              accès privilégié aux nouveaux produits et à leurs exclusivités. Comme
              vos jeans, vous verrez que les avantages deviennent encore meilleurs avec
              le temps !
            </p>
            
          </div>
          
          {/* Colonne droite - Formulaire */}
          <div className="bg-white p-8 lg:p-10 rounded-lg shadow-xl border border-stone-200/50">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-900">
                    Prénom <span className="text-red-900">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Votre prénom"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900 transition-all"
                  />
                  {formErrors.firstName && (
                    <p className="text-xs text-red-600">{formErrors.firstName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-900">
                    Nom <span className="text-red-900">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900 transition-all"
                  />
                  {formErrors.lastName && (
                    <p className="text-xs text-red-600">{formErrors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-900">
                  E-mail <span className="text-red-900">*</span>
                </label>
                <input
                  type="email"
                  placeholder="votre.email@exemple.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900 transition-all"
                />
                {formErrors.email && (
                  <p className="text-xs text-red-600">{formErrors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-900">
                  Mot de passe <span className="text-red-900">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Créez un mot de passe"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-xs text-red-600">{formErrors.password}</p>
                )}
              </div>
              
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
                className="w-full bg-gradient-to-r from-red-900 to-red-800 text-white px-6 py-3.5 rounded-md text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                Créer un compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberProgramSection;