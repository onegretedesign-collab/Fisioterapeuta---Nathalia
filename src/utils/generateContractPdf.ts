import { jsPDF } from 'jspdf';
import { contractClauses } from '../data/contract.ts';
import { PHONE_DISPLAY } from '../data/services.ts';

export function generateContractPdf(patientName?: string): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2; // 178mm
  let y = 14;

  // 1. Top Clinical Branding Header
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(204, 251, 241); // brand-200
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, 'FD');

  doc.setTextColor(15, 118, 110); // brand-700
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('NATHALIA GUIMARÃES NOLÊTO', margin + 6, y + 8);

  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Fisioterapia Clínica & Terapias Integrativas • CREFITO Regularizado', margin + 6, y + 14);
  doc.text(`Quirinópolis - GO • WhatsApp Oficial: ${PHONE_DISPLAY}`, margin + 6, y + 19);

  // Top Right Badge
  doc.setFillColor(13, 148, 136); // brand-600
  doc.roundedRect(pageWidth - margin - 46, y + 5, 40, 18, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('DOCUMENTO OFICIAL', pageWidth - margin - 26, y + 11, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Garantia Jurídica', pageWidth - margin - 26, y + 16, { align: 'center' });

  y += 34;

  // 2. Title Section
  doc.setFillColor(209, 250, 229); // emerald-100
  doc.roundedRect(margin, y, 48, 6, 2, 2, 'F');
  doc.setTextColor(6, 95, 70); // emerald-800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('TERMOS DE PRESTAÇÃO DE SERVIÇOS', margin + 24, y + 4.2, { align: 'center' });

  y += 11;
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Termos & Garantias Contratuais', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // slate-500
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR');
  doc.text(`Instrumento de segurança jurídica para paciente e profissional • Emitido em ${dateStr}`, margin, y);

  if (patientName && patientName.trim()) {
    y += 5;
    doc.setTextColor(15, 118, 110);
    doc.setFont('helvetica', 'bold');
    doc.text(`Paciente / Contratante vinculado: ${patientName.trim()}`, margin, y);
  }

  y += 10;

  // 3. Clauses Loop
  contractClauses.forEach((clause) => {
    // Card background for each clause
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.2);

    // Calculate height of text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const splitDesc = doc.splitTextToSize(clause.description, contentWidth - 14);
    const cardHeight = 12 + splitDesc.length * 4.2;

    doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, 'FD');

    // Clause Number Badge
    doc.setFillColor(204, 251, 241); // brand-100
    doc.circle(margin + 6, y + 6.5, 4, 'F');
    doc.setTextColor(15, 118, 110); // brand-700
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(clause.number, margin + 6, y + 8, { align: 'center' });

    // Clause Title
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(`Cláusula ${clause.number}ª – ${clause.title}`, margin + 14, y + 7.5);

    // Clause Description
    doc.setTextColor(51, 65, 85); // slate-700
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(splitDesc, margin + 6, y + 14);

    y += cardHeight + 4;
  });

  y += 8;

  // 4. Signatures Section
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, y, contentWidth, 36, 2, 2, 'FD');

  const halfWidth = (contentWidth - 16) / 2;
  const col1X = margin + 8;
  const col2X = margin + 8 + halfWidth + 8;

  // Signature 1: Nathalia
  doc.setDrawColor(148, 163, 184); // slate-400
  doc.setLineWidth(0.3);
  doc.line(col1X, y + 22, col1X + halfWidth, y + 22);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Nathalia Guimarães Nolêto', col1X + halfWidth / 2, y + 26, { align: 'center' });
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Fisioterapeuta • CREFITO Regularizado', col1X + halfWidth / 2, y + 30, { align: 'center' });

  // Signature 2: Paciente
  doc.line(col2X, y + 22, col2X + halfWidth, y + 22);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(patientName ? patientName.trim() : 'Assinatura do Paciente / Responsável', col2X + halfWidth / 2, y + 26, { align: 'center' });
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Contratante dos Serviços', col2X + halfWidth / 2, y + 30, { align: 'center' });

  // 5. Footer
  y = 282;
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(
    'Documento gerado eletronicamente em conformidade com as diretrizes do COFFITO/CREFITO. Quirinópolis - GO.',
    pageWidth / 2,
    y,
    { align: 'center' }
  );

  return doc;
}
