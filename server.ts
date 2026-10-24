import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to data file
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'appointments.json');

// Ensure database file exists
function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readAppointments(): any[] {
  ensureDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading appointments.json:', err);
    return [];
  }
}

function writeAppointments(data: any[]): void {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// 1. Auth Endpoint (Usuário: Nathalia | Senha: 124578)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  const normalizedUser = (username || '').trim().toLowerCase();
  
  if (normalizedUser === 'nathalia' && password === '124578') {
    return res.json({
      success: true,
      token: 'session_auth_' + Date.now(),
      user: {
        name: 'Nathalia Guimarães Nolêto',
        role: 'fisioterapeuta'
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Usuário ou senha incorretos. Verifique suas credenciais.'
  });
});

// 2. GET all appointments
app.get('/api/appointments', (req, res) => {
  const appointments = readAppointments();
  // Sort by date and time ascending
  appointments.sort((a, b) => {
    const dtA = `${a.date} ${a.time}`;
    const dtB = `${b.date} ${b.time}`;
    return dtA.localeCompare(dtB);
  });
  res.json(appointments);
});

// 3. POST new appointment with collision detection
app.post('/api/appointments', (req, res) => {
  const { patientName, phone, date, time, specialty, serviceType, notes } = req.body || {};

  if (!patientName || !date || !time || !specialty) {
    return res.status(400).json({
      error: 'Campos obrigatórios não preenchidos.',
      details: 'Nome, Data, Horário e Especialidade são obrigatórios.'
    });
  }

  const appointments = readAppointments();

  // Collision detection: Check if there is already an active appointment at the same date and time
  const conflict = appointments.find(
    (a) => a.date === date && a.time === time && a.status !== 'cancelado'
  );

  if (conflict) {
    const formattedDate = date.split('-').reverse().join('/');
    return res.status(409).json({
      error: 'Horário já ocupado',
      message: `Choque de horário! Já existe um agendamento para "${conflict.patientName}" no dia ${formattedDate} às ${time}. Escolha outro horário para não sobrepor pacientes.`,
      conflictWith: conflict
    });
  }

  const newAppointment = {
    id: 'apt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    patientName: patientName.trim(),
    phone: phone ? phone.trim() : '',
    date,
    time,
    specialty,
    serviceType: serviceType || 'Consultório',
    notes: notes ? notes.trim() : '',
    status: 'agendado',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  appointments.push(newAppointment);
  writeAppointments(appointments);

  res.status(201).json(newAppointment);
});

// 4. PUT update/reschedule appointment
app.put('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const { patientName, phone, date, time, specialty, serviceType, notes, status } = req.body || {};

  const appointments = readAppointments();
  const index = appointments.findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Agendamento não encontrado.' });
  }

  const targetDate = date || appointments[index].date;
  const targetTime = time || appointments[index].time;
  const targetStatus = status || appointments[index].status;

  // Collision detection if active
  if (targetStatus !== 'cancelado') {
    const conflict = appointments.find(
      (a) => a.id !== id && a.date === targetDate && a.time === targetTime && a.status !== 'cancelado'
    );

    if (conflict) {
      const formattedDate = targetDate.split('-').reverse().join('/');
      return res.status(409).json({
        error: 'Horário já ocupado',
        message: `Choque de horário! Já existe um agendamento para "${conflict.patientName}" no dia ${formattedDate} às ${targetTime}. Escolha outro horário para reagendar.`,
        conflictWith: conflict
      });
    }
  }

  const existing = appointments[index];
  const updated = {
    ...existing,
    patientName: patientName !== undefined ? patientName.trim() : existing.patientName,
    phone: phone !== undefined ? phone.trim() : existing.phone,
    date: targetDate,
    time: targetTime,
    specialty: specialty || existing.specialty,
    serviceType: serviceType || existing.serviceType,
    notes: notes !== undefined ? notes.trim() : existing.notes,
    status: targetStatus,
    updatedAt: new Date().toISOString()
  };

  appointments[index] = updated;
  writeAppointments(appointments);

  res.json(updated);
});

// 5. DELETE appointment
app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const appointments = readAppointments();
  const initialLength = appointments.length;
  const filtered = appointments.filter((a) => a.id !== id);

  if (filtered.length === initialLength) {
    return res.status(404).json({ error: 'Agendamento não encontrado.' });
  }

  writeAppointments(filtered);
  res.json({ success: true, message: 'Agendamento excluído com sucesso do banco de dados.' });
});

// Start Express + Vite
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Fisioterapia Nathalia rodando em http://localhost:${PORT}`);
  });
}

startServer();
