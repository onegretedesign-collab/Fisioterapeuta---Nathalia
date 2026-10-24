export type AppointmentStatus = 'agendado' | 'confirmado' | 'concluido' | 'cancelado';
export type ServiceLocation = 'Consultório' | 'Domiciliar (Home Care)';

export interface Appointment {
  id: string;
  patientName: string;
  phone?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  specialty: string;
  serviceType: ServiceLocation;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentInput {
  patientName: string;
  phone?: string;
  date: string;
  time: string;
  specialty: string;
  serviceType: ServiceLocation;
  notes?: string;
  status?: AppointmentStatus;
}

export const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  'agendado',
  'confirmado',
  'concluido',
  'cancelado'
];
