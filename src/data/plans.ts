import { createWhatsAppUrl } from './services.ts';

export interface PlanItem {
  id: string;
  name: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  icon: string;
  iconColor: string;
  subtitle: string;
  pricePrefix: string;
  priceValue: string;
  pricePeriod: string;
  pricePerSession: string;
  features: { text: string; positive: boolean; bold?: boolean }[];
  highlighted?: boolean;
  buttonText: string;
  buttonClass: string;
  whatsappMessage: string;
}

export const plansData: PlanItem[] = [
  {
    id: "semanal",
    name: "Plano Semanal",
    badge: "Intensivo",
    badgeBg: "bg-slate-100",
    badgeColor: "text-slate-700",
    icon: "fa-solid fa-bolt",
    iconColor: "text-slate-400",
    subtitle: "Ideal para alívio imediato e pós-cirúrgico inicial.",
    pricePrefix: "A partir de",
    priceValue: "R$ 260",
    pricePeriod: "/semana",
    pricePerSession: "R$ 130,00 por sessão (2 a 3 sessões)",
    features: [
      { text: "2 a 3 sessões na semana", positive: true },
      { text: "Avaliação do quadro álgico", positive: true },
      { text: "Contrato com regras claras", positive: true, bold: true },
      { text: "Sem trancamento de plano", positive: false }
    ],
    buttonText: "Agendar Plano Semanal",
    buttonClass: "bg-slate-900 hover:bg-brand-700 text-white",
    whatsappMessage: "Olá, Nathalia! Gostaria de contratar o *Plano Semanal* de Fisioterapia."
  },
  {
    id: "mensal",
    name: "Plano Mensal",
    badge: "Recuperação",
    badgeBg: "bg-brand-100",
    badgeColor: "text-brand-800",
    icon: "fa-solid fa-calendar-days",
    iconColor: "text-brand-600",
    subtitle: "Foco em reabilitação gradual e ganho funcional.",
    pricePrefix: "Total",
    priceValue: "R$ 920",
    pricePeriod: "/mês",
    pricePerSession: "R$ 115,00 por sessão (8 sessões - 2x/sem)",
    features: [
      { text: "8 sessões no mês (2x por semana)", positive: true },
      { text: "Reavaliação evolutiva inclusa", positive: true },
      { text: "Contrato com reposição de até 2 faltas", positive: true, bold: true },
      { text: "Parcelamento em até 2x no cartão", positive: true }
    ],
    buttonText: "Agendar Plano Mensal",
    buttonClass: "bg-brand-600 hover:bg-brand-700 text-white",
    whatsappMessage: "Olá, Nathalia! Gostaria de saber mais e agendar o *Plano Mensal* de Fisioterapia."
  },
  {
    id: "trimestral",
    name: "Plano Trimestral",
    badge: "Manutenção & Alta",
    badgeBg: "bg-brand-200/80",
    badgeColor: "text-brand-900",
    icon: "fa-solid fa-crown",
    iconColor: "text-amber-500",
    subtitle: "Estabilidade articular, força e término de reabilitação.",
    pricePrefix: "3x de",
    priceValue: "R$ 800",
    pricePeriod: "/mês",
    pricePerSession: "R$ 100,00 por sessão (24 sessões no total)",
    highlighted: true,
    features: [
      { text: "24 sessões totais (2x por semana)", positive: true },
      { text: "Economia real de R$ 720,00", positive: true },
      { text: "Contrato com pausa de 1 semana inclusa", positive: true, bold: true },
      { text: "Parcelamento facilitado em até 3x", positive: true }
    ],
    buttonText: "Garantir Vaga Trimestral",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg",
    whatsappMessage: "Olá, Nathalia! Gostaria de contratar o *Plano Trimestral* com desconto."
  },
  {
    id: "anual",
    name: "Plano Anual",
    badge: "Cuidado Vitalício",
    badgeBg: "bg-purple-100",
    badgeColor: "text-purple-800",
    icon: "fa-solid fa-shield-heart",
    iconColor: "text-purple-600",
    subtitle: "Prevenção contínua, postura e qualidade de vida sem dor.",
    pricePrefix: "12x de",
    priceValue: "R$ 340",
    pricePeriod: "/mês",
    pricePerSession: "R$ 85,00 por sessão (48 sessões - 1x/sem)",
    features: [
      { text: "48 sessões (1x por semana contínuo)", positive: true },
      { text: "Maior desconto do mercado", positive: true },
      { text: "Contrato anual com até 30 dias de pausa", positive: true, bold: true },
      { text: "Cobrança recorrente sem travar limite", positive: true }
    ],
    buttonText: "Agendar Plano Anual",
    buttonClass: "bg-slate-900 hover:bg-brand-700 text-white",
    whatsappMessage: "Olá, Nathalia! Gostaria de informações do *Plano Anual* de acompanhamento."
  }
];

export function getPlanWhatsAppUrl(plan: PlanItem): string {
  return createWhatsAppUrl(plan.whatsappMessage);
}
