import React, { useState, useEffect, useMemo } from 'react';
import type { Appointment, AppointmentInput, AppointmentStatus, ServiceLocation } from '../types/appointment.ts';
import {
  fetchAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  checkTimeCollision,
  createPatientConfirmationUrl,
  isUserAuthenticated,
  saveUserSession,
  clearUserSession,
  CLINICAL_SPECIALTIES,
  COMMON_TIME_SLOTS
} from '../utils/appointmentApi.ts';

interface ScheduleDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleDashboardModal: React.FC<ScheduleDashboardModalProps> = ({
  isOpen,
  onClose
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('Nathalia');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'hoje' | 'proximos' | 'concluidos'>('todos');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('todas');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');

  // Form Modal (New or Edit)
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [patientName, setPatientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('09:00');
  const [specialty, setSpecialty] = useState<string>(CLINICAL_SPECIALTIES[0]);
  const [serviceType, setServiceType] = useState<ServiceLocation>('Consultório');
  const [notes, setNotes] = useState<string>('');
  const [status, setStatus] = useState<AppointmentStatus>('agendado');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Delete Confirmation state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Check auth and load appointments
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const authed = isUserAuthenticated();
      setIsAuthenticated(authed);
      if (authed) {
        loadData();
      }
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Erro ao carregar agendamentos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass })
      });

      if (res.ok) {
        saveUserSession('Nathalia');
        setIsAuthenticated(true);
        loadData();
      } else {
        // Fallback local check
        if (cleanUser === 'nathalia' && cleanPass === '124578') {
          saveUserSession('Nathalia');
          setIsAuthenticated(true);
          loadData();
        } else {
          setLoginError('Usuário ou senha incorretos. Acesso restrito à Dra. Nathalia.');
        }
      }
    } catch {
      // Local fallback
      if (cleanUser === 'nathalia' && cleanPass === '124578') {
        saveUserSession('Nathalia');
        setIsAuthenticated(true);
        loadData();
      } else {
        setLoginError('Usuário ou senha incorretos.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    clearUserSession();
    setIsAuthenticated(false);
    setPassword('');
    setLoginError(null);
  };

  // Open Create Form
  const openCreateForm = () => {
    setEditingAppointment(null);
    setPatientName('');
    setPhone('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('09:00');
    setSpecialty(CLINICAL_SPECIALTIES[0]);
    setServiceType('Consultório');
    setNotes('');
    setStatus('agendado');
    setIsFormOpen(true);
  };

  // Open Edit / Reschedule Form
  const openEditForm = (apt: Appointment) => {
    setEditingAppointment(apt);
    setPatientName(apt.patientName);
    setPhone(apt.phone || '');
    setDate(apt.date);
    setTime(apt.time);
    setSpecialty(apt.specialty);
    setServiceType(apt.serviceType);
    setNotes(apt.notes || '');
    setStatus(apt.status);
    setIsFormOpen(true);
  };

  // Conflict detection in real-time for the selected date & time
  const currentConflict = useMemo(() => {
    if (!date || !time) return null;
    return checkTimeCollision(appointments, date, time, editingAppointment?.id);
  }, [appointments, date, time, editingAppointment]);

  // Submit appointment (Create or Update)
  const handleSubmitAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setFeedbackMessage({ type: 'error', text: 'Informe o nome do paciente.' });
      return;
    }
    if (currentConflict) {
      const d = date.split('-').reverse().join('/');
      setFeedbackMessage({
        type: 'error',
        text: `Horário ocupado! Já existe atendimento para "${currentConflict.patientName}" no dia ${d} às ${time}. Escolha outro horário.`
      });
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage(null);

    const inputData: AppointmentInput = {
      patientName: patientName.trim(),
      phone: phone.trim(),
      date,
      time,
      specialty,
      serviceType,
      notes: notes.trim(),
      status
    };

    try {
      if (editingAppointment) {
        const updated = await updateAppointment(editingAppointment.id, inputData);
        setAppointments((prev) =>
          prev.map((a) => (a.id === updated.id ? updated : a))
        );
        setFeedbackMessage({
          type: 'success',
          text: `Agendamento de "${updated.patientName}" reagendado com sucesso para ${date.split('-').reverse().join('/')} às ${time}!`
        });
      } else {
        const created = await createAppointment(inputData);
        setAppointments((prev) => [...prev, created]);
        setFeedbackMessage({
          type: 'success',
          text: `Paciente "${created.patientName}" agendado com sucesso para ${date.split('-').reverse().join('/')} às ${time}!`
        });
      }
      setIsFormOpen(false);
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Erro ao salvar agendamento.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      setDeletingId(null);
      setFeedbackMessage({ type: 'success', text: 'Agendamento removido do banco de dados.' });
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Erro ao excluir agendamento.' });
    }
  };

  // Toggle quick status (e.g. mark as completed)
  const handleToggleStatus = async (apt: Appointment, newStatus: AppointmentStatus) => {
    try {
      const updated = await updateAppointment(apt.id, { status: newStatus });
      setAppointments((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
      setFeedbackMessage({
        type: 'success',
        text: `Status de "${apt.patientName}" atualizado para ${newStatus.toUpperCase()}.`
      });
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Erro ao atualizar status.' });
    }
  };

  // Filtered appointments
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Search
      const search = searchTerm.toLowerCase().trim();
      const matchSearch =
        !search ||
        apt.patientName.toLowerCase().includes(search) ||
        (apt.phone && apt.phone.includes(search)) ||
        apt.specialty.toLowerCase().includes(search);

      // Specialty
      const matchSpecialty = specialtyFilter === 'todas' || apt.specialty === specialtyFilter;

      // Date Picker Filter
      const matchSpecificDate = !selectedDateFilter || apt.date === selectedDateFilter;

      // Status Filter Tab
      let matchStatusTab = true;
      if (statusFilter === 'hoje') {
        matchStatusTab = apt.date === todayStr && apt.status !== 'cancelado';
      } else if (statusFilter === 'proximos') {
        matchStatusTab = apt.date >= todayStr && apt.status !== 'cancelado';
      } else if (statusFilter === 'concluidos') {
        matchStatusTab = apt.status === 'concluido';
      }

      return matchSearch && matchSpecialty && matchSpecificDate && matchStatusTab;
    });
  }, [appointments, searchTerm, statusFilter, specialtyFilter, selectedDateFilter, todayStr]);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = appointments.length;
    const todayCount = appointments.filter((a) => a.date === todayStr && a.status !== 'cancelado').length;
    const upcoming = appointments.filter((a) => a.date >= todayStr && a.status !== 'cancelado').length;
    return { total, todayCount, upcoming };
  }, [appointments, todayStr]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dashboard-title"
    >
      <div className="relative bg-white rounded-2xl sm:rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* ============================================================== */}
        {/* CASO NÃO ESTEJA AUTENTICADO: TELA DE LOGIN PRIVADO (NATHALIA) */}
        {/* ============================================================== */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center min-h-[460px] text-center my-auto">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              aria-label="Fechar"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20 mb-4">
              <i className="fa-solid fa-calendar-check"></i>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200/60">
              Acesso Exclusivo da Fisioterapeuta
            </span>

            <h2 id="dashboard-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Painel de Agendamentos
            </h2>
            <p className="text-slate-500 text-sm max-w-md mt-1 mb-6">
              Área de controle da agenda e pacientes da Dra. Nathalia Guimarães Nolêto. Digite suas credenciais para gerenciar horários sem choques.
            </p>

            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 text-left">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation text-base shrink-0"></i>
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Usuário
                </label>
                <div className="relative">
                  <i className="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm text-slate-900 font-medium transition-all"
                    placeholder="Digite seu usuário"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm text-slate-900 font-medium transition-all"
                    placeholder="Digite sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-arrow-right-to-bracket"></i>
                    <span>Entrar no Painel</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  <i className="fa-solid fa-shield-halved text-emerald-600 mr-1"></i>
                  Ambiente seguro e restrito
                </span>
              </div>
            </form>
          </div>
        ) : (
          /* ============================================================== */
          /* CASO AUTENTICADO: DASHBOARD COMPLETO DE GESTÃO DA NATHALIA    */
          /* ============================================================== */
          <>
            {/* Topbar do Dashboard */}
            <div className="bg-slate-900 text-white px-5 sm:px-8 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/50 bg-emerald-950 shrink-0">
                  <img
                    src="/images/favicon-site-nathalia.png"
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 id="dashboard-title" className="text-base sm:text-lg font-bold text-white tracking-tight">
                      Agenda & Pacientes
                    </h2>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-700/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Banco de Dados Ativo
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 hidden sm:block">
                    Dra. Nathalia Guimarães Nolêto • Controle de Horários Sem Conflitos
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-500/20 hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <i className="fa-solid fa-plus text-xs"></i>
                  <span>Agendar Paciente</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sair do painel"
                  className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  <span className="hidden sm:inline">Sair</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  title="Fechar e voltar ao site"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>
            </div>

            {/* Banner de Feedback temporário */}
            {feedbackMessage && (
              <div
                className={`px-5 py-2.5 text-xs font-semibold flex items-center justify-between shrink-0 ${
                  feedbackMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                    : 'bg-red-50 text-red-800 border-b border-red-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <i
                    className={`fa-solid ${
                      feedbackMessage.type === 'success' ? 'fa-circle-check text-emerald-600' : 'fa-triangle-exclamation text-red-600'
                    }`}
                  ></i>
                  <span>{feedbackMessage.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFeedbackMessage(null)}
                  className="text-slate-500 hover:text-slate-800 font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Conteúdo rolável do Dashboard */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Cards de Métricas Rápidas */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-center">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Hoje
                  </span>
                  <span className="text-xl sm:text-3xl font-extrabold text-emerald-600 block mt-0.5">
                    {stats.todayCount}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:block">
                    atendimentos programados
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-center">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Próximos
                  </span>
                  <span className="text-xl sm:text-3xl font-extrabold text-brand-700 block mt-0.5">
                    {stats.upcoming}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:block">
                    dias futuros
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-center">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Total
                  </span>
                  <span className="text-xl sm:text-3xl font-extrabold text-slate-900 block mt-0.5">
                    {stats.total}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:block">
                    no banco de dados
                  </span>
                </div>
              </div>

              {/* Barra de Filtros e Busca */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 sm:p-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Busca por paciente ou telefone */}
                  <div className="relative flex-1">
                    <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nome do paciente ou telefone..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Filtro por data específica */}
                  <div className="sm:w-48">
                    <input
                      type="date"
                      value={selectedDateFilter}
                      onChange={(e) => setSelectedDateFilter(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500"
                      title="Filtrar por data específica"
                    />
                  </div>

                  {/* Filtro por Especialidade */}
                  <div className="sm:w-56">
                    <select
                      value={specialtyFilter}
                      onChange={(e) => setSpecialtyFilter(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500"
                    >
                      <option value="todas">Todas Especialidades</option>
                      {CLINICAL_SPECIALTIES.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Abas Rápidas de Status */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter('todos');
                      setSelectedDateFilter('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      statusFilter === 'todos' && !selectedDateFilter
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter('hoje');
                      setSelectedDateFilter('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      statusFilter === 'hoje'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <span>Hoje</span>
                    {stats.todayCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-white text-emerald-800 text-[10px] font-extrabold">
                        {stats.todayCount}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter('proximos');
                      setSelectedDateFilter('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      statusFilter === 'proximos'
                        ? 'bg-brand-700 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    Próximos
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter('concluidos');
                      setSelectedDateFilter('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      statusFilter === 'concluidos'
                        ? 'bg-slate-700 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    Concluídos
                  </button>

                  {selectedDateFilter && (
                    <button
                      type="button"
                      onClick={() => setSelectedDateFilter('')}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1 hover:bg-amber-200"
                    >
                      <span>Data: {selectedDateFilter.split('-').reverse().join('/')}</span>
                      <i className="fa-solid fa-xmark text-[10px]"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Lista de Agendamentos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <i className="fa-solid fa-calendar-day text-brand-600"></i>
                    <span>Agendamentos ({filteredAppointments.length})</span>
                  </h3>
                  {isLoading && (
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-spinner fa-spin text-emerald-600"></i>
                      Atualizando...
                    </span>
                  )}
                </div>

                {filteredAppointments.length === 0 ? (
                  <div className="bg-slate-50 rounded-2xl p-8 sm:p-12 text-center border-2 border-dashed border-slate-200 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-400 flex items-center justify-center text-xl mx-auto">
                      <i className="fa-solid fa-calendar-xmark"></i>
                    </div>
                    <p className="text-slate-700 font-bold text-sm">
                      Nenhum agendamento encontrado para os filtros selecionados.
                    </p>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">
                      Clique no botão abaixo para adicionar um novo paciente e garantir o horário na agenda.
                    </p>
                    <button
                      type="button"
                      onClick={openCreateForm}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span>Novo Agendamento</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {filteredAppointments.map((apt) => {
                      const isToday = apt.date === todayStr;
                      const formattedDate = apt.date.split('-').reverse().join('/');
                      const confirmationUrl = createPatientConfirmationUrl(apt);

                      return (
                        <div
                          key={apt.id}
                          className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between ${
                            apt.status === 'concluido'
                              ? 'border-slate-200 bg-slate-50/60 opacity-80'
                              : isToday
                              ? 'border-emerald-300 ring-2 ring-emerald-500/20'
                              : 'border-slate-200 hover:border-brand-300'
                          }`}
                        >
                          <div>
                            {/* Linha Topo: Horário, Data e Status */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-emerald-400 font-extrabold text-xs tracking-wide flex items-center gap-1.5 shadow-sm">
                                  <i className="fa-regular fa-clock text-[10px]"></i>
                                  {apt.time}
                                </span>
                                <span className={`text-xs font-bold ${isToday ? 'text-emerald-700 font-extrabold' : 'text-slate-600'}`}>
                                  {isToday ? '📍 Hoje' : formattedDate}
                                </span>
                              </div>

                              {/* Status Badge */}
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  apt.status === 'confirmado'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : apt.status === 'concluido'
                                    ? 'bg-slate-200 text-slate-700'
                                    : apt.status === 'cancelado'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </div>

                            {/* Nome do Paciente */}
                            <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                              {apt.patientName}
                            </h4>

                            {/* Especialidade e Local */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-brand-50 text-brand-800 text-xs font-semibold border border-brand-100">
                                <i className="fa-solid fa-stethoscope text-[10px]"></i>
                                {apt.specialty}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                                <i className={`fa-solid ${apt.serviceType.includes('Domiciliar') ? 'fa-house-medical' : 'fa-hospital-user'} text-[10px]`}></i>
                                {apt.serviceType}
                              </span>
                            </div>

                            {/* Telefone / WhatsApp */}
                            {apt.phone && (
                              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                                <i className="fa-solid fa-phone text-[10px] text-slate-400"></i>
                                <span>{apt.phone}</span>
                              </p>
                            )}

                            {/* Observações / Queixa */}
                            {apt.notes && (
                              <p className="text-xs text-slate-600 mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 italic leading-relaxed">
                                "{apt.notes}"
                              </p>
                            )}
                          </div>

                          {/* Ações Rápidas no Card */}
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1 sm:gap-2">
                            {/* Botão de Enviar WhatsApp para o Paciente */}
                            <a
                              href={confirmationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Enviar confirmação de horário no WhatsApp do paciente"
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-bold flex items-center gap-1 transition-all"
                            >
                              <i className="fa-brands fa-whatsapp text-sm"></i>
                              <span className="hidden sm:inline">Notificar</span>
                            </a>

                            <div className="flex items-center gap-1.5">
                              {/* Toggle Concluir */}
                              {apt.status !== 'concluido' ? (
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(apt, 'concluido')}
                                  title="Marcar como atendimento concluído"
                                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 text-xs font-bold transition-colors"
                                >
                                  <i className="fa-solid fa-check mr-1"></i>
                                  <span className="hidden sm:inline">Concluir</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(apt, 'agendado')}
                                  title="Reativar agendamento"
                                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors"
                                >
                                  <i className="fa-solid fa-rotate-left mr-1"></i>
                                  <span className="hidden sm:inline">Reabrir</span>
                                </button>
                              )}

                              {/* Botão Reagendar */}
                              <button
                                type="button"
                                onClick={() => openEditForm(apt)}
                                title="Reagendar horário ou editar dados"
                                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-100 text-slate-700 hover:text-brand-800 text-xs font-bold flex items-center gap-1 transition-colors"
                              >
                                <i className="fa-solid fa-pen-to-square text-xs"></i>
                                <span>Reagendar</span>
                              </button>

                              {/* Botão Excluir */}
                              <button
                                type="button"
                                onClick={() => setDeletingId(apt.id)}
                                title="Excluir agendamento"
                                className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <i className="fa-solid fa-trash-can text-xs"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal / Drawer para Novo Agendamento ou Reagendamento */}
            {isFormOpen && (
              <div
                className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
              >
                <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-slate-100">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                        {editingAppointment ? 'Reagendar / Editar Paciente' : 'Novo Agendamento'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {editingAppointment
                          ? `Alterando dados de ${editingAppointment.patientName}`
                          : 'Adicione o paciente à agenda da Dra. Nathalia'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSubmitAppointment} className="space-y-4">
                    {/* Alerta em tempo real de Conflito de Horário */}
                    {currentConflict && (
                      <div className="p-3.5 rounded-2xl bg-red-50 border border-red-300 text-red-800 text-xs space-y-1">
                        <div className="font-extrabold flex items-center gap-1.5 text-red-900 text-sm">
                          <i className="fa-solid fa-triangle-exclamation text-red-600"></i>
                          <span>Choque de Horário na Agenda!</span>
                        </div>
                        <p className="leading-relaxed">
                          Já existe um atendimento para <strong>"{currentConflict.patientName}"</strong> no dia{' '}
                          <strong>{date.split('-').reverse().join('/')}</strong> às <strong>{time}</strong> ({currentConflict.specialty}).
                        </p>
                        <p className="text-red-700 font-semibold pt-0.5">
                          👉 Escolha outro horário abaixo para não sobrepor pacientes.
                        </p>
                      </div>
                    )}

                    {/* Nome do Paciente */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Nome do Paciente *
                      </label>
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        required
                        placeholder="Ex: João Ferreira da Silva"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm text-slate-900 font-medium"
                      />
                    </div>

                    {/* Telefone / WhatsApp */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        WhatsApp / Celular (Opcional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: (64) 99274-9005"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm text-slate-900"
                      />
                    </div>

                    {/* Data e Horário */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Data do Atendimento *
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-sm font-medium text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Horário *
                        </label>
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-sm font-medium text-slate-900"
                        />
                      </div>
                    </div>

                    {/* Chips de horários frequentes com indicação de disponibilidade */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Horários Rápidos (Clique para selecionar):
                      </label>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-100">
                        {COMMON_TIME_SLOTS.map((slot) => {
                          const conflictWithSlot = checkTimeCollision(
                            appointments,
                            date,
                            slot,
                            editingAppointment?.id
                          );
                          const isSelected = time === slot;

                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTime(slot)}
                              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                                isSelected
                                  ? 'bg-slate-900 text-white shadow-sm'
                                  : conflictWithSlot
                                  ? 'bg-red-50 text-red-500 border border-red-200 line-through opacity-70'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:border-brand-400'
                              }`}
                              title={conflictWithSlot ? `Ocupado por ${conflictWithSlot.patientName}` : 'Horário Livre'}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Especialidade Clínica */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Especialidade *
                      </label>
                      <select
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-sm font-medium text-slate-900"
                      >
                        {CLINICAL_SPECIALTIES.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Local do Atendimento */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Local do Atendimento
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setServiceType('Consultório')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                            serviceType === 'Consultório'
                              ? 'bg-brand-50 border-brand-500 text-brand-800'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <i className="fa-solid fa-hospital-user"></i>
                          <span>Consultório</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setServiceType('Domiciliar (Home Care)')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                            serviceType.includes('Domiciliar')
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <i className="fa-solid fa-house-medical"></i>
                          <span>Domiciliar</span>
                        </button>
                      </div>
                    </div>

                    {/* Status do Agendamento */}
                    {editingAppointment && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Status
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800"
                        >
                          <option value="agendado">Agendado</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="concluido">Concluído</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>
                    )}

                    {/* Observações / Queixa Clínica */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Observações Clínicas / Queixa (Opcional)
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ex: Pós-operatório de LCA, dor lombar crônica, etc."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-xs sm:text-sm text-slate-900"
                      />
                    </div>

                    {/* Botões do Formulário */}
                    <div className="pt-2 flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting || !!currentConflict}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <i className="fa-solid fa-spinner fa-spin"></i>
                            <span>Gravando...</span>
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-floppy-disk"></i>
                            <span>{editingAppointment ? 'Salvar Reagendamento' : 'Confirmar Agendamento'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal de Confirmação de Exclusão */}
            {deletingId && (
              <div
                className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
              >
                <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-xl mx-auto">
                    <i className="fa-solid fa-trash-can"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Excluir Agendamento?</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Esta ação removerá este paciente do banco de dados e liberará o horário na sua agenda.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setDeletingId(null)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(deletingId)}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
                    >
                      Sim, Excluir
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
