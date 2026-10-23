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
    id: "traumato-ortopedica",
    title: "Traumato-Ortopédica",
    badge: "Ortopedia & Coluna",
    icon: "fa-solid fa-bone",
    cardBrief: "Trata fraturas, entorses, lesões musculares, pós-operatórios de articulações e dores na coluna.",
    description: "Tratamento especializado e recuperação biomecânica de fraturas, entorses, contusões e lesões musculares ou ligamentares. Foco na reabilitação completa de pós-operatórios articulares (joelho, ombro, quadril) e alívio consistente de dores agudas e crônicas na coluna vertebral.",
    benefits: [
      "Reabilitação acelerada de pós-operatórios articulares (ombro, joelho, quadril)",
      "Tratamento de entorses, fraturas e estiramentos musculares",
      "Alívio eficaz de dores na coluna (lombalgias, hérnias de disco, cervicalgias)",
      "Recuperação segura da amplitude articular e força muscular"
    ],
    duration: "50 a 60 minutos",
    whatsappMessage: "Olá, Nathalia! Gostaria de consultar horários para atendimento de Fisioterapia *Traumato-Ortopédica*."
  },
  {
    id: "neurofuncional",
    title: "Neurofuncional (Neurologia)",
    badge: "Reabilitação Neurológica",
    icon: "fa-solid fa-brain",
    cardBrief: "Focada na reabilitação de pacientes com AVC (derrame), lesão medular, paralisia cerebral, doença de Parkinson e Esclerose Múltipla.",
    description: "Reabilitação motora e neuromuscular baseada no princípio da neuroplasticidade cerebral. Atuação especializada na recuperação funcional de pacientes acometidos por AVC (Acidente Vascular Cerebral / derrame), sequelas de lesão medular, paralisia cerebral, doença de Parkinson, Esclerose Múltipla e neuropatias.",
    benefits: [
      "Estímulo à neuroplasticidade para recuperação de movimentos e força",
      "Treinamento de equilíbrio, postura e marcha segura",
      "Controle de espasticidade muscular e prevenção de deformidades",
      "Maior independência funcional para as atividades da vida diária"
    ],
    duration: "50 a 60 minutos",
    whatsappMessage: "Olá, Nathalia! Gostaria de consultar horários para atendimento de Fisioterapia *Neurofuncional (Neurologia)*."
  },
  {
    id: "respiratoria-pulmonar",
    title: "Respiratória / Pulmonar",
    badge: "Função Pulmonar",
    icon: "fa-solid fa-lungs",
    cardBrief: "Atua na melhora da função pulmonar, desobstrução de vias aéreas e reabilitação de doenças crônicas ou pós-infecções.",
    description: "Terapia respiratória clínica focada na desobstrução brônquica, higiene de vias aéreas e reexpansão pulmonar. Indicada para quadros de pós-infecções respiratórias, pneumonia, bronquite, asma, DPOC e reabilitação cardiopulmonar para melhora da oxigenação.",
    benefits: [
      "Desobstrução e eliminação eficaz de secreções das vias aéreas",
      "Aumento da capacidade ventilatória e melhora da oxigenação sanguínea",
      "Treinamento muscular respiratório com dispositivos dedicados",
      "Alívio da falta de ar e ganho de tolerância a esforços físicos"
    ],
    duration: "45 a 60 minutos",
    whatsappMessage: "Olá, Nathalia! Gostaria de agendar uma sessão de Fisioterapia *Respiratória / Pulmonar*."
  },
  {
    id: "esportiva",
    title: "Esportiva",
    badge: "Performance & Atletas",
    icon: "fa-solid fa-person-running",
    cardBrief: "Voltada para a prevenção e recuperação de lesões em atletas, com foco no retorno seguro à prática de alto rendimento.",
    description: "Fisioterapia esportiva com foco na avaliação do gesto motor esportivo, prevenção de sobrecargas e reabilitação de lesões articulares, musculares e tendíneas (tendinites, pubalgias, roturas). Planejamento de retorno ao esporte (Return to Play) com máxima segurança.",
    benefits: [
      "Prevenção ativa de lesões em atletas e praticantes de atividade física",
      "Recuperação biomecânica precisa para retomada gradual de treinos",
      "Correção do padrão de movimento e equilíbrio neuromuscular",
      "Liberação miofascial e recuperação muscular pós-treinos intensos"
    ],
    duration: "50 a 60 minutos",
    whatsappMessage: "Olá, Nathalia! Gostaria de consultar horários para atendimento de Fisioterapia *Esportiva*."
  },
  {
    id: "gerontologia",
    title: "Gerontologia",
    badge: "Saúde do Idoso (60+)",
    icon: "fa-solid fa-person-cane",
    cardBrief: "Reabilitação e manutenção da funcionalidade, equilíbrio e independência voltada para idosos (60+).",
    description: "Cuidado individualizado e humanizado para a população idosa (60+), com foco em preservar a autonomia, prevenir quedas, fortalecer a musculatura estabilizadora e manter a mobilidade articular, garantindo dignidade, bem-estar e qualidade de vida na melhor idade.",
    benefits: [
      "Treinamento de equilíbrio estático e dinâmico com prevenção de quedas",
      "Fortalecimento muscular seguro para manter a independência funcional",
      "Melhora da flexibilidade, mobilidade das articulações e coordenação motora",
      "Acompanhamento atencioso com respeito ao ritmo e limites de cada paciente"
    ],
    duration: "50 a 60 minutos",
    whatsappMessage: "Olá, Nathalia! Gostaria de consultar horários para atendimento de Fisioterapia em *Gerontologia (Saúde do Idoso)*."
  },
  {
    id: "fisioterapia-domiciliar",
    title: "Fisioterapia Domiciliar (Home Care)",
    badge: "Home Care / Conforto do Lar",
    icon: "fa-solid fa-house-medical",
    cardBrief: "Atendimento e reabilitação individualizada no conforto do lar, indicada para pacientes com limitações de locomoção, em pós-operatório, idosos ou que necessitam de cuidados contínuos em seu próprio ambiente.",
    description: "Atendimento fisioterapêutico completo no aconchego e segurança da residência do paciente. Toda a estrutura e equipamentos clínicos são levados até o domicílio, ideal para pacientes acamados, em pós-cirúrgico recente, idosos com dificuldade de locomoção ou que necessitam de cuidados contínuos em seu próprio ambiente.",
    benefits: [
      "Comodidade total sem o estresse de trânsito ou deslocamentos dolorosos",
      "Adaptação ergonômica do ambiente domiciliar para evitar acidentes",
      "Atenção exclusiva e individualizada no espaço de convivência da família",
      "Equipamentos clínicos portáteis levados diretamente à sua residência"
    ],
    duration: "50 a 60 minutos",
    whatsappMessage: "Olá, Nathalia! Gostaria de consultar disponibilidade para atendimento de *Fisioterapia Domiciliar (Home Care)*."
  }
];

export const WHATSAPP_PHONE = "5564992749005";
export const PHONE_DISPLAY = "(64) 99274-9005";

export function createWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
