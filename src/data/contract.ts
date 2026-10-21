export interface ContractClause {
  number: string;
  title: string;
  description: string;
}

export const contractClauses: ContractClause[] = [
  {
    number: "1",
    title: "Objeto e Avaliação Fisioterapêutica",
    description: "O contrato estabelece o compromisso de prestação de serviços fisioterapêuticos personalizados, precedido por uma criteriosa avaliação do quadro clínico."
  },
  {
    number: "2",
    title: "Política de Reposição e Avisos de Falta",
    description: "Em caso de necessidade de remarcação, o paciente deve comunicar com no mínimo 12 a 24 horas de antecedência. Isso garante a reposição da sessão dentro do prazo de vigência do plano contratado."
  },
  {
    number: "3",
    title: "Prazo de Vigência e Pausa Programada",
    description: "Planos trimestrais contam com permissão contratual de pausa de até 7 dias, e planos anuais até 30 dias em caso de férias, viagens a trabalho ou atestado de saúde."
  },
  {
    number: "4",
    title: "Condições de Pagamento e Rescisão Transparente",
    description: "O parcelamento pode ser feito em cartão de crédito ou transferência combinada. Cláusula de rescisão voluntária com devolução proporcional conforme normas de prestação de serviço."
  }
];
