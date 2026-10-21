import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { ServiceModal } from './components/ServiceModal.tsx';
import { TestimonialsSection } from './components/TestimonialsSection.tsx';
import { PlansSection } from './components/PlansSection.tsx';
import { ContractModal } from './components/ContractModal.tsx';
import { FirstVisitModal } from './components/FirstVisitModal.tsx';
import { DoctorFichaModal } from './components/DoctorFichaModal.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { Footer } from './components/Footer.tsx';
import { ServiceItem, createWhatsAppUrl } from './data/services.ts';
import { decodeFichaFromUrlParam } from './utils/fichaLink.ts';
import { FirstVisitSubmission } from './utils/generateFirstVisitPdf.ts';

export default function App() {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isFirstVisitModalOpen, setIsFirstVisitModalOpen] = useState(false);
  const [firstVisitPlanId, setFirstVisitPlanId] = useState<string | undefined>(undefined);
  const [doctorFichaSubmission, setDoctorFichaSubmission] = useState<FirstVisitSubmission | null>(null);

  // Detect ?ficha= in URL for Nathalia's direct access
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fichaParam = params.get('ficha');
      if (fichaParam) {
        const decoded = decodeFichaFromUrlParam(fichaParam);
        if (decoded) {
          setDoctorFichaSubmission(decoded);
        }
      }
    } catch (e) {
      console.error('Erro ao ler parâmetro ficha da URL:', e);
    }
  }, []);

  const floatingWhatsAppUrl = createWhatsAppUrl(
    "Olá, Nathalia! Gostaria de tirar dúvidas e consultar horários."
  );

  const handleOpenFirstVisit = (planId?: string) => {
    setFirstVisitPlanId(planId);
    setIsFirstVisitModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Header / Navbar */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero />
        <AboutSection onOpenFirstVisitModal={handleOpenFirstVisit} />
        <ServicesSection onSelectService={(service) => setSelectedService(service)} />
        <TestimonialsSection onOpenFirstVisitModal={handleOpenFirstVisit} />
        <PlansSection 
          onOpenContractModal={() => setIsContractModalOpen(true)} 
          onOpenFirstVisitModal={handleOpenFirstVisit}
        />
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Quick Action Button on Mobile/Desktop */}
      <a
        href={floatingWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com Nathalia no WhatsApp"
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        <i className="fa-brands fa-whatsapp text-3xl"></i>
      </a>

      {/* Service Detail Modal */}
      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />

      {/* Contract Terms Modal */}
      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
      />

      {/* First Visit Form Modal */}
      <FirstVisitModal
        isOpen={isFirstVisitModalOpen}
        initialPlanId={firstVisitPlanId}
        onClose={() => setIsFirstVisitModalOpen(false)}
        onPreviewFicha={(submission) => setDoctorFichaSubmission(submission)}
      />

      {/* Doctor's Ficha View & PDF Generator Modal */}
      <DoctorFichaModal
        submission={doctorFichaSubmission}
        onClose={() => {
          setDoctorFichaSubmission(null);
          // Clean URL param without page reload
          if (window.location.search.includes('ficha=')) {
            window.history.replaceState({}, '', window.location.pathname);
          }
        }}
      />
    </div>
  );
}
