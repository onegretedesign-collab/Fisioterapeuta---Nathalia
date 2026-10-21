export interface ServiceItem {
  id: string;
  title: string;
  badge: string;
  icon: string;
  cardBrief: string;
  description: string;
  benefits: string[];
  duration: string;
  whatsappMessage: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: "pos-cirurgico",
    title: "Pós Cirúrgico",
    badge: "Reabilitação Especializada",
    icon: "fa-solid fa-crutch",
    cardBrief: "Recuperação acelerada após cirurgias ortopédicas ou plásticas, com controle de edema, dor e prevenção de aderências.",
    description: "Protocolo técnico de reabilitação fisioterapêutica para pacientes em fase de recuperação pós-operatória. Visa diminuir inchaços (edemas), prevenir retrações cicatriciais e fibroses, combater a dor e restabelecer a amplitude normal de movimento com máxima segurança.",
    benefits: [
      "Drenagem especializada de edemas pós-operatórios",
      "Prevenção e tratamento de fibroses e aderências de cicatrizes",
      "Ganho gradativo e seguro de força e mobilidade",
      "Acompanhamento conjunto às orientações do médico cirurgião"
    ],
    duration: "50 a 60 minutos",
    whatsappMessage: "Olá, Nathalia! Gostaria de consultar horários para atendimento de Fisioterapia *Pós Cirúrgica*."
  },
  {
    id: "acidente-trabalho",
    title: "Acidente de Trabalho",
    badge: "Fisioterapia Ocupacional",
    icon: "fa-solid fa-person-digging",
    cardBrief: "Tratamento de LER/DORT, traumas de trabalho e reabilitação funcional para retomada segura das atividades.",
    description: "Abordagem focada em lesões laborais e traumas decorrentes de acidentes de trabalho ou movimentos repetitivos (LER/DORT). O tratamento foca no alívio de quadros álgicos intensos, correção biomecânica e fortalecimento para um retorno profissional seguro e sem recaídas.",
    benefits: [
      "Alívio de dores posturais e compressões articulares",
      "Reeducação motora e orientação ergonômica preventiva",
      "Reabilitação de fraturas, entorses e contusões do trabalho",
      "Restauração da capacidade funcional do colaborador"
    ],
    duration: "50 a 60 minutos",
    whatsappMessage: "Olá, Nathalia! Gostaria de consultar horários para tratamento de lesão por *Acidente de Trabalho / LER*."
  },
  {
    id: "massagem",
    title: "Massagem & Liberação",
    badge: "Terapia Manual",
    icon: "fa-solid fa-spa",
    cardBrief: "Massagens terapêuticas, relaxantes e liberação miofascial para desfazer nós de tensão e restaurar o bem-estar.",
    description: "Combinação de manobras manuais especializadas que atuam diretamente sobre o tecido muscular e a fáscia. Proporciona o desmanche de nós musculares (pontos de tensão), oxigenação celular, drenagem de toxinas teciduais e profundo alívio do estresse físico e mental.",
    benefits: [
      "Desativação imediata de contraturas e tensões nos ombros/costas",
      "Aumento significativo da circulação periférica",
      "Alívio expressivo do estresse e melhora do sono",
      "Liberação miofascial instrumental e manual"
    ],
    duration: "45 a 60 minutos",
    whatsappMessage: "Olá, Nathalia! Gostaria de agendar uma sessão de *Massagem Terapêutica / Liberação Miofascial*."
  },
  {
    id: "auriculoterapia",
    title: "Auriculoterapia",
    badge: "Medicina Integrativa",
    icon: "fa-solid fa-ear-listen",
    cardBrief: "Estímulo de pontos auriculares para equilíbrio energético, combate à ansiedade, insônia e dores difusas.",
    description: "Ramo milenar da Medicina Tradicional Chinesa que utiliza reflexos reflexológicos no pavilhão auditivo. Ao estimular pontos estratégicos com sementes de mostarda ou esferas terapêuticas, emite-se sinais ao sistema nervoso central que regulam dores, desequilíbrios hormonais e ansiedade.",
    benefits: [
      "Controle natural de ansiedade, estresse e compulsões",
      "Alívio adjuvante de enxaquecas e dores crônicas",
      "Melhora da qualidade do sono e regulação do humor",
      "Aplicação rápida, indolor e com duração contínua de 5 a 7 dias"
    ],
    duration: "30 minutos",
    whatsappMessage: "Olá, Nathalia! Gostaria de agendar uma sessão de *Auriculoterapia*."
  },
  {
    id: "dry-needling",
    title: "Dry Needling",
    badge: "Agulhamento a Seco",
    icon: "fa-solid fa-syringe",
    cardBrief: "Desativação direta de pontos-gatilho (nós de dor muscular) através de agulhas estéreis e ultrafinas.",
    description: "Técnica altamente precisa e eficaz que utiliza agulhas filiformes estéreis para atingir os chamados 'Trigger Points' (pontos-gatilho miofasciais). A punção desfaz o nó muscular, quebrando o ciclo dor-espasmo-dor de maneira imediata sem necessidade de nenhuma substância medicamentosa injetada.",
    benefits: [
      "Soltura imediata de 'torcicolos' e nós de tensão muscular",
      "Interrupção do reflexo doloroso em dores ciáticas e lombares",
      "Acelera a recuperação de atletas e praticantes de atividade física",
      "Sensação quase imediata de leveza muscular"
    ],
    duration: "30 a 40 minutos",
    whatsappMessage: "Olá, Nathalia! Gostaria de agendar uma sessão de *Dry Needling (Agulhamento a Seco)*."
  },
  {
    id: "terapias-integrativas",
    title: "Terapias Integrativas",
    badge: "Saúde Integral",
    icon: "fa-solid fa-hand-holding-heart",
    cardBrief: "Ventosaterapia, aromaterapia e alinhamento holístico para restaurar o equilíbrio do corpo e da mente.",
    description: "Abordagem ampla que enxerga o paciente além da queixa pontual. Integra técnicas complementares validadas, como ventosaterapia para desintoxicação tecidual e alívio de dor, sinergias de óleos essenciais terapêuticos e exercícios de respiração e alinhamento postural.",
    benefits: [
      "Ventosaterapia para renovação do fluxo sanguíneo nas costas",
      "Aromaterapia clínica com óleos essenciais de grau puro",
      "Reequilíbrio físico, mental e diminuição de sobrecargas emocionais",
      "Sensação revigorante e restauração da vitalidade"
    ],
    duration: "50 a 60 minutos",
    whatsappMessage: "Olá, Nathalia! Gostaria de informações e agendamento para *Terapias Integrativas*."
  }
];

export const WHATSAPP_PHONE = "5564992749005";
export const PHONE_DISPLAY = "(64) 99274-9005";

export function createWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
