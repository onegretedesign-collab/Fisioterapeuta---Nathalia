import React, { useEffect } from 'react';
import { ServiceItem, createWhatsAppUrl } from '../data/services.ts';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose }) => {
  useEffect(() => {
    if (service) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [service, onClose]);

  if (!service) return null;

  const whatsappUrl = createWhatsAppUrl(service.whatsappMessage);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop com blur */}
      <div 
        onClick={onClose} 
        className="modal-backdrop fixed inset-0 transition-opacity duration-300"
      />

      {/* Conteúdo do Modal */}
      <div className="relative bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6 sm:p-8 shadow-2xl z-10 border border-slate-100 transform transition-all">
        
        {/* Botão Fechar */}
        <button 
          onClick={onClose} 
          aria-label="Fechar detalhes do serviço"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* Cabeçalho do Modal */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700 text-2xl shrink-0">
            <i className={service.icon}></i>
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[11px] font-bold uppercase tracking-wide">
              {service.badge}
            </span>
            <h3 id="modal-title" className="text-2xl font-extrabold text-slate-900 mt-1">
              {service.title}
            </h3>
          </div>
        </div>

        {/* Corpo Informativo */}
        <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
          
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-2">
              <i className="fa-solid fa-circle-info text-brand-600"></i> O que é e como funciona
            </h4>
            <p className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700">
              {service.description}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
              <i className="fa-solid fa-heart-pulse text-emerald-600"></i> Benefícios & Indicações
            </h4>
            <ul className="space-y-2">
              {service.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5 shrink-0"></i>
                  <span className="text-slate-700 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-brand-50/70 p-3.5 rounded-xl border border-brand-100">
              <span className="block text-xs text-brand-700 font-semibold">Duração da Sessão</span>
              <span className="text-sm font-bold text-slate-900">{service.duration}</span>
            </div>

            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
              <span className="block text-xs text-emerald-700 font-semibold">Horários</span>
              <span className="text-sm font-bold text-slate-900">A combinar pelo WhatsApp</span>
            </div>
          </div>

        </div>

        {/* Botão Ação Agendar */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <i className="fa-brands fa-whatsapp text-xl"></i>
            <span>Agende Já no WhatsApp</span>
          </a>
          <button 
            onClick={onClose} 
            className="px-5 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
