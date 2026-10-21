import React from 'react';
import { plansData, getPlanWhatsAppUrl, PlanItem } from '../data/plans.ts';

interface PlansSectionProps {
  onOpenContractModal: () => void;
  onOpenFirstVisitModal: (planId?: string) => void;
}

export const PlansSection: React.FC<PlansSectionProps> = ({
  onOpenContractModal,
  onOpenFirstVisitModal,
}) => {
  return (
    <section id="planos" className="py-20 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase">
            Planos Estruturados
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Investimento na sua Saúde e Qualidade de Vida
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Pacotes com valores de mercado vantajosos, sessões planejadas e total segurança jurídica: <strong>todos os planos contam com contrato formal</strong>.
          </p>
        </div>

        {/* Grid dos 4 Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {plansData.map((plan) => {
            const isTrimestral = plan.highlighted;
            const containerClasses = isTrimestral
              ? "bg-gradient-to-b from-brand-50/70 to-white rounded-3xl p-7 border-2 border-brand-500 flex flex-col justify-between shadow-xl shadow-brand-500/10 relative"
              : "bg-white rounded-3xl p-7 border border-slate-200 flex flex-col justify-between hover:shadow-lg hover:border-brand-300 transition-all duration-300 relative";

            return (
              <div key={plan.id} className={containerClasses}>
                {isTrimestral && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                    Mais Escolhido
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full ${plan.badgeBg} ${plan.badgeColor} text-xs font-bold uppercase`}>
                      {plan.badge}
                    </span>
                    <i className={`${plan.icon} ${plan.iconColor}`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{plan.subtitle}</p>

                  <div className="my-6">
                    <div className="text-xs text-slate-500 font-semibold uppercase">{plan.pricePrefix}</div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-extrabold ${isTrimestral ? 'text-brand-700' : 'text-slate-900'}`}>
                        {plan.priceValue}
                      </span>
                      <span className="text-slate-500 text-sm">{plan.pricePeriod}</span>
                    </div>
                    <p className={`text-xs ${isTrimestral ? 'text-emerald-700 font-semibold' : 'text-brand-700 font-medium'} mt-1`}>
                      {plan.pricePerSession}
                    </p>
                  </div>

                  <ul className={`space-y-3 text-sm text-slate-600 border-t ${isTrimestral ? 'border-brand-100' : 'border-slate-100'} pt-5 mb-6`}>
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className={`flex items-center gap-2.5 ${!feature.positive ? 'text-slate-400' : ''}`}>
                        {feature.positive ? (
                          feature.bold && feature.text.includes('Contrato') ? (
                            <i className="fa-solid fa-file-contract text-brand-600 shrink-0"></i>
                          ) : (
                            <i className="fa-solid fa-check text-emerald-600 shrink-0"></i>
                          )
                        ) : (
                          <i className="fa-solid fa-xmark shrink-0"></i>
                        )}
                        <span>
                          {feature.bold ? <strong>{feature.text}</strong> : feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenFirstVisitModal(plan.id)}
                    className={`w-full text-center py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 ${plan.buttonClass}`}
                  >
                    <i className="fa-solid fa-clipboard-check"></i>
                    <span>Solicitar 1ª Visita & Plano</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => onOpenFirstVisitModal(plan.id)}
                    className="w-full block text-center py-2 px-3 rounded-lg text-slate-600 hover:text-brand-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <i className="fa-solid fa-file-pen text-brand-600 mr-1.5"></i>
                    Enviar dados e proposta deste plano
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner de Solicitação de Primeira Visita */}
        <div className="mt-12 bg-gradient-to-r from-brand-700 via-teal-700 to-emerald-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-brand-100 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <i className="fa-solid fa-house-medical"></i> Primeira Vez com Nathalia?
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug">
              Ficha de Primeira Visita ao Paciente
            </h3>
            <p className="text-brand-100 text-sm leading-relaxed">
              Preencha o formulário com seu endereço e plano selecionado. As informações e o link oficial são enviados diretamente ao WhatsApp de Nathalia para que ela gere a ficha no aparelho dela.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenFirstVisitModal()}
            className="shrink-0 px-8 py-4 rounded-2xl bg-white hover:bg-brand-50 text-slate-900 font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 cursor-pointer hover:scale-[1.02]"
          >
            <i className="fa-solid fa-clipboard-list text-emerald-600 text-xl"></i>
            <span>Preencher Ficha de Primeira Visita</span>
          </button>
        </div>

        {/* Banner de Segurança de Contrato */}
        <div id="contratos" className="mt-8 bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-brand-300 text-xs font-bold uppercase tracking-wider">
              <i className="fa-solid fa-scale-balanced"></i> Transparência & Respeito ao Paciente
            </div>
            <h3 className="text-2xl font-bold">Todos os nossos planos possuem Contrato de Prestação de Serviços</h3>
            <p className="text-slate-300 text-sm max-w-2xl">
              Garantia expressa de reposição de sessões por imprevistos, regras transparentes de agendamento e cláusulas de cancelamento justas e regulamentadas.
            </p>
          </div>
          <button 
            type="button"
            onClick={onOpenContractModal} 
            className="shrink-0 px-6 py-3.5 rounded-xl bg-white hover:bg-brand-50 text-slate-900 font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-file-lines text-brand-600"></i>
            <span>Ver Cláusulas Principais</span>
          </button>
        </div>

      </div>
    </section>
  );
};

