export interface DoctorPillar {
  icon: string;
  title: string;
  description: string;
}

export interface DoctorCredential {
  icon: string;
  label: string;
}

export interface DoctorProfileData {
  name: string;
  title: string;
  crefito: string;
  location: string;
  quote: string;
  bioParagraphs: string[];
  pillars: DoctorPillar[];
  credentials: DoctorCredential[];
}

export const doctorProfileData: DoctorProfileData = {
  name: "Nathalia Guimarães Nolêto",
  title: "Fisioterapeuta | Reabilitação Traumato-Ortopédica & Terapias Integrativas",
  crefito: "CREFITO Regularizado",
  location: "Quirinópolis - GO",
  quote: "O processo de cura e recuperação física começa quando o paciente se sente acolhido e verdadeiramente ouvido. Minha missão é devolver sua autonomia, eliminar a dor e restaurar sua qualidade de vida com respeito e rigor técnico.",
  bioParagraphs: [
    "Com atuação focada na reabilitação integral do movimento, Nathalia Guimarães Nolêto alia sólidos conhecimentos clínicos em traumato-ortopedia a técnicas integrativas modernas que aceleram a recuperação tecidual e proporcionam alívio consistente da dor.",
    "Seu atendimento destaca-se pela dedicação minuciosa a cada fase da jornada do paciente: desde a avaliação funcional profunda na primeira visita até a alta programada, sempre priorizando o conforto — seja em consultório clínico ou no acolhimento do ambiente domiciliar.",
    "Acredita em uma fisioterapia ética, transparente e com metas claras, onde cada sessão é personalizada para que o paciente retome suas atividades diárias e profissionais sem limitações."
  ],
  pillars: [
    {
      icon: "fa-solid fa-heart-pulse",
      title: "Atendimento Humanizado",
      description: "Tempo exclusivo dedicado a escutar sua queixa e entender sua necessidade de perto."
    },
    {
      icon: "fa-solid fa-microscope",
      title: "Rigor Clínico e Evidências",
      description: "Protocolos atualizados com foco em pós-operatório, traumatologia e alívio do quadro álgico."
    },
    {
      icon: "fa-solid fa-spa",
      title: "Visão Integrativa do Corpo",
      description: "Combinação de técnicas, cinesioterapia e eletroterapia, para um resultado mais eficiente."
    },
    {
      icon: "fa-solid fa-house-medical",
      title: "Cuidado Domiciliar Estruturado",
      description: "Segurança de ser atendido em casa com a mesma qualidade e equipamentos do consultório."
    }
  ],
  credentials: [
    {
      icon: "fa-solid fa-graduation-cap",
      label: "Graduada em Fisioterapia"
    },
    {
      icon: "fa-solid fa-certificate",
      label: "Especialista em Pós-Operatório & Trauma"
    },
    {
      icon: "fa-solid fa-spa",
      label: "Formação em Medicina Integrativa & Auriculoterapia"
    },
    {
      icon: "fa-solid fa-syringe",
      label: "Capacitada em Agulhamento a Seco (Dry Needling)"
    }
  ]
};
