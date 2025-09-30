"use client"
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Quels sont les délais de livraison pour mes commandes ?",
      answer: "Nous livrons partout dans le monde sous 3 à 7 jours ouvrables. Pour les commandes en France métropolitaine, la livraison standard prend 2-4 jours. Nous proposons également une option de livraison express en 24-48h pour les articles disponibles en stock."
    },
    {
      question: "Puis-je retourner un article si la taille ne convient pas ?",
      answer: "Absolument ! Vous disposez de 30 jours pour retourner tout article qui ne vous convient pas. Le retour est gratuit et simple : commandez votre étiquette de retour depuis votre compte, et nous vous remboursons intégralement dès réception. Assurez-vous que l'article soit dans son état d'origine avec ses étiquettes."
    },
    {
      question: "Comment puis-je suivre l'évolution de ma commande ?",
      answer: "Dès l'expédition de votre commande, vous recevrez un email avec un numéro de suivi. Vous pouvez également consulter l'état de votre commande directement depuis votre espace client. Nos 2000+ clients satisfaits apprécient notre transparence totale sur le suivi des colis."
    },
    {
      question: "Proposez-vous des offres spéciales ou des promotions régulières ?",
      answer: "Oui ! Consultez notre section 'Offres spéciales' mise à jour régulièrement avec des réductions jusqu'à -30% sur une sélection de produits. Inscrivez-vous à notre newsletter pour être informé en avant-première de nos ventes privées et de nos nouvelles collections comme notre Collection Automne 2025."
    },
    {
      question: "Quelles sont vos marques disponibles et comment garantissez-vous leur qualité ?",
      answer: "Nous travaillons avec des marques prestigieuses comme Maison Laurent, Bijoux Chic, Luxe Paris et Chaussures Royale. Chaque article de nos 130+ produits disponibles est soigneusement sélectionné pour son élégance intemporelle et sa qualité exceptionnelle. Nous garantissons l'authenticité de toutes nos pièces."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-white to-stone-50">
      <div className="max-w-4xl mx-auto px-6">
        {/* En-tête */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-red-900/5 px-3 py-1.5 rounded-full mb-2">
            <span className="text-xs text-red-900 font-medium tracking-wide">AIDE & SUPPORT</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-serif text-neutral-900 leading-tight">
            Questions fréquentes
          </h2>
          <p className="text-sm text-neutral-600 max-w-2xl mx-auto">
            Vous avez des questions ? Nous avons les réponses. Découvrez tout ce que vous devez savoir sur nos produits et services.
          </p>
        </div>

        {/* Liste des FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-stone-50/50 transition-colors duration-200"
                aria-expanded={openIndex === index}
              >
                <span className="text-base font-medium text-neutral-900 pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-neutral-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 pt-2">
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA de contact */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-stone-100 to-stone-50 rounded-lg border border-stone-200">
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            Vous ne trouvez pas votre réponse ?
          </h3>
          <p className="text-sm text-neutral-600 mb-4">
            Notre équipe est là pour vous aider. Contactez-nous et nous vous répondrons dans les plus brefs délais.
          </p>
          <button className="bg-neutral-900 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-neutral-800 transition-all duration-200 shadow-sm hover:shadow-md">
            Nous contacter
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;