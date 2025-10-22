"use client"
import React, { useState } from 'react';
import { FileText, Shield, Scale } from 'lucide-react';

const LegalPage = () => {
  const [activeTab, setActiveTab] = useState('mentions');

  const tabs = [
    {
      id: 'mentions',
      label: 'Mentions légales',
      icon: FileText
    },
    {
      id: 'confidentialite',
      label: 'Politique de confidentialité',
      icon: Shield
    },
    {
      id: 'conditions',
      label: 'Conditions générales',
      icon: Scale
    }
  ];

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-neutral-800/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-serif mb-4">
              Informations
              <span className="text-red-900"> légales</span>
            </h1>
            <p className="text-stone-300 text-lg">
              Transparence et confiance au cœur de notre engagement
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-900/50 to-transparent"></div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-all duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-red-900 text-red-900'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-stone-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 lg:p-12">
          {activeTab === 'mentions' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif text-neutral-900 mb-4">Mentions légales</h2>
                <div className="w-16 h-1 bg-red-900 mb-6"></div>
              </div>

              <div className="space-y-6 text-neutral-700 leading-relaxed">
                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Éditeur du site</h3>
                  <p><strong>Raison sociale :</strong> DressCode</p>
                  <p><strong>Adresse :</strong> 14 rue Émile Zola, 69120 Vaulx-en-Velin, France</p>
                  <p><strong>Téléphone :</strong> 04 78 95 10 07</p>
                  <p><strong>Email :</strong> dresscode69120@yahoo.com</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Directeur de publication</h3>
                  <p>Le directeur de la publication est le représentant légal de DressCode.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Hébergement</h3>
                  <p>Ce site est hébergé par un prestataire d'hébergement professionnel garantissant la sécurité et la disponibilité des données.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Propriété intellectuelle</h3>
                  <p>L'ensemble du contenu de ce site (textes, images, vidéos, logos) est la propriété exclusive de DressCode. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable écrite.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Crédits</h3>
                  <p>Photographies : Banques d'images libres de droits et photographes professionnels.</p>
                  <p>Design et développement : Équipe DressCode.</p>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'confidentialite' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif text-neutral-900 mb-4">Politique de confidentialité</h2>
                <div className="w-16 h-1 bg-red-900 mb-6"></div>
              </div>

              <div className="space-y-6 text-neutral-700 leading-relaxed">
                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Collecte des données</h3>
                  <p>DressCode collecte des données personnelles uniquement lorsque vous passez commande, créez un compte ou nous contactez. Ces données incluent : nom, prénom, adresse email, adresse postale, numéro de téléphone et informations de paiement.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Utilisation des données</h3>
                  <p>Vos données personnelles sont utilisées pour :</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Traiter et livrer vos commandes</li>
                    <li>Gérer votre compte client</li>
                    <li>Vous envoyer des communications marketing (avec votre consentement)</li>
                    <li>Améliorer nos services</li>
                    <li>Respecter nos obligations légales</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Protection des données</h3>
                  <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, perte ou divulgation.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Vos droits</h3>
                  <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition concernant vos données. Pour exercer ces droits, contactez-nous à : dresscode69120@yahoo.com</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Cookies</h3>
                  <p>Notre site utilise des cookies pour améliorer votre expérience de navigation et analyser le trafic. Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Conservation des données</h3>
                  <p>Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, puis archivées conformément aux obligations légales.</p>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'conditions' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif text-neutral-900 mb-4">Conditions générales de vente</h2>
                <div className="w-16 h-1 bg-red-900 mb-6"></div>
              </div>

              <div className="space-y-6 text-neutral-700 leading-relaxed">
                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Article 1 - Objet</h3>
                  <p>Les présentes conditions générales de vente régissent les relations contractuelles entre DressCode et tout client effectuant un achat sur notre site ou en boutique.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Article 2 - Prix</h3>
                  <p>Les prix sont indiqués en euros (€) toutes taxes comprises (TTC). DressCode se réserve le droit de modifier ses prix à tout moment, les produits étant facturés au tarif en vigueur au moment de la validation de la commande.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Article 3 - Commande</h3>
                  <p>Toute commande implique l'acceptation des présentes conditions générales. La validation de votre commande constitue un engagement ferme d'achat. Un email de confirmation vous sera envoyé récapitulant votre commande.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Article 4 - Paiement</h3>
                  <p>Le paiement s'effectue au moment de la commande par carte bancaire, PayPal ou tout autre moyen proposé. Le paiement est sécurisé et crypté. Nous ne conservons aucune information bancaire.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Article 5 - Livraison</h3>
                  <p>Les délais de livraison sont généralement de 3 à 7 jours ouvrés en France métropolitaine. Nous livrons également à l'international avec des délais variables selon la destination. Les frais de port sont calculés en fonction du poids et de la destination.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Article 6 - Droit de rétractation</h3>
                  <p>Conformément à la législation, vous disposez d'un délai de 14 jours pour retourner un article ne vous convenant pas, à condition qu'il soit dans son état d'origine avec étiquettes. Les frais de retour sont à votre charge sauf en cas de produit défectueux.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Article 7 - Garanties</h3>
                  <p>Tous nos produits bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés. En cas de défaut, contactez-nous dans les meilleurs délais pour trouver une solution adaptée.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Article 8 - Responsabilité</h3>
                  <p>DressCode ne saurait être tenue responsable des dommages indirects résultant de l'utilisation de ses produits. Notre responsabilité est limitée au montant de la commande.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Article 9 - Litiges</h3>
                  <p>Tout litige sera soumis en priorité à une tentative de règlement amiable. À défaut, les tribunaux français seront compétents. Vous pouvez également recourir à la médiation de la consommation.</p>
                </section>
              </div>
            </div>
          )}

          {/* Dernière mise à jour */}
          <div className="mt-12 pt-8 border-t border-stone-200">
            <p className="text-sm text-stone-500">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-8 bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-lg p-8 text-white text-center">
          <h3 className="text-xl font-serif mb-2">Des questions ?</h3>
          <p className="text-stone-300 mb-4">Notre équipe est à votre disposition pour répondre à toutes vos interrogations.</p>
          <a 
            href="mailto:dresscode69120@yahoo.com"
            className="inline-flex items-center gap-2 bg-red-900 hover:bg-red-800 text-white px-6 py-3 rounded-md text-sm font-medium transition-all duration-200"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;