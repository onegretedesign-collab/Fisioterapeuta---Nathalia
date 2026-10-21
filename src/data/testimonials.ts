export interface TestimonialItem {
  id: string;
  name: string;
  age?: number;
  location: string;
  category: 'pos-cirurgico' | 'coluna-dor' | 'integrativas' | 'planos';
  categoryLabel: string;
  condition: string;
  outcome: string;
  rating: number;
  quote: string;
  date: string;
  initials: string;
  avatarBg: string;
}

export interface TrustStat {
  value: string;
  label: string;
  sublabel: string;
  icon: string;
}

export const trustStats: TrustStat[] = [
  {
    value: "+500",
    label: "Pacientes Atendidos",
    sublabel: "Tratamentos individualizados",
    icon: "fa-solid fa-users"
  },
  {
    value: "5.0 ★",
    label: "Avaliação Média",
    sublabel: "Satisfação comprovada",
    icon: "fa-solid fa-star"
  },
  {
    value: "100%",
    label: "Contrato Formal",
    sublabel: "Garantia e transparência",
    icon: "fa-solid fa-file-contract"
  },
  {
    value: "Quirinópolis",
    label: "Atendimento Local",
    sublabel: "Clínico e domiciliar",
    icon: "fa-solid fa-location-dot"
  }
];

export const testimonialsData: TestimonialItem[] = [
  {
    id: "dep-1",
    name: "Carlos Eduardo Silveira",
    age: 48,
    location: "Quirinópolis - GO",
    category: "pos-cirurgico",
    categoryLabel: "Pós-Cirúrgico",
    condition: "Reconstrução de LCA e Menisco",
    outcome: "Recuperação total da amplitude em 6 semanas",
    rating: 5,
    quote: "Passei por uma cirurgia no joelho e estava com muito medo de não voltar a caminhar sem mancar. A Nathalia foi fundamental desde a primeira visita em casa. O protocolo de drenagem do inchaço e os exercícios progressivos devolveram minha segurança. O médico cirurgião elogiou muito a evolução!",
    date: "Há 2 meses",
    initials: "CS",
    avatarBg: "bg-teal-600"
  },
  {
    id: "dep-2",
    name: "Ana Paula Mendonça",
    age: 39,
    location: "Quirinópolis - GO",
    category: "coluna-dor",
    categoryLabel: "Dores & Coluna",
    condition: "Hérnia de Disco Lombar e Ciático",
    outcome: "Sem crises de dor há mais de 4 meses",
    rating: 5,
    quote: "Eu não conseguia ficar 20 minutos sentada no trabalho por causa da dor na lombar irradiando para a perna. Com as técnicas de terapia manual e o plano trimestral da Nathalia, abandonei os remédios fortes para dor. O contrato dá muita tranquilidade com reposição quando precisei viajar.",
    date: "Há 1 mês",
    initials: "AM",
    avatarBg: "bg-emerald-600"
  },
  {
    id: "dep-3",
    name: "Roberto Fernandes",
    age: 52,
    location: "Quirinópolis - GO",
    category: "coluna-dor",
    categoryLabel: "Dores & Coluna",
    condition: "Cervicobraquialgia & Nós Musculares",
    outcome: "Alívio imediato no agulhamento a seco",
    rating: 5,
    quote: "Nunca tinha feito Dry Needling antes e confesso que tinha receio. A Nathalia explicou tudo com muita calma e delicadeza. O alívio no nó muscular do trapézio e pescoço foi quase instantâneo. Profissional humana, pontual e extremamente capacitada.",
    date: "Há 3 semanas",
    initials: "RF",
    avatarBg: "bg-brand-700"
  },
  {
    id: "dep-4",
    name: "Juliana Caetano Ramos",
    age: 34,
    location: "Quirinópolis - GO",
    category: "integrativas",
    categoryLabel: "Terapias Integrativas",
    condition: "Enxaqueca Crônica & Ansiedade",
    outcome: "Crises reduzidas em 85% e sono restaurado",
    rating: 5,
    quote: "A combinação de auriculoterapia com ventosaterapia e aromaterapia mudou minha rotina. Minhas crises de enxaqueca diminuíram drasticamente e voltei a dormir a noite toda. É um tratamento integral de verdade, que olha para a pessoa e não só para o sintoma.",
    date: "Há 1 mês",
    initials: "JR",
    avatarBg: "bg-purple-600"
  },
  {
    id: "dep-5",
    name: "Marcos Vinícius Prado",
    age: 44,
    location: "Quirinópolis - GO",
    category: "pos-cirurgico",
    categoryLabel: "Acidente de Trabalho",
    condition: "Lesão de Manguito Rotador (Ombro)",
    outcome: "Retorno às atividades laborais sem restrições",
    rating: 5,
    quote: "Sofri uma lesão no ombro no ambiente de trabalho e passei por cirurgia. Fiz todo o acompanhamento com o Plano Trimestral. A ficha de atendimento em PDF que preenchi pelo site facilitou todo o início do processo. Hoje tenho força e movimento 100% recuperados.",
    date: "Há 3 meses",
    initials: "MP",
    avatarBg: "bg-slate-700"
  },
  {
    id: "dep-6",
    name: "Dona Maria de Lourdes",
    age: 67,
    location: "Quirinópolis - GO",
    category: "planos",
    categoryLabel: "Plano Anual",
    condition: "Artrose, Equilíbrio & Postura",
    outcome: "Mais autonomia e zero quedas no último ano",
    rating: 5,
    quote: "Minha mãe é atendida pela Nathalia no plano contínuo em domicílio. A paciência, o carinho e o cuidado técnico com ela são indescritíveis. A musculatura fortaleceu e ela voltou a passear na calçada com confiança. Recomendo de olhos fechados para todas as famílias!",
    date: "Há 2 semanas",
    initials: "ML",
    avatarBg: "bg-teal-700"
  }
];

export function filterTestimonials(
  items: TestimonialItem[],
  filter: 'todos' | 'pos-cirurgico' | 'coluna-dor' | 'integrativas' | 'planos'
): TestimonialItem[] {
  if (filter === 'todos') {
    return items;
  }
  return items.filter((item) => item.category === filter);
}
