import React, { useState, useEffect } from 'react';
import { plansData, PlanItem } from '../data/plans.ts';
import { createWhatsAppUrl, WHATSAPP_PHONE } from '../data/services.ts';
import {
  FirstVisitFormData,
  FirstVisitSubmission,
  buildFirstVisitWhatsAppMessage,
  generateFirstVisitPdf,
} from '../utils/generateFirstVisitPdf.ts';
import { encodeFichaToUrlParam } from '../utils/fichaLink.ts';

interface FirstVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: string;
  onPreviewFicha?: (submission: FirstVisitSubmission) => void;
}

export const FirstVisitModal: React.FC<FirstVisitModalProps> = ({
  isOpen,
  onClose,
  initialPlanId,
  onPreviewFicha,
}) => {
  const [formData, setFormData] = useState<FirstVisitFormData>({
    planId: initialPlanId || 'trimestral',
    patientName: '',
    phone: '',
    address: '',
    preferredPeriod: 'A combinar pelo WhatsApp',
    mainComplaint: '',
  });

  const [submittedSubmission, setSubmittedSubmission] = useState<FirstVisitSubmission | null>(null);
  const [generatedFichaUrl, setGeneratedFichaUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync initialPlanId when changed
  useEffect(() => {
    if (initialPlanId) {
      setFormData((prev) => ({ ...prev, planId: initialPlanId }));
    }
  }, [initialPlanId]);

  // Handle ESC and body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'auto';
      setPdfSuccess(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setSubmittedSubmission(null);
    setGeneratedFichaUrl(null);
    setValidationError(null);
    setPdfSuccess(false);
    onClose();
  };

  const selectedPlan: PlanItem =
    plansData.find((p) => p.id === formData.planId) || plansData[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patientName.trim()) {
      setValidationError('Por favor, informe o nome completo do paciente.');
      return;
    }
    if (!formData.phone.trim()) {
      setValidationError('Por favor, informe o telefone ou WhatsApp para contato.');
      return;
    }
    if (!formData.address.trim()) {
      setValidationError('Por favor, informe o endereço completo para a primeira visita.');
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      // Yield to event loop to allow UI to render spinner
      await new Promise((resolve) => setTimeout(resolve, 650));

      const protocol = `${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();
      const generatedAt = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

      const submission: FirstVisitSubmission = {
        formData,
        selectedPlan,
        protocolNumber: protocol,
        generatedAt,
      };

      // Generate the link that Nathalia will use to view and generate the PDF on her device
      const origin = window.location.origin;
      const fichaParam = encodeFichaToUrlParam(submission);
      const fichaUrl = `${origin}/?ficha=${fichaParam}`;

      setSubmittedSubmission(submission);
      setGeneratedFichaUrl(fichaUrl);

      // Build WhatsApp message with full registration details and the direct PDF generation link
      const message = buildFirstVisitWhatsAppMessage(formData, selectedPlan, protocol, fichaUrl);
      const whatsappUrl = createWhatsAppUrl(message);

      // Open WhatsApp directly for the patient to send to Nathalia
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Erro ao enviar solicitação:', err);
      setValidationError('Ocorreu um erro ao processar seus dados. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadFichaPdf = async (customSubmission?: FirstVisitSubmission) => {
    const sub = customSubmission || submittedSubmission;
    if (!sub) return;
    setIsGeneratingPdf(true);
    setPdfSuccess(false);
    try {
      // Yield to allow browser to render loading spinner
      await new Promise((resolve) => setTimeout(resolve, 650));
      const doc = generateFirstVisitPdf(sub);
      const cleanName = sub.formData.patientName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_');
      doc.save(`Ficha_A4_${cleanName}_Protocolo_${sub.protocolNumber}.pdf`);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3500);
    } catch (err) {
      console.error('Erro ao gerar PDF da ficha:', err);
      setValidationError('Ocorreu um erro ao gerar o documento PDF. Tente novamente.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleGeneratePdfFromForm = async () => {
    if (!formData.patientName.trim()) {
      setValidationError('Por favor, informe o nome completo do paciente.');
      return;
    }
    if (!formData.phone.trim()) {
      setValidationError('Por favor, informe o telefone ou WhatsApp para contato.');
      return;
    }
    if (!formData.address.trim()) {
      setValidationError('Por favor, informe o endereço completo para a primeira visita.');
      return;
    }

    setValidationError(null);
    setIsGeneratingPdf(true);
    setPdfSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      const protocol = `${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();
      const generatedAt = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

      const submission: FirstVisitSubmission = {
        formData,
        selectedPlan,
        protocolNumber: protocol,
        generatedAt,
      };

      const doc = generateFirstVisitPdf(submission);
      const cleanName = formData.patientName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_');
      doc.save(`Ficha_A4_${cleanName}_Protocolo_${protocol}.pdf`);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3500);
    } catch (err) {
      console.error('Erro ao gerar PDF direto do formulário:', err);
      setValidationError('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="first-visit-title"
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="modal-backdrop fixed inset-0 transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar p-6 sm:p-8 shadow-2xl z-10 border border-slate-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Fechar formulário de primeira visita"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {submittedSubmission && generatedFichaUrl ? (
          /* ================= SUCCESS STATE ================= */
          <div className="text-center py-4 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-sm">
              <i className="fa-solid fa-circle-check"></i>
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                Solicitação Encaminhada
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                Dados Enviados para Nathalia!
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Protocolo: <strong className="text-brand-700">#{submittedSubmission.protocolNumber}</strong>
              </p>
            </div>

            {/* Instruction Steps */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-sm space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-circle-info text-brand-600"></i> Como funciona agora:
              </h4>
              <ul className="space-y-2.5 text-slate-600 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-emerald-600 mt-0.5 shrink-0"></i>
                  <span>
                    Seus dados de cadastro, endereço e plano foram reunidos com um <strong>link exclusivo</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-emerald-600 mt-0.5 shrink-0"></i>
                  <span>
                    A <strong>Nathalia recebe o link no WhatsApp</strong> dela e pode gerar o PDF oficial diretamente no aparelho dela.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-emerald-600 mt-0.5 shrink-0"></i>
                  <span>
                    Ela responderá sua mensagem para confirmar o melhor horário da primeira visita.
                  </span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={createWhatsAppUrl(
                  buildFirstVisitWhatsAppMessage(
                    formData,
                    selectedPlan,
                    submittedSubmission.protocolNumber,
                    generatedFichaUrl
                  )
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all"
              >
                <i className="fa-brands fa-whatsapp text-xl"></i>
                <span>Abrir WhatsApp de Nathalia</span>
              </a>

              <button
                type="button"
                onClick={() => handleDownloadFichaPdf(submittedSubmission)}
                disabled={isGeneratingPdf}
                className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-sm border border-brand-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                {isGeneratingPdf ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin text-base text-brand-600"></i>
                    <span>Gerando PDF (A4)...</span>
                  </>
                ) : pdfSuccess ? (
                  <>
                    <i className="fa-solid fa-circle-check text-base text-emerald-600"></i>
                    <span>PDF Baixado!</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-file-pdf text-base text-brand-600"></i>
                    <span>Baixar Cópia em PDF</span>
                  </>
                )}
              </button>

              {onPreviewFicha && (
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onPreviewFicha(submittedSubmission);
                  }}
                  className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-eye text-brand-600"></i>
                  <span>Visualizar</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 underline cursor-pointer"
            >
              Concluir e Voltar ao Site
            </button>
          </div>
        ) : (
          /* ================= FORM STATE ================= */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700 text-xl shrink-0">
                <i className="fa-solid fa-clipboard-user"></i>
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[11px] font-bold uppercase tracking-wide">
                  Atendimento Personalizado
                </span>
                <h3 id="first-visit-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  Ficha para Primeira Visita
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Preencha seus dados para enviar a Nathalia junto com o link oficial da sua ficha e plano de atendimento.
            </p>

            {validationError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>{validationError}</span>
              </div>
            )}

            {/* Field 1: Qual o plano escolhido? */}
            <div className="space-y-2">
              <label htmlFor="planId" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                1. Qual o plano escolhido? <span className="text-rose-500">*</span>
              </label>
              <select
                id="planId"
                value={formData.planId}
                onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
              >
                {plansData.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} — {plan.pricePrefix} {plan.priceValue} {plan.pricePeriod} ({plan.badge})
                  </option>
                ))}
              </select>
            </div>

            {/* Conteúdo do Plano Escolhido (Live Preview Card) */}
            <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-brand-900 flex items-center gap-2">
                  <i className="fa-solid fa-kit-medical text-brand-600"></i> Plano Escolhido
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

              <div className="pt-2 border-t border-brand-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {selectedPlan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <i className="fa-solid fa-check text-emerald-600 text-[11px] shrink-0"></i>
                    <span>{feat.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Field 2: Nome do Paciente */}
            <div className="space-y-1.5">
              <label htmlFor="patientName" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                2. Nome do Paciente <span className="text-rose-500">*</span>
              </label>
              <input
                id="patientName"
                type="text"
                required
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                placeholder="Ex.: Maria de Fátima Silva"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Field 3: Contato (Telefone / WhatsApp) */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                3. Contato (WhatsApp / Telefone) <span className="text-rose-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Ex.: (64) 98123-4567"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Field 4: Endereço Completo */}
            <div className="space-y-1.5">
              <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                4. Endereço da Visita <span className="text-rose-500">*</span>
              </label>
              <input
                id="address"
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Rua/Av., nº, bairro, complemento, cidade (Quirinópolis - GO)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Field 5: Período Preferencial & Queixa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="preferredPeriod" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Melhor Horário / Período
                </label>
                <select
                  id="preferredPeriod"
                  value={formData.preferredPeriod}
                  onChange={(e) => setFormData({ ...formData, preferredPeriod: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
                >
                  <option value="A combinar pelo WhatsApp">A combinar pelo WhatsApp</option>
                  <option value="Manhã (08h às 12h)">Manhã (08h às 12h)</option>
                  <option value="Tarde (13h às 18h)">Tarde (13h às 18h)</option>
                  <option value="Noite (18h às 20h)">Noite (18h às 20h)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="mainComplaint" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Motivo / Queixa Principal (opcional)
                </label>
                <input
                  id="mainComplaint"
                  type="text"
                  value={formData.mainComplaint}
                  onChange={(e) => setFormData({ ...formData, mainComplaint: e.target.value })}
                  placeholder="Ex.: Pós-cirúrgico, dor lombar, etc."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isSubmitting || isGeneratingPdf}
                className="flex-1 inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin text-lg"></i>
                    <span>Processando e abrindo WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-brands fa-whatsapp text-xl"></i>
                    <span>Enviar Solicitação no WhatsApp</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleGeneratePdfFromForm}
                disabled={isSubmitting || isGeneratingPdf}
                className="inline-flex items-center justify-center gap-2 py-4 px-5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-sm border border-brand-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
              >
                {isGeneratingPdf ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin text-base text-brand-600"></i>
                    <span>Gerando PDF...</span>
                  </>
                ) : pdfSuccess ? (
                  <>
                    <i className="fa-solid fa-circle-check text-base text-emerald-600"></i>
                    <span>PDF Baixado!</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-file-pdf text-base text-brand-600"></i>
                    <span>Baixar Ficha em PDF</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting || isGeneratingPdf}
                className="px-5 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-500">
              <i className="fa-solid fa-lock text-brand-600 mr-1"></i> Seus dados são enviados diretamente a Nathalia para confirmação da visita.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
