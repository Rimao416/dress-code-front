"use client"
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs } from '@/constant/data';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);


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
<button 
  onClick={() => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }}
  className="bg-neutral-900 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-neutral-800 transition-all duration-200 shadow-sm hover:shadow-md"
>
  Nous contacter
</button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;