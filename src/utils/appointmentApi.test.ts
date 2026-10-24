import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkTimeCollision,
  createPatientConfirmationUrl,
  CLINICAL_SPECIALTIES,
  COMMON_TIME_SLOTS
} from './appointmentApi.ts';
import type { Appointment } from '../types/appointment.ts';

const mockAppointments: Appointment[] = [
  {
    id: 'apt-1',
    patientName: 'Maria Silva',
    phone: '64998881234',
    date: '2026-10-25',
    time: '09:00',
    specialty: 'Traumato-Ortopédica',
    serviceType: 'Consultório',
    status: 'agendado',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'apt-2',
    patientName: 'João Santos',
    phone: '64991112222',
    date: '2026-10-25',
    time: '14:00',
    specialty: 'Esportiva',
    serviceType: 'Consultório',
    status: 'cancelado',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

test('checkTimeCollision accurately detects occupied slot on same date and time', () => {
  const conflict = checkTimeCollision(mockAppointments, '2026-10-25', '09:00');
  assert.ok(conflict !== null);
  assert.equal(conflict?.patientName, 'Maria Silva');
});

test('checkTimeCollision allows available slot on same date with different time', () => {
  const freeSlot = checkTimeCollision(mockAppointments, '2026-10-25', '10:00');
  assert.equal(freeSlot, null);
});

test('checkTimeCollision allows slot if previous appointment was cancelled', () => {
  const cancelledSlot = checkTimeCollision(mockAppointments, '2026-10-25', '14:00');
  assert.equal(cancelledSlot, null);
});

test('checkTimeCollision ignores current appointment when rescheduling with excludeId', () => {
  const selfConflict = checkTimeCollision(mockAppointments, '2026-10-25', '09:00', 'apt-1');
  assert.equal(selfConflict, null);
});

test('createPatientConfirmationUrl builds a properly encoded WhatsApp link', () => {
  const url = createPatientConfirmationUrl(mockAppointments[0]);
  assert.ok(url.startsWith('https://wa.me/5564998881234?text='));
  assert.ok(url.includes(encodeURIComponent('Maria Silva')));
  assert.ok(url.includes(encodeURIComponent('Traumato-Ortopédica')));
  assert.ok(url.includes(encodeURIComponent('09:00')));
});

test('CLINICAL_SPECIALTIES includes all core required specialties and common time slots are configured', () => {
  assert.ok(CLINICAL_SPECIALTIES.includes('Traumato-Ortopédica'));
  assert.ok(CLINICAL_SPECIALTIES.includes('Neurofuncional (Neurologia)'));
  assert.ok(CLINICAL_SPECIALTIES.includes('Respiratória / Pulmonar'));
  assert.ok(CLINICAL_SPECIALTIES.includes('Esportiva'));
  assert.ok(CLINICAL_SPECIALTIES.includes('Gerontologia'));
  assert.ok(CLINICAL_SPECIALTIES.includes('Fisioterapia Domiciliar (Home Care)'));
  assert.ok(COMMON_TIME_SLOTS.length >= 15);
});
