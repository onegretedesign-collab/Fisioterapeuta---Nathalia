import React from 'react';
import { createWhatsAppUrl, PHONE_DISPLAY } from '../data/services.ts';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const footerWhatsAppUrl = createWhatsAppUrl(
    "Olá, Nathalia! Gostaria de agendar um horário."
  );

  return (
    <footer className="mt-auto bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Identificação */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <i className="fa-solid fa-hands-holding"></i>
              </div>
              <div>
                <p className="text-white font-bold">Nathalia Guimarães Nolêto</p>
                <p className="text-xs text-brand-400">Fisioterapeuta</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reabilitação especializada, pós-cirúrgicos, alívio de dores ocupacionais e tratamentos integrativos com compromisso ético e atenção integral ao paciente.
            </p>
          </div>

          {/* Atendimento & Horários */}
          <div className="space-y-2">
            <p className="text-white font-semibold text-sm uppercase tracking-wider">Agendamento & Horários</p>
            <p className="text-xs text-slate-300">
              <i className="fa-solid fa-calendar-check text-emerald-400 mr-2"></i>
              <strong>Horários a combinar</strong> diretamente pelo WhatsApp.
            </p>
            <p className="text-xs text-slate-300">
              <i className="fa-solid fa-phone text-emerald-400 mr-2"></i>
              {PHONE_DISPLAY}
            </p>
            <p className="text-xs text-slate-300">
              <i className="fa-solid fa-location-dot text-emerald-400 mr-2"></i>
              Atendimento com hora marcada
            </p>
          </div>

          {/* Ação Direta */}
          <div className="space-y-3">
            <p className="text-white font-semibold text-sm uppercase tracking-wider">Fale Conosco</p>
            <a 
              href={footerWhatsAppUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i>
              <span>Iniciar Conversa no WhatsApp</span>
            </a>
            <p className="text-[11px] text-slate-500">
              Tempo médio de resposta rápido dentro do horário comercial.
            </p>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          &copy; {currentYear} Nathalia Guimarães Nolêto. Todos os direitos reservados. Fisioterapia & Terapias Integrativas.
        </div>
      </div>
    </footer>
  );
};
