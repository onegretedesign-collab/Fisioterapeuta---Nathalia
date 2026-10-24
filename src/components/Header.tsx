import React, { useState } from 'react';
import { createWhatsAppUrl } from '../data/services.ts';

interface HeaderProps {
  onOpenScheduleDashboard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenScheduleDashboard }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerWhatsAppUrl = createWhatsAppUrl(
    "Olá, Nathalia! Gostaria de consultar os horários disponíveis para agendamento."
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logotipo / Favicon */}
          <a href="#" className="flex items-center group min-w-0" aria-label="Nathalia Guimarães Nolêto - Fisioterapia">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0 border border-slate-200/60 bg-emerald-950">
              <img 
                src="/images/favicon-site-nathalia.png" 
                alt="Logo Nathalia Guimarães Nolêto" 
                className="w-full h-full object-cover"
              />
            </div>
          </a>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium text-slate-600">
            <a href="#sobre" className="hover:text-brand-600 transition-colors">Sobre</a>
            <a href="#servicos" className="hover:text-brand-600 transition-colors">Serviços</a>
            <a href="#depoimentos" className="hover:text-brand-600 transition-colors">Depoimentos</a>
            <a href="#planos" className="hover:text-brand-600 transition-colors">Planos & Pacotes</a>
            <a href="#contratos" className="hover:text-brand-600 transition-colors">Garantia Contratual</a>
            <a href="#faq" className="hover:text-brand-600 transition-colors">FAQ</a>

            {/* Botão de Agendamento da Nathalia após FAQ, no mesmo modelo do WhatsApp só que destacado */}
            <button
              type="button"
              onClick={onOpenScheduleDashboard}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all duration-200 border-2 border-emerald-400 ring-2 ring-emerald-500/20 hover:scale-105 cursor-pointer ml-1"
              title="Painel exclusivo de agendamentos da Dra. Nathalia"
            >
              <i className="fa-solid fa-calendar-check text-emerald-400 text-base"></i>
              <span>Agenda Nathalia</span>
            </button>
          </nav>

          {/* CTA Direto WhatsApp Topo & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botão Agenda no Mobile para acesso rápido com 1 toque */}
            <button
              type="button"
              onClick={onOpenScheduleDashboard}
              className="inline-flex md:hidden items-center gap-1.5 px-3 py-2 rounded-full bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs border border-emerald-400 shadow-sm"
              title="Acessar Agenda da Dra. Nathalia"
            >
              <i className="fa-solid fa-calendar-check text-emerald-400 text-xs"></i>
              <span>Agenda</span>
            </button>

            <a 
              href={headerWhatsAppUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Agende Já no WhatsApp"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-200"
            >
              <i className="fa-brands fa-whatsapp text-base sm:text-lg"></i>
              <span className="hidden sm:inline">Agende Já</span>
            </a>

            {/* Mobile hamburger menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors"
              aria-label="Abrir menu de navegação"
              aria-expanded={mobileMenuOpen}
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 flex flex-col gap-3 text-sm font-medium text-slate-600">
            <a 
              href="#sobre" 
              onClick={() => setMobileMenuOpen(false)} 
              className="px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              Sobre Nathalia
            </a>
            <a 
              href="#servicos" 
              onClick={() => setMobileMenuOpen(false)} 
              className="px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              Serviços Especializados
            </a>
            <a 
              href="#depoimentos" 
              onClick={() => setMobileMenuOpen(false)} 
              className="px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              Depoimentos de Pacientes
            </a>
            <a 
              href="#planos" 
              onClick={() => setMobileMenuOpen(false)} 
              className="px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              Planos & Pacotes
            </a>
            <a 
              href="#contratos" 
              onClick={() => setMobileMenuOpen(false)} 
              className="px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              Garantia Contratual
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)} 
              className="px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              Perguntas Frequentes
            </a>

            {/* Botão de destaque do Painel da Nathalia no menu mobile */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenScheduleDashboard?.();
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm border-2 border-emerald-400 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-calendar-check text-emerald-400 text-base"></i>
                <span>Painel da Nathalia (Agenda & Pacientes)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
