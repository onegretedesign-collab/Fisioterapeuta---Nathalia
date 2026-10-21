import React from 'react';
import { servicesData, ServiceItem, createWhatsAppUrl } from '../data/services.ts';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  return (
    <section id="servicos" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-block px-3.5 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold tracking-wide uppercase">
            Especialidades Clínicas
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cuidado especializado para cada necessidade
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Clique no serviço desejado para conferir todos os detalhes do procedimento, tempo estimado de sessão e agendar seu horário.
          </p>
        </div>

        {/* Grid de 6 Serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <div 
              key={service.id}
              className="bg-white rounded-3xl p-7 border border-slate-200/90 hover:border-brand-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 group-hover:bg-brand-500 text-brand-600 group-hover:text-white flex items-center justify-center text-2xl transition-colors duration-300 shadow-sm">
                    <i className={service.icon}></i>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    {service.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-slate-600 mt-2.5 leading-relaxed line-clamp-3">
                  {service.cardBrief}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                <button 
                  type="button"
                  onClick={() => onSelectService(service)} 
                  aria-label={`Ver detalhes de ${service.title}`}
                  className="text-brand-700 hover:text-brand-800 font-bold text-sm inline-flex items-center gap-1.5 focus:outline-none cursor-pointer"
                >
                  <span>Ver Detalhes</span>
                  <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
                </button>

                <a 
                  href={createWhatsAppUrl(service.whatsappMessage)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={`Agendar ${service.title} no WhatsApp`}
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  <i className="fa-brands fa-whatsapp text-sm"></i>
                  <span>Agendar</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
