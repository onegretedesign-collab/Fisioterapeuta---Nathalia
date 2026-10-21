import React, { useState, useEffect } from 'react';
import { contractClauses } from '../data/contract.ts';
import { generateContractPdf } from '../utils/generateContractPdf.ts';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({ isOpen, onClose }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
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
  }, [isOpen, onClose]);

  const handleDownloadContractPdf = async () => {
    setIsGeneratingPdf(true);
    setPdfSuccess(false);
    try {
      // Yield to event loop so browser renders the loading spinner
      await new Promise((resolve) => setTimeout(resolve, 650));
      const doc = generateContractPdf();
      doc.save('Termos_Garantias_Contratuais_Nathalia.pdf');
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3500);
    } catch (err) {
      console.error('Erro ao gerar PDF do contrato:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contract-modal-title"
    >
      <div 
        onClick={onClose} 
        className="modal-backdrop fixed inset-0 transition-opacity"
      />
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6 sm:p-8 shadow-2xl z-10 border border-slate-100">
        
        <button 
          onClick={onClose} 
          aria-label="Fechar resumo do contrato"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 text-xl">
            <i className="fa-solid fa-file-contract"></i>
          </div>
          <div>
            <h3 id="contract-modal-title" className="text-2xl font-bold text-slate-900">
              Termos & Garantias Contratuais
            </h3>
            <p className="text-xs text-brand-600 font-semibold uppercase tracking-wider">
              Segurança jurídica para o paciente e profissional
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          {contractClauses.map((clause) => (
            <div key={clause.number} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <h4 className="font-bold text-slate-800 text-sm">
                {clause.number}. {clause.title}
              </h4>
              <p className="text-xs text-slate-600">
                {clause.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDownloadContractPdf}
            disabled={isGeneratingPdf}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-sm border border-brand-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          >
            {isGeneratingPdf ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin text-base text-brand-600"></i>
                <span>Gerando PDF dos Termos...</span>
              </>
            ) : pdfSuccess ? (
              <>
                <i className="fa-solid fa-circle-check text-base text-emerald-600"></i>
                <span>PDF Baixado com Sucesso!</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-file-pdf text-base text-brand-600"></i>
                <span>Baixar Termos em PDF</span>
              </>
            )}
          </button>

          <button 
            type="button"
            onClick={onClose} 
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
