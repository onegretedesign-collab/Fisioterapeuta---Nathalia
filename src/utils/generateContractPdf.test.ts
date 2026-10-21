import test from 'node:test';
import assert from 'node:assert/strict';
import { generateContractPdf } from './generateContractPdf.ts';

test('generateContractPdf generates a valid A4 PDF document', () => {
  const doc = generateContractPdf('Maria da Silva');
  assert.ok(doc);
  assert.equal(doc.getNumberOfPages(), 1);
  const pdfOutput = doc.output('datauristring');
  assert.ok(pdfOutput.startsWith('data:application/pdf'));
});

test('generateContractPdf works without patient name provided', () => {
  const doc = generateContractPdf();
  assert.ok(doc);
  assert.equal(doc.getNumberOfPages(), 1);
});
