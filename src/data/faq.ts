export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export const faqData: FaqItem[] = [
  {
    id: 1,
    question: "Como funciona a combinação dos horários de atendimento?",
    answer: "Para garantir que o atendimento se encaixe perfeitamente na sua rotina diária, os horários são combinados e confirmados diretamente pelo WhatsApp com Nathalia. Temos horários matutinos, vespertinos e noturnos previamente reservados."
  },
  {
    id: 2,
    question: "Como funcionam as reposições de sessões nos planos contratuais?",
    answer: "Imprevistos acontecem! Notificando com pelo menos 12 a 24 horas de antecedência, sua sessão fica garantida e é reagendada dentro do período de vigência estipulado em seu contrato, sem qualquer prejuízo financeiro."
  },
  {
    id: 3,
    question: "O procedimento de Dry Needling dói?",
    answer: "A maioria dos pacientes sente apenas uma leve sensação de peso ou contração momentânea (twitch) quando a agulha atinge o ponto-gatilho. Não há injeção de medicamento. O alívio da dor e o relaxamento do músculo costumam ser quase imediatos."
  },
  {
    id: 4,
    question: "Preciso de encaminhamento médico para iniciar?",
    answer: "Não é estritamente obrigatório ter encaminhamento médico prévio para passar por avaliação fisioterapêutica e terapias integrativas, pois o fisioterapeuta é um profissional de primeiro contato. Todavia, em casos pós-cirúrgicos, ter o laudo e orientações do cirurgião é muito bem-vindo."
  }
];
