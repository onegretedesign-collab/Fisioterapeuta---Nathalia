import React, { useState } from 'react';
import { FirstVisitSubmission, generateFirstVisitPdf } from '../utils/generateFirstVisitPdf.ts';

interface DoctorFichaModalProps {
  submission: FirstVisitSubmission | null;
  onClose: () => void;
}

export const DoctorFichaModal: React.FC<DoctorFichaModalProps> = ({ submission, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  if (!submission) return null;

  const { formData, selectedPlan, protocolNumber, generatedAt } = submission;

  const handleDownloadPdf = () => {
    setIsProcessing(true);
    try {
      const doc = generateFirstVisitPdf(submission);
      const cleanName = formData.patientName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_');
      doc.save(`Ficha_A4_${cleanName}_Protocolo_${protocolNumber}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar PDF no aparelho de Nathalia:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(formData.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const patientCleanPhone = formData.phone.replace(/\D/g, '');
  const patientWhatsAppUrl = `https://wa.me/55${patientCleanPhone}?text=${encodeURIComponent(
    `Olá, ${formData.patientName}! Sou Nathalia Guimarães Nolêto. Recebi sua solicitação de atendimento (Protocolo #${protocolNumber}) para o ${selectedPlan.name} e estou entrando em contato para combinarmos o melhor dia e horário da nossa visita!`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 print:p-0 print:static print:bg-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doctor-ficha-title"
    >
      {/* Backdrop (hidden during print) */}
      <div onClick={onClose} className="modal-backdrop fixed inset-0 transition-opacity print:hidden" />

      {/* Main Document Card Container */}
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar p-6 sm:p-8 shadow-2xl z-10 border-2 border-brand-500 print:border-none print:shadow-none print:max-w-none print:p-0 print:max-h-none print:static">
        {/* Top Close Button (hidden when printing) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar ficha do paciente"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer print:hidden"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* Print-only Clinical Header */}
        <div className="hidden print:block pb-4 mb-4 border-b border-slate-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-teal-800">NATHALIA GUIMARÃES NOLÊTO</h2>
              <p className="text-xs text-slate-600">Fisioterapia Clínica & Terapias Integrativas • CREFITO Regularizado</p>
              <p className="text-xs text-slate-500">Quirinópolis - GO • Atendimento Clínico e Domiciliar</p>
            </div>
            <div className="text-right text-xs text-slate-600">
              <span className="font-bold text-slate-900">FORMATO A4 IMPRESSÃO</span>
              <p>Protocolo: #{protocolNumber}</p>
              <p>{generatedAt}</p>
            </div>
          </div>
        </div>

        {/* Screen & Print Header matching user's image */}
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100 print:border-none print:pb-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-xl shrink-0 shadow-md shadow-brand-500/20 print:hidden">
            <i className="fa-solid fa-file-invoice"></i>
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wide inline-block">
              FICHA RECEBIDA DO PACIENTE
            </span>
            <h3 id="doctor-ficha-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Solicitação de Primeira Visita
            </h3>
            <p className="text-xs text-slate-500">
              Protocolo: <strong className="text-brand-700">#{protocolNumber}</strong> • Emissão: {generatedAt}
            </p>
          </div>
        </div>

        {/* Notice banner for Nathalia */}
        <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-900 font-medium print:hidden">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-file-pdf text-emerald-600 text-base shrink-0"></i>
            <span>
              Documento formatado em <strong>tamanho padrão A4</strong> para arquivamento e impressão direta no seu aparelho.
            </span>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-5 my-6 text-sm print:space-y-4 print:my-3">
          {/* Section 1: 1. DADOS DO PACIENTE */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 print:bg-white print:border-slate-300">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <i className="fa-solid fa-user text-brand-600 print:hidden"></i> 1. DADOS DO PACIENTE
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-slate-500 block text-xs">Nome do Paciente:</span>
                <span className="font-bold text-slate-900 text-sm sm:text-base">{formData.patientName}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-xs">Telefone / WhatsApp:</span>
                <span className="font-bold text-slate-900 text-sm sm:text-base">{formData.phone}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-500 block text-xs">Endereço da Visita:</span>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="font-bold text-slate-900 text-sm">{formData.address}</span>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-brand-700 text-xs font-semibold shadow-xs cursor-pointer print:hidden"
                  >
                    {copiedAddress ? (
                      <span className="text-emerald-600">
                        <i className="fa-solid fa-check mr-1"></i>Copiado!
                      </span>
                    ) : (
                      <span>
                        <i className="fa-regular fa-copy mr-1"></i>Copiar
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-xs">Período Preferencial:</span>
                <span className="font-semibold text-slate-800">{formData.preferredPeriod}</span>
              </div>

              {formData.mainComplaint && (
                <div className="sm:col-span-2 pt-2 border-t border-slate-200/60 print:border-slate-200">
                  <span className="text-slate-500 block text-xs">Queixa Principal / Motivo:</span>
                  <p className="font-medium text-slate-800 mt-0.5">{formData.mainComplaint}</p>
                </div>
              )}
            </div>

            {/* Quick Action to WhatsApp */}
            <div className="pt-2 print:hidden">
              <a
                href={patientWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
              >
                <i className="fa-brands fa-whatsapp text-emerald-600 text-base"></i>
                <span>Responder ao Paciente no WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Section 2: 2. PLANO ESCOLHIDO */}
          <div className="p-4 sm:p-5 rounded-2xl bg-brand-50/70 border border-brand-200 space-y-3 print:bg-white print:border-slate-300">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-brand-900 flex items-center gap-2">
                <i className="fa-solid fa-kit-medical text-brand-600 print:hidden"></i> 2. PLANO ESCOLHIDO
              </h4>
              <span className="px-3 py-1 rounded-full bg-brand-200 text-brand-900 text-[10px] font-bold uppercase">
                {selectedPlan.badge}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{selectedPlan.name}:</span>
              <span className="text-xl sm:text-2xl font-bold text-teal-600">{selectedPlan.priceValue}</span>
              <span className="text-xs text-slate-500 font-medium">{selectedPlan.pricePeriod}</span>
            </div>

            <p className="text-xs text-slate-600">{selectedPlan.subtitle}</p>

            <div className="pt-2 border-t border-brand-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 print:border-slate-200">
              {selectedPlan.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <i className="fa-solid fa-check text-emerald-600 text-[11px] shrink-0"></i>
                  <span>{feat.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Legal Terms (Print Ready) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1 print:bg-white print:border-slate-300">
            <span className="font-bold text-slate-700 uppercase tracking-wide block text-[11px]">
              Garantias Contratuais & Reposição de Sessões:
            </span>
            <p>• Avaliação fisioterapêutica completa na primeira visita para alinhamento de conduta.</p>
            <p>• Reposição de faltas assegurada com aviso prévio (12h a 24h) dentro da vigência do plano.</p>
            <p>• Formalização de contrato de prestação de serviços com total transparência e segurança jurídica.</p>
          </div>

          {/* Signatures for Print */}
          <div className="hidden print:grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-300 text-center text-xs">
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold text-slate-800">Assinatura do Paciente / Responsável</p>
              <p className="text-[10px] text-slate-500">CPF: ___________________________</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold text-slate-800">Nathalia Guimarães Nolêto</p>
              <p className="text-[10px] text-slate-500">Fisioterapia & Terapias Integrativas</p>
            </div>
          </div>
        </div>

        {/* Action Buttons for Nathalia */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 print:hidden">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isProcessing}
            className="flex-1 inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <i className="fa-solid fa-spinner fa-spin text-lg"></i>
                <span>Gerando PDF A4...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-file-arrow-down text-lg"></i>
                <span>Gerar & Baixar PDF no Meu Aparelho (A4)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-print text-base"></i>
            <span>Imprimir Ficha (A4)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
