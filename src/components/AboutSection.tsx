import React from 'react';
import { doctorProfileData } from '../data/doctorProfile.ts';
import { createWhatsAppUrl } from '../data/services.ts';

interface AboutSectionProps {
  onOpenFirstVisitModal: (planId?: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenFirstVisitModal }) => {
  const directDoctorWhatsAppUrl = createWhatsAppUrl(
    "Olá, Nathalia! Visitei seu site e gostaria de agendar uma consulta / avaliação com você."
  );

  return (
    <section id="sobre" className="py-20 bg-gradient-to-b from-white via-brand-50/20 to-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="inline-block px-3.5 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold tracking-wide uppercase">
            Sobre Nathalia Guimarães Nolêto
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cuidado profissional, técnica apurada e olhar humanizado
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Conheça a profissional por trás dos tratamentos que transformam limitações e dores em movimento, autonomia e bem-estar.
          </p>
        </div>

        {/* Frase de Nathalia Centralizada */}
        <div className="mb-12 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-brand-50/70 via-white to-brand-50/40 border border-brand-200/80 shadow-sm relative overflow-hidden text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-100 text-brand-700 text-xl shadow-xs mx-auto">
              <i className="fa-solid fa-quote-left"></i>
            </div>
            <blockquote className="text-slate-700 text-base sm:text-lg lg:text-xl italic font-serif leading-relaxed">
              "{doctorProfileData.quote}"
            </blockquote>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-900">
              — {doctorProfileData.name}
            </p>
          </div>
        </div>

        {/* Two-Column Optimized Grid: Narrative + Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Biography & Qualifications (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Biography Narrative Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold">
                  <i className="fa-solid fa-user-doctor"></i>
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Trajetória & Filosofia Clínica
                </h4>
              </div>

              <div className="space-y-3.5 text-slate-600 text-sm sm:text-[15px] leading-relaxed">
                {doctorProfileData.bioParagraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Qualifications & Specializations */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
                  <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Qualificações & Especializações
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {doctorProfileData.credentials.map((cred, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-semibold hover:border-brand-300 transition-colors"
                  >
                    <i className={`${cred.icon} text-brand-600 text-sm shrink-0`}></i>
                    <span>{cred.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: 4 Pillars & Direct Action Card (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 4 Pillars Grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Pilares do Nosso Atendimento
                  </h4>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  4 Princípios Clínicos
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {doctorProfileData.pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-brand-50/40 hover:border-brand-200 transition-all space-y-1.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center text-xs shrink-0">
                        <i className={pillar.icon}></i>
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {pillar.title}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed pl-9">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Action Card (CTA) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-teal-900 text-white shadow-lg space-y-5">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-white text-[11px] font-bold uppercase tracking-wider">
                  Agendamento Personalizado
                </span>
                <h4 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                  Pronto para iniciar seu tratamento?
                </h4>
                <p className="text-xs sm:text-sm text-brand-100 mt-1">
                  Atendimento com horário combinado, rigor técnico e foco na eliminação definitiva da dor.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenFirstVisitModal()}
                  className="flex-1 py-3.5 px-5 rounded-xl bg-white hover:bg-brand-50 text-brand-900 font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-calendar-check text-brand-700"></i>
                  <span>Solicitar 1ª Visita</span>
                </button>

                <a
                  href={directDoctorWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <i className="fa-brands fa-whatsapp text-lg"></i>
                  <span>WhatsApp Direto</span>
                </a>
              </div>

              <p className="text-[11px] text-brand-200/80 text-center flex items-center justify-center gap-1.5">
                <i className="fa-solid fa-shield-halved text-emerald-400"></i>
                <span>Garantia de atendimento individualizado e segurança contratual</span>
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
