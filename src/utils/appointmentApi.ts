import type { Appointment, AppointmentInput } from '../types/appointment.ts';

const LOCAL_STORAGE_KEY = 'nathalia_appointments_db';
const AUTH_STORAGE_KEY = 'nathalia_auth_session';

export const CLINICAL_SPECIALTIES = [
  "Traumato-Ortopédica",
  "Neurofuncional (Neurologia)",
  "Respiratória / Pulmonar",
  "Esportiva",
  "Gerontologia",
  "Fisioterapia Domiciliar (Home Care)",
  "Avaliação Inicial / Geral"
];

export const COMMON_TIME_SLOTS = [
  "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"
];

// Auth Helpers
export function isUserAuthenticated(): boolean {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    return !!session && session.user === 'Nathalia';
  } catch {
    return false;
  }
}

export function saveUserSession(user: string = 'Nathalia') {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
    user,
    timestamp: Date.now()
  }));
}

export function clearUserSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

// Local cache backup
function getLocalCache(): Appointment[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCache(list: Appointment[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Ignore storage quota
  }
}

// Check for collision locally (instant check for UI)
export function checkTimeCollision(
  appointments: Appointment[],
  date: string,
  time: string,
  excludeId?: string
): Appointment | null {
  const match = appointments.find(
    (a) =>
      a.date === date &&
      a.time === time &&
      a.status !== 'cancelado' &&
      (!excludeId || a.id !== excludeId)
  );
  return match || null;
}

// Fetch all appointments
export async function fetchAppointments(): Promise<Appointment[]> {
  try {
    const res = await fetch('/api/appointments');
    if (res.ok) {
      const data = await res.json();
      saveLocalCache(data);
      return data;
    }
  } catch (err) {
    console.warn('API offline or unreachable, using local cache:', err);
  }
  return getLocalCache();
}

// Create new appointment
export async function createAppointment(input: AppointmentInput): Promise<Appointment> {
  // Pre-validate locally
  const current = getLocalCache();
  const localConflict = checkTimeCollision(current, input.date, input.time);
  if (localConflict) {
    const d = input.date.split('-').reverse().join('/');
    throw new Error(
      `Choque de horário! Já existe um atendimento para "${localConflict.patientName}" no dia ${d} às ${input.time}. Escolha outro horário.`
    );
  }

  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || errData.error || 'Erro ao criar agendamento.');
    }

    const created = await res.json();
    const updatedList = [...current, created];
    saveLocalCache(updatedList);
    return created;
  } catch (err: any) {
    // If offline, create locally with fallback
    if (err.message && err.message.includes('Choque de horário')) {
      throw err;
    }
    const fallback: Appointment = {
      id: 'apt_local_' + Date.now(),
      patientName: input.patientName.trim(),
      phone: input.phone?.trim() || '',
      date: input.date,
      time: input.time,
      specialty: input.specialty,
      serviceType: input.serviceType,
      notes: input.notes?.trim() || '',
      status: input.status || 'agendado',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [...current, fallback];
    saveLocalCache(updated);
    return fallback;
  }
}

// Update / Reschedule appointment
export async function updateAppointment(
  id: string,
  updates: Partial<AppointmentInput>
): Promise<Appointment> {
  const current = getLocalCache();

  // If date or time changed, check local collision
  if (updates.date || updates.time) {
    const existing = current.find((a) => a.id === id);
    const targetDate = updates.date || existing?.date || '';
    const targetTime = updates.time || existing?.time || '';
    if (updates.status !== 'cancelado') {
      const conflict = checkTimeCollision(current, targetDate, targetTime, id);
      if (conflict) {
        const d = targetDate.split('-').reverse().join('/');
        throw new Error(
          `Choque de horário! Já existe um atendimento para "${conflict.patientName}" no dia ${d} às ${targetTime}. Escolha outro horário para reagendar.`
        );
      }
    }
  }

  try {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || errData.error || 'Erro ao reagendar atendimento.');
    }

    const updated = await res.json();
    const idx = current.findIndex((a) => a.id === id);
    if (idx !== -1) {
      current[idx] = updated;
      saveLocalCache([...current]);
    }
    return updated;
  } catch (err: any) {
    if (err.message && err.message.includes('Choque de horário')) {
      throw err;
    }
    const idx = current.findIndex((a) => a.id === id);
    if (idx !== -1) {
      current[idx] = {
        ...current[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      saveLocalCache([...current]);
      return current[idx];
    }
    throw err;
  }
}

// Delete appointment
export async function deleteAppointment(id: string): Promise<void> {
  const current = getLocalCache();
  try {
    const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 404) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Erro ao excluir agendamento.');
    }
  } catch (err) {
    console.warn('Network error deleting from server, deleting locally:', err);
  }
  const filtered = current.filter((a) => a.id !== id);
  saveLocalCache(filtered);
}

// Generate patient WhatsApp confirmation URL
export function createPatientConfirmationUrl(appointment: Appointment): string {
  const cleanPhone = (appointment.phone || '').replace(/\D/g, '');
  const targetPhone = cleanPhone.length >= 10 ? (cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone) : '';
  const d = appointment.date.split('-').reverse().join('/');
  
  const msg = `Olá, ${appointment.patientName}!\n\nConfirmando seu atendimento de *Fisioterapia (${appointment.specialty})*:\n📅 *Data:* ${d}\n⏰ *Horário:* ${appointment.time}\n📍 *Local:* ${appointment.serviceType}\n\nFisioterapeuta: *Nathalia Guimarães Nolêto*\nSe precisar remarcar ou tiver qualquer dúvida, estou à disposição!`;

  if (targetPhone) {
    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
  }
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}
