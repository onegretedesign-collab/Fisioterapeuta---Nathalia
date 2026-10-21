import test from 'node:test';
import assert from 'node:assert/strict';
import { doctorProfileData } from './doctorProfile.ts';

test('doctorProfileData has complete required fields and credentials', () => {
  assert.equal(doctorProfileData.name, 'Nathalia Guimarães Nolêto');
  assert.ok(doctorProfileData.title.length > 10);
  assert.ok(doctorProfileData.crefito.includes('CREFITO'));
  assert.equal(doctorProfileData.location, 'Quirinópolis - GO');
  assert.ok(doctorProfileData.quote.length > 30);
  assert.ok(doctorProfileData.bioParagraphs.length >= 3);
  assert.equal(doctorProfileData.pillars.length, 4);
  assert.equal(doctorProfileData.credentials.length, 4);

  for (const pillar of doctorProfileData.pillars) {
    assert.ok(pillar.title.length > 3);
    assert.ok(pillar.description.length > 10);
    assert.ok(pillar.icon.startsWith('fa-'));
  }

  for (const cred of doctorProfileData.credentials) {
    assert.ok(cred.label.length > 5);
    assert.ok(cred.icon.startsWith('fa-'));
  }
});
