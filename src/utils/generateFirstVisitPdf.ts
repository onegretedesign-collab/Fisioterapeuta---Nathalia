import { jsPDF } from 'jspdf';
import type { PlanItem } from '../data/plans.ts';
import { WHATSAPP_PHONE, PHONE_DISPLAY } from '../data/services.ts';

export interface FirstVisitFormData {
  planId: string;
  patientName: string;
  phone: string;
  address: string;
  preferredPeriod: string;
  mainComplaint?: string;
}

export interface FirstVisitSubmission {
  formData: FirstVisitFormData;
  selectedPlan: PlanItem;
  protocolNumber: string;
  generatedAt: string;
}

export function buildFirstVisitWhatsAppMessage(
  data: FirstVisitFormData,
  plan: PlanItem,
  protocol: string,
  fichaUrl?: string
): string {
  const lines: string[] = [
    `*SOLICITAÇÃO DE PRIMEIRA VISITA - NATHALIA GUIMARÃES NOLÊTO*`,
    `Protocolo: #${protocol}`,
    ``,
    `Olá, Nathalia! Acabei de preencher a ficha de solicitação da Primeira Visita para atendimento fisioterapêutico.`,
    ``,
    `📋 *DADOS DO PACIENTE:*`,
    `• *Nome:* ${data.patientName}`,
    `• *Contato:* ${data.phone}`,
    `• *Endereço de Atendimento:* ${data.address}`,
    `• *Período preferido:* ${data.preferredPeriod || 'A combinar'}`,
  ];

  if (data.mainComplaint && data.mainComplaint.trim()) {
    lines.push(`• *Motivo / Queixa principal:* ${data.mainComplaint.trim()}`);
  }

  lines.push(
    ``,
    `🩺 *PLANO ESCOLHIDO:*`,
    `• *Plano:* ${plan.name} (${plan.badge})`,
    `• *Investimento:* ${plan.pricePrefix} ${plan.priceValue} ${plan.pricePeriod}`,
    `• *Média por sessão:* ${plan.pricePerSession}`,
    `• *Benefícios:* ${plan.features.map(f => f.text).join(' | ')}`
  );

  if (fichaUrl) {
    lines.push(
      ``,
      `📄 *LINK PARA GERAR / IMPRIMIR O PDF NO SEU APARELHO (TAMANHO A4):*`,
      `${fichaUrl}`,
      ``,
      `Toque no link acima para abrir a ficha com todos os dados preenchidos e imprimir ou salvar o PDF no seu aparelho!`
    );
  }

  return lines.join('\n');
}

/**
 * Generates an official, publication-quality A4 PDF matching the exact visual card layout:
 * - A4 dimensions: 210 x 297 mm
 * - Header with "FICHA RECEBIDA DO PACIENTE" badge & "Solicitação de Primeira Visita"
 * - Section 1: "1. DADOS DO PACIENTE" card
 * - Section 2: "2. PLANO ESCOLHIDO" card with badge and features
 * - Section 3: "3. GARANTIAS CONTRATUAIS & REPOSIÇÃO"
 * - Signatures block ready for printing & signing
 */
export function generateFirstVisitPdf(submission: FirstVisitSubmission): jsPDF {
  const { formData, selectedPlan, protocolNumber, generatedAt } = submission;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  let y = 12;

  // 1. Top Clinical Branding Header (Card background)
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 30, 3, 3, 'FD');

  // Brand Name & Subtitle
  doc.setTextColor(15, 118, 110); // brand-700
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('NATHALIA GUIMARÃES NOLÊTO', margin + 6, y + 8);

  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Fisioterapia Clínica & Terapias Integrativas • CREFITO Regularizado', margin + 6, y + 14);
  doc.text(`Quirinópolis - GO • WhatsApp: ${PHONE_DISPLAY}`, margin + 6, y + 19);

  // Top Right Badge: A4 Imprimível
  doc.setFillColor(13, 148, 136); // brand-600
  doc.roundedRect(pageWidth - margin - 44, y + 5, 38, 18, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('DOCUMENTO A4', pageWidth - margin - 25, y + 11, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Protocolo #${protocolNumber}`, pageWidth - margin - 25, y + 16, { align: 'center' });

  y += 34;

  // 2. Document Title Section matching the screenshot
  // Pill Badge: "FICHA RECEBIDA DO PACIENTE"
  doc.setFillColor(209, 250, 229); // emerald-100
  doc.roundedRect(margin, y, 48, 6, 2, 2, 'F');
  doc.setTextColor(6, 95, 70); // emerald-800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('FICHA RECEBIDA DO PACIENTE', margin + 24, y + 4.2, { align: 'center' });

  y += 10;

  // Title: "Solicitação de Primeira Visita"
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Solicitação de Primeira Visita', margin, y);

  // Protocol & Emissão
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Protocolo: `, margin, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text(`#${protocolNumber}`, margin + 15, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(` • Emissão: ${generatedAt}`, margin + 27, y);

  y += 8;

  // 3. Card 1: 1. DADOS DO PACIENTE (Exact design from screenshot)
  const card1Y = y;
  const card1Height = 56;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, card1Y, contentWidth, card1Height, 3, 3, 'FD');

  // Header of Card 1
  doc.setTextColor(15, 118, 110); // brand-700
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('1. DADOS DO PACIENTE', margin + 6, card1Y + 7);

  // Row 1: Nome do Paciente (Left) & Telefone / WhatsApp (Right)
  const col1X = margin + 6;
  const col2X = margin + (contentWidth / 2) + 2;

  // Nome
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Nome do Paciente:', col1X, card1Y + 14);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(formData.patientName || 'Não informado', col1X, card1Y + 19);

  // Telefone / WhatsApp
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Telefone / WhatsApp:', col2X, card1Y + 14);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(formData.phone || 'Não informado', col2X, card1Y + 19);

  // Row 2: Endereço da Visita (Full width)
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Endereço da Visita:', col1X, card1Y + 26);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  const splitAddress = doc.splitTextToSize(formData.address || 'Não informado', contentWidth - 12);
  doc.text(splitAddress, col1X, card1Y + 31);

  // Row 3: Período Preferencial
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Período Preferencial:', col1X, card1Y + 39);

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(formData.preferredPeriod || 'A combinar', col1X, card1Y + 44);

  // Divider inside Card 1
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(col1X, card1Y + 47, margin + contentWidth - 6, card1Y + 47);

  // Row 4: Queixa Principal / Motivo
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Queixa Principal / Motivo:', col1X, card1Y + 51);

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const complaint = formData.mainComplaint?.trim() || 'Avaliação clínica inicial na 1ª visita';
  doc.text(complaint, col1X + 38, card1Y + 51);

  y += card1Height + 7;

  // 4. Card 2: 2. PLANO ESCOLHIDO (Exact design from screenshot with teal border & mint background)
  const card2Y = y;
  const card2Height = 68;
  doc.setFillColor(240, 253, 250); // brand-50
  doc.setDrawColor(153, 246, 228); // brand-200
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, card2Y, contentWidth, card2Height, 3, 3, 'FD');

  // Header of Card 2
  doc.setTextColor(15, 118, 110); // brand-700
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('2. PLANO ESCOLHIDO', margin + 6, card2Y + 7);

  // Plan Badge on Right: e.g. "RECUPERAÇÃO" or "MANUTENÇÃO & ALTA"
  const badgeText = selectedPlan.badge.toUpperCase();
  const badgeWidth = Math.max(26, doc.getTextWidth(badgeText) + 8);
  doc.setFillColor(204, 251, 241); // brand-100
  doc.roundedRect(pageWidth - margin - badgeWidth - 6, card2Y + 3.5, badgeWidth, 5.5, 1.5, 1.5, 'F');
  doc.setTextColor(15, 118, 110);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text(badgeText, pageWidth - margin - (badgeWidth / 2) - 6, card2Y + 7.2, { align: 'center' });

  // Plan Name & Price: "Plano Mensal: R$ 920 /mês"
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`${selectedPlan.name}: `, margin + 6, card2Y + 16);

  const planNameWidth = doc.getTextWidth(`${selectedPlan.name}: `);
  doc.setTextColor(13, 148, 136); // brand-600
  doc.setFont('helvetica', 'bold');
  doc.text(`${selectedPlan.priceValue}`, margin + 6 + planNameWidth, card2Y + 16);

  const priceValWidth = doc.getTextWidth(`${selectedPlan.priceValue}`);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(` ${selectedPlan.pricePeriod}  (${selectedPlan.pricePerSession})`, margin + 6 + planNameWidth + priceValWidth, card2Y + 16);

  // Objective / Subtitle: "Foco em reabilitação gradual e ganho funcional."
  doc.setTextColor(71, 85, 105); // slate-600
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(selectedPlan.subtitle, margin + 6, card2Y + 22);

  // Divider inside Card 2
  doc.setDrawColor(204, 251, 241);
  doc.setLineWidth(0.3);
  doc.line(margin + 6, card2Y + 26, margin + contentWidth - 6, card2Y + 26);

  // Features list with checkmarks (2 columns layout)
  let featLeftY = card2Y + 33;
  let featRightY = card2Y + 33;

  selectedPlan.features.forEach((feature, idx) => {
    const isLeft = idx % 2 === 0;
    const colX = isLeft ? margin + 6 : margin + (contentWidth / 2) + 2;
    const currentY = isLeft ? featLeftY : featRightY;

    // Green checkmark symbol
    doc.setTextColor(5, 150, 105); // emerald-600
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('✓', colX, currentY);

    // Feature text
    doc.setTextColor(51, 65, 85); // slate-700
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const splitFeat = doc.splitTextToSize(feature.text, (contentWidth / 2) - 10);
    doc.text(splitFeat, colX + 5, currentY);

    if (isLeft) {
      featLeftY += 8.5;
    } else {
      featRightY += 8.5;
    }
  });

  y += card2Height + 7;

  // 5. Card 3: 3. TERMOS CONTRATUAIS & GARANTIAS LEGAIS
  const card3Y = y;
  const card3Height = 36;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, card3Y, contentWidth, card3Height, 3, 3, 'FD');

  doc.setTextColor(15, 118, 110);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('3. GARANTIAS CONTRATUAIS & REPOSIÇÃO DE SESSÕES', margin + 6, card3Y + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.6);
  doc.setTextColor(71, 85, 105);

  const contractNotes = [
    '• Avaliação Fisioterapêutica completa na 1ª visita para prescrição do plano de conduta individualizado.',
    '• Reposição de faltas assegurada com aviso prévio de 12h a 24h, dentro do período de vigência contratual.',
    '• Atendimento com pontualidade, biossegurança rigorosa e acompanhamento direto da profissional.',
    '• Agendamento e confirmação formal realizados diretamente no WhatsApp de Nathalia Guimarães Nolêto.'
  ];

  let noteY = card3Y + 12.5;
  contractNotes.forEach((note) => {
    doc.text(note, margin + 6, noteY);
    noteY += 5;
  });

  y += card3Height + 12;

  // 6. Signatures Block for A4 Print Ready
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin + 8, y + 12, margin + 78, y + 12);
  doc.line(pageWidth - margin - 78, y + 12, pageWidth - margin - 8, y + 12);

  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.text('Assinatura do Paciente / Responsável', margin + 43, y + 16, { align: 'center' });
  doc.text('Nathalia Guimarães Nolêto', pageWidth - margin - 43, y + 16, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(148, 163, 184);
  doc.text('Fisioterapia & Terapias Integrativas', pageWidth - margin - 43, y + 20, { align: 'center' });

  // Bottom Security Line
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Ficha de Solicitação Pré-Cadastral • Formato A4 • Emitido via plataforma online • WhatsApp Oficial: ${PHONE_DISPLAY}`,
    pageWidth / 2,
    289,
    { align: 'center' }
  );

  return doc;
}
