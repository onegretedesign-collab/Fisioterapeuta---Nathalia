import test from 'node:test';
import assert from 'node:assert/strict';
import { plansData } from '../data/plans.ts';
import {
  encodeFichaToUrlParam,
  decodeFichaFromUrlParam
} from './fichaLink.ts';
import {
  buildFirstVisitWhatsAppMessage,
  type FirstVisitFormData,
  type FirstVisitSubmission
} from './generateFirstVisitPdf.ts';

test('encodeFichaToUrlParam and decodeFichaFromUrlParam roundtrip accurately', () => {
  const plan = plansData.find((p) => p.id === 'mensal')!;
  const submission: FirstVisitSubmission = {
    formData: {
      planId: 'mensal',
      patientName: 'Beatriz Vasconcelos',
      phone: '(64) 99876-5432',
      address: 'Rua das Palmeiras, 88, Bairro Alvorada, Quirinópolis - GO',
      preferredPeriod: 'Tarde (13h às 18h)',
      mainComplaint: 'Reabilitação pós-cirurgia de joelho direito',
    },
    selectedPlan: plan,
    protocolNumber: '789123',
    generatedAt: '19/10/2026 às 09:15',
  };

  const param = encodeFichaToUrlParam(submission);
  assert.ok(param.length > 20, 'Param should be a valid string');

  const decoded = decodeFichaFromUrlParam(param);
  assert.ok(decoded !== null, 'Decoded submission should not be null');
  assert.equal(decoded.formData.patientName, 'Beatriz Vasconcelos');
  assert.equal(decoded.formData.phone, '(64) 99876-5432');
  assert.equal(decoded.formData.address, 'Rua das Palmeiras, 88, Bairro Alvorada, Quirinópolis - GO');
  assert.equal(decoded.formData.preferredPeriod, 'Tarde (13h às 18h)');
  assert.equal(decoded.formData.mainComplaint, 'Reabilitação pós-cirurgia de joelho direito');
  assert.equal(decoded.selectedPlan.id, 'mensal');
  assert.equal(decoded.protocolNumber, '789123');
  assert.equal(decoded.generatedAt, '19/10/2026 às 09:15');
});

test('buildFirstVisitWhatsAppMessage includes direct link for Nathalia', () => {
  const plan = plansData.find((p) => p.id === 'trimestral')!;
  const formData: FirstVisitFormData = {
    planId: 'trimestral',
    patientName: 'Lucas Oliveira',
    phone: '(64) 99123-4567',
    address: 'Av. Brasil, 100, Quirinópolis - GO',
    preferredPeriod: 'Manhã',
    mainComplaint: 'Dor crônica na cervical',
  };

  const dummyUrl = 'https://meusite.com/?ficha=XYZ123';
  const message = buildFirstVisitWhatsAppMessage(formData, plan, '555666', dummyUrl);

  assert.ok(message.includes('Lucas Oliveira'));
  assert.ok(message.includes('(64) 99123-4567'));
  assert.ok(message.includes('Av. Brasil, 100'));
  assert.ok(message.includes('LINK PARA GERAR / IMPRIMIR O PDF NO SEU APARELHO (TAMANHO A4)'));
  assert.ok(message.includes(dummyUrl));
  // Must NOT tell patient to attach PDF from their device
  assert.ok(!message.includes('estou enviando em anexo aqui'));
});
