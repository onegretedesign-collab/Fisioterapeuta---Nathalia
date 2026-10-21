import React, { useState } from 'react';
import { createWhatsAppUrl } from '../data/services.ts';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerWhatsAppUrl = createWhatsAppUrl(
    "Olá, Nathalia! Gostaria de consultar os horários disponíveis para agendamento."
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logotipo / Nome */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group min-w-0 pr-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <i className="fa-solid fa-hands-holding text-lg sm:xl"></i>
            </div>
            <div className="min-w-0">
              <span className="block text-xs sm:text-base md:text-lg font-bold tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors leading-tight">
                Nathalia Guimarães Nolêto
              </span>
              <span className="block text-[10px] sm:text-xs font-semibold text-brand-600 uppercase tracking-wider leading-tight">
                Fisioterapia & Terapias Integrativas
              </span>
            </div>
          </a>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-slate-600">
            <a href="#sobre" className="hover:text-brand-600 transition-colors">Sobre</a>
            <a href="#servicos" className="hover:text-brand-600 transition-colors">Serviços</a>
            <a href="#depoimentos" className="hover:text-brand-600 transition-colors">Depoimentos</a>
            <a href="#planos" className="hover:text-brand-600 transition-colors">Planos & Pacotes</a>
            <a href="#contratos" className="hover:text-brand-600 transition-colors">Garantia Contratual</a>
            <a href="#faq" className="hover:text-brand-600 transition-colors">FAQ</a>
          </nav>

          {/* CTA Direto WhatsApp Topo & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a 
              href={headerWhatsAppUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Agende Já no WhatsApp"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i>
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
          </div>
        )}
      </div>
    </header>
  );
};
