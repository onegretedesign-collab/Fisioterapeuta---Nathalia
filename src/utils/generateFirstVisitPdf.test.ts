import test from 'node:test';
import assert from 'node:assert/strict';
import { plansData } from '../data/plans.ts';
import {
  buildFirstVisitWhatsAppMessage,
  generateFirstVisitPdf,
  type FirstVisitFormData
} from './generateFirstVisitPdf.ts';

test('buildFirstVisitWhatsAppMessage formats all required fields accurately', () => {
  const plan = plansData.find(p => p.id === 'trimestral')!;
  const formData: FirstVisitFormData = {
    planId: 'trimestral',
    patientName: 'Maria Silva',
    phone: '(64) 99999-8888',
    address: 'Rua das Flores, 123, Centro, Quirinópolis - GO',
    preferredPeriod: 'Tarde (após 14h)',
    mainComplaint: 'Reabilitação pós-cirurgia de joelho'
  };

  const message = buildFirstVisitWhatsAppMessage(formData, plan, '123456', 'https://example.com/?ficha=test');

  assert.ok(message.includes('Maria Silva'));
  assert.ok(message.includes('(64) 99999-8888'));
  assert.ok(message.includes('Rua das Flores, 123'));
  assert.ok(message.includes('Plano Trimestral'));
  assert.ok(message.includes('R$ 800'));
  assert.ok(message.includes('Protocolo: #123456'));
  assert.ok(message.includes('Reabilitação pós-cirurgia de joelho'));
  assert.ok(message.includes('https://example.com/?ficha=test'));
});

test('generateFirstVisitPdf returns a valid PDF document with 1 page', () => {
  const plan = plansData[0];
  const formData: FirstVisitFormData = {
    planId: plan.id,
    patientName: 'João Pereira',
    phone: '(64) 98888-7777',
    address: 'Av. Brasil, 450, Bairro Novo, Quirinópolis - GO',
    preferredPeriod: 'Manhã',
    mainComplaint: 'Dores lombares intensas'
  };

  const doc = generateFirstVisitPdf({
    formData,
    selectedPlan: plan,
    protocolNumber: '654321',
    generatedAt: '18/10/2026 15:30'
  });

  assert.ok(doc);
  assert.equal(doc.getNumberOfPages(), 1);
  const pdfOutput = doc.output('datauristring');
  assert.ok(pdfOutput.startsWith('data:application/pdf'));
});
