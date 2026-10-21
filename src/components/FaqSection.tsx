import React, { useState } from 'react';
import { faqData } from '../data/faq.ts';

export const FaqSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<number[]>([]);

  const toggleFaq = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="faq" className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            Tire suas Dúvidas
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">Perguntas Frequentes</h2>
        </div>

        <div className="space-y-4">
          {faqData.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-shadow duration-200 hover:shadow-sm"
              >
                <button 
                  type="button"
                  onClick={() => toggleFaq(item.id)} 
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:text-brand-700 transition-colors cursor-pointer"
                >
                  <span className="pr-4">{item.question}</span>
                  <i 
                    className={`fa-solid fa-chevron-down text-slate-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
