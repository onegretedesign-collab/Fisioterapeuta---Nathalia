import test from 'node:test';
import assert from 'node:assert/strict';
import { servicesData, createWhatsAppUrl, WHATSAPP_PHONE } from './services.ts';
import { plansData, getPlanWhatsAppUrl } from './plans.ts';
import { faqData } from './faq.ts';
import { contractClauses } from './contract.ts';

test('servicesData contains all 6 required clinical services', () => {
  assert.equal(servicesData.length, 6);
  const ids = servicesData.map(s => s.id);
  assert.deepEqual(ids, [
    'pos-cirurgico',
    'acidente-trabalho',
    'massagem',
    'auriculoterapia',
    'dry-needling',
    'terapias-integrativas'
  ]);
});

test('every service has non-empty fields, valid duration, and benefits list', () => {
  for (const s of servicesData) {
    assert.ok(s.title.length > 0, `Title is empty for ${s.id}`);
    assert.ok(s.badge.length > 0, `Badge is empty for ${s.id}`);
    assert.ok(s.icon.startsWith('fa-'), `Icon is invalid for ${s.id}`);
    assert.ok(s.cardBrief.length > 10, `Card brief too short for ${s.id}`);
    assert.ok(s.description.length > 20, `Description too short for ${s.id}`);
    assert.ok(s.benefits.length >= 3, `Benefits should have >= 3 items for ${s.id}`);
    assert.ok(s.duration.includes('minutos'), `Duration should specify minutes for ${s.id}`);
    assert.ok(s.whatsappMessage.includes('Nathalia'), `WhatsApp message missing greeting for ${s.id}`);
  }
});

test('createWhatsAppUrl correctly encodes message parameters and uses 64 99274-9005', () => {
  const msg = 'Olá, Nathalia! Gostaria de agendar.';
  const url = createWhatsAppUrl(msg);
  assert.equal(WHATSAPP_PHONE, '5564992749005');
  assert.ok(url.startsWith(`https://wa.me/5564992749005?text=`));
  assert.ok(url.includes(encodeURIComponent(msg)));
});

test('plansData contains 4 plans with correct prices and contract terms', () => {
  assert.equal(plansData.length, 4);
  const planIds = plansData.map(p => p.id);
  assert.deepEqual(planIds, ['semanal', 'mensal', 'trimestral', 'anual']);

  const trimestral = plansData.find(p => p.id === 'trimestral')!;
  assert.equal(trimestral.highlighted, true);
  assert.equal(trimestral.priceValue, 'R$ 800');

  const contractFeature = trimestral.features.find(f => f.text.includes('Contrato'));
  assert.ok(contractFeature, 'Trimestral plan must include contract clause');
});

test('faqData contains 4 complete question/answer pairs', () => {
  assert.equal(faqData.length, 4);
  for (const item of faqData) {
    assert.ok(item.question.length > 5);
    assert.ok(item.answer.length > 10);
  }
});

test('contractClauses covers all 4 main legal protection points', () => {
  assert.equal(contractClauses.length, 4);
  assert.equal(contractClauses[0].title, 'Objeto e Avaliação Fisioterapêutica');
  assert.equal(contractClauses[1].title, 'Política de Reposição e Avisos de Falta');
  assert.equal(contractClauses[2].title, 'Prazo de Vigência e Pausa Programada');
  assert.equal(contractClauses[3].title, 'Condições de Pagamento e Rescisão Transparente');
});
