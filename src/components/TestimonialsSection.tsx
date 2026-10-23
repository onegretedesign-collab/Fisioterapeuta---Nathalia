import React, { useState } from 'react';
import {
  testimonialsData,
  trustStats,
  filterTestimonials,
  TestimonialItem
} from '../data/testimonials.ts';
import { createWhatsAppUrl } from '../data/services.ts';

interface TestimonialsSectionProps {
  onOpenFirstVisitModal: (planId?: string) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  onOpenFirstVisitModal,
}) => {
  const [activeFilter, setActiveFilter] = useState<
    'todos' | 'pos-cirurgico' | 'coluna-dor' | 'integrativas' | 'planos'
  >('todos');

  const filteredItems = filterTestimonials(testimonialsData, activeFilter);

  const testimonialsWhatsAppUrl = createWhatsAppUrl(
    "Olá, Nathalia! Li os depoimentos no site e gostaria de agendar uma avaliação fisioterapêutica."
  );

  return (
    <section id="depoimentos" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="inline-block px-3.5 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold tracking-wide uppercase">
            Depoimentos Reais & Resultados
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Histórias de quem recuperou a qualidade de vida
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            A satisfação e o bem-estar dos nossos pacientes são o reflexo de um atendimento técnico, individualizado e humanizado em Quirinópolis e região.
          </p>
        </div>

        {/* Trust Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {trustStats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-brand-300 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl shrink-0">
                <i className={stat.icon}></i>
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-700 leading-snug">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  {stat.sublabel}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          <button
            type="button"
            onClick={() => setActiveFilter('todos')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeFilter === 'todos'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Todos ({testimonialsData.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('pos-cirurgico')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeFilter === 'pos-cirurgico'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Pós-Cirúrgico & Traumas
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('coluna-dor')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeFilter === 'coluna-dor'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Dores & Coluna
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('integrativas')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeFilter === 'integrativas'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Terapias Integrativas
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('planos')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeFilter === 'planos'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Planos Contratuais & Domiciliar
          </button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {filteredItems.map((item: TestimonialItem) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header: Stars & Category Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400 text-sm">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
                    {item.categoryLabel}
                  </span>
                </div>

                {/* Treatment Condition */}
                <div className="mb-3">
                  <span className="text-xs font-bold text-brand-700 uppercase tracking-wide block">
                    Tratamento / Condição:
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {item.condition}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-slate-600 text-sm leading-relaxed italic mb-4 relative pl-4 border-l-2 border-brand-300">
                  "{item.quote}"
                </p>

                {/* Clinical Outcome Highlight */}
                <div className="mb-6 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-2 text-xs text-emerald-900 font-medium">
                  <i className="fa-solid fa-circle-check text-emerald-600 mt-0.5 shrink-0"></i>
                  <span>
                    <strong>Resultado:</strong> {item.outcome}
                  </span>
                </div>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-full ${item.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {item.name}
                      {item.age && (
                        <span className="text-xs text-slate-500 font-normal">, {item.age} anos</span>
                      )}
                    </h4>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <i className="fa-solid fa-shield-halved text-[10px]"></i>
                      Paciente Verificado • {item.location}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Social Proof Action Card */}
        <div className="mt-14 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-brand-300 text-xs font-bold uppercase tracking-wider">
              <i className="fa-solid fa-heart-pulse"></i> Sua Saúde em Boas Mãos
            </div>
            <h3 className="text-2xl font-bold">Pronto para dar o primeiro passo rumo a uma vida sem dor?</h3>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Junte-se a centenas de pacientes que recuperaram a mobilidade e o bem-estar com atendimento personalizado, presencial e no conforto da sua casa.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onOpenFirstVisitModal()}
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-clipboard-check"></i>
              <span>Solicitar 1ª Visita</span>
            </button>

            <a
              href={testimonialsWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 text-center"
            >
              <i className="fa-brands fa-whatsapp text-emerald-600 text-lg"></i>
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
