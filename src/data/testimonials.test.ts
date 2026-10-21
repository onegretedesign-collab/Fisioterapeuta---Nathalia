import test from 'node:test';
import assert from 'node:assert/strict';
import {
  testimonialsData,
  trustStats,
  filterTestimonials,
  type TestimonialItem
} from './testimonials.ts';

test('testimonialsData contains all 6 verified clinical testimonials', () => {
  assert.equal(testimonialsData.length, 6);
  for (const item of testimonialsData) {
    assert.ok(item.id.startsWith('dep-'));
    assert.ok(item.name.length > 5, 'Name too short');
    assert.equal(item.rating, 5, 'Rating must be 5 stars');
    assert.ok(item.condition.length > 5, 'Condition must be detailed');
    assert.ok(item.outcome.length > 5, 'Outcome must specify clinical result');
    assert.ok(item.quote.length > 40, 'Quote must be substantial and descriptive');
    assert.ok(item.location.includes('Quirinópolis'));
    assert.ok(item.initials.length >= 2);
  }
});

test('filterTestimonials filters accurately by category or returns all', () => {
  const all = filterTestimonials(testimonialsData, 'todos');
  assert.equal(all.length, 6);

  const posCirurgico = filterTestimonials(testimonialsData, 'pos-cirurgico');
  assert.ok(posCirurgico.length >= 1);
  assert.ok(posCirurgico.every(t => t.category === 'pos-cirurgico'));

  const coluna = filterTestimonials(testimonialsData, 'coluna-dor');
  assert.ok(coluna.length >= 2);
  assert.ok(coluna.every(t => t.category === 'coluna-dor'));

  const integrativas = filterTestimonials(testimonialsData, 'integrativas');
  assert.ok(integrativas.length >= 1);
  assert.ok(integrativas.every(t => t.category === 'integrativas'));

  const planos = filterTestimonials(testimonialsData, 'planos');
  assert.ok(planos.length >= 1);
  assert.ok(planos.every(t => t.category === 'planos'));
});

test('trustStats contains required credibility indicators', () => {
  assert.equal(trustStats.length, 4);
  const values = trustStats.map(s => s.value);
  assert.ok(values.includes('+500'));
  assert.ok(values.includes('5.0 ★'));
  assert.ok(values.includes('100%'));
  assert.ok(values.includes('Quirinópolis'));
});
