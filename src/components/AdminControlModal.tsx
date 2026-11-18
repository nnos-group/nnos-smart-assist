import { useState, useEffect, useMemo } from "react";
import {
  ShieldCheck,
  Users,
  History,
  X,
  Plus,
  Search,
  Download,
  Trash2,
  Edit3,
  UserCheck,
  UserX,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  UserPlus,
  KeyRound,
} from "lucide-react";
import { UserRole, UserSession } from "@/types/salesJourney";
import { JEEP_DEALERSHIP_GROUP } from "@/components/LoginScreen";
import {
  ManagedUser,
  AccessLogEntry,
  AccessEventType,
  UserStatus,
  ROLE_LABELS,
  getManagedUsers,
  getAccessLogs,
  createManagedUser,
  updateManagedUser,
  toggleManagedUserStatus,
  clearAccessLogs,
  exportAccessLogsToCsv,
} from "@/lib/accessControlRepository";
import { toast } from "sonner";

interface AdminControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession;
  initialTab?: "users" | "logs";
}

const ALL_DEALERSHIPS = [
  JEEP_DEALERSHIP_GROUP.matriz.name,
  ...JEEP_DEALERSHIP_GROUP.filiais.map((f) => f.name),
];

const EVENT_BADGE_MAP: Record<
  AccessEventType,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  LOGIN_SUCESSO: {
    label: "Login Sucesso",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  LOGIN_FALHA: {
    label: "Falha de Login",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: AlertTriangle,
  },
  LOGOUT: {
    label: "Logout",
    className: "bg-slate-100 text-slate-700 border-slate-200",
    icon: LogOut,
  },
  USUARIO_CRIADO: {
    label: "Usuário Criado",
    className: "bg-sky-50 text-sky-700 border-sky-200",
    icon: UserPlus,
  },
  USUARIO_EDITADO: {
    label: "Cadastro Editado",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Edit3,
  },
  STATUS_ALTERADO: {
    label: "Status Alterado",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: ShieldCheck,
  },
};

const ROLE_BADGE_MAP: Record<UserRole, { label: string; className: string }> = {
  consultor: {
    label: "Consultor (5%)",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  gerente: {
    label: "Gerente (15%)",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  administrador: {
    label: "Admin (25%)",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
};

export const AdminControlModal = ({
  isOpen,
  onClose,
  currentUser,
  initialTab = "users",
}: AdminControlModalProps) => {
  const [activeTab, setActiveTab] = useState<"users" | "logs">(initialTab);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [logs, setLogs] = useState<AccessLogEntry[]>([]);

  // Filters
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");

  const [logSearch, setLogSearch] = useState("");
  const [eventFilter, setEventFilter] = useState<"all" | AccessEventType>("all");

  // Create / Edit User Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("consultor");
  const [formDealership, setFormDealership] = useState(ALL_DEALERSHIPS[0]);
  const [formStatus, setFormStatus] = useState<UserStatus>("ativo");
  const [formError, setFormError] = useState("");

  const refreshData = () => {
    setUsers(getManagedUsers());
    setLogs(getAccessLogs());
  };

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab(initialTab);
    refreshData();
    const onUpdated = () => refreshData();
    window.addEventListener("smart_sell_access_control_updated", onUpdated);
    return () => window.removeEventListener("smart_sell_access_control_updated", onUpdated);
  }, [isOpen, initialTab]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    return users.filter((u) => {
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.dealership.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, userSearch, roleFilter, statusFilter]);

  const filteredLogs = useMemo(() => {
    const q = logSearch.trim().toLowerCase();
    return logs.filter((l) => {
      const matchesQuery =
        !q ||
        l.userName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        l.dealership.toLowerCase().includes(q) ||
        (l.ipAddress || "").toLowerCase().includes(q);
      const matchesEvent = eventFilter === "all" || l.event === eventFilter;
      return matchesQuery && matchesEvent;
    });
  }, [logs, logSearch, eventFilter]);

  const userStats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.status === "ativo").length,
      admins: users.filter((u) => u.role === "administrador").length,
      inactive: users.filter((u) => u.status === "inativo").length,
    };
  }, [users]);

  const logStats = useMemo(() => {
    return {
      total: logs.length,
      success: logs.filter((l) => l.event === "LOGIN_SUCESSO").length,
      failures: logs.filter((l) => l.event === "LOGIN_FALHA").length,
      adminChanges: logs.filter((l) =>
        ["USUARIO_CRIADO", "USUARIO_EDITADO", "STATUS_ALTERADO"].includes(l.event)
      ).length,
    };
  }, [logs]);

  if (!isOpen) return null;

  const openCreateForm = () => {
    setEditingUserId(null);
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormRole("consultor");
    setFormDealership(ALL_DEALERSHIPS[0]);
    setFormStatus("ativo");
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (user: ManagedUser) => {
    setEditingUserId(user.id);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword("");
    setFormRole(user.role);
    setFormDealership(user.dealership);
    setFormStatus(user.status);
    setFormError("");
    setIsFormOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim() || !formEmail.trim()) {
      setFormError("Preencha o nome completo e o e-mail corporativo.");
      return;
    }

    if (!editingUserId && formPassword.trim().length < 6) {
      setFormError("A senha inicial deve ter pelo menos 6 caracteres.");
      return;
    }

    if (editingUserId && formPassword.trim() && formPassword.trim().length < 6) {
      setFormError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const actor = { email: currentUser.email, name: currentUser.name };
      if (editingUserId) {
        updateManagedUser(
          editingUserId,
          {
            name: formName,
            email: formEmail,
            role: formRole,
            dealership: formDealership,
            status: formStatus,
            ...(formPassword.trim() ? { password: formPassword.trim() } : {}),
          },
          actor
        );
        toast.success("Usuário atualizado com sucesso.");
      } else {
        createManagedUser(
          {
            name: formName,
            email: formEmail,
            password: formPassword.trim(),
            role: formRole,
            dealership: formDealership,
            status: formStatus,
          },
          actor
        );
        toast.success("Novo usuário cadastrado com sucesso.");
      }
      setIsFormOpen(false);
      refreshData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Não foi possível salvar o usuário.");
    }
  };

  const handleToggleStatus = (user: ManagedUser) => {
    if (user.email.toLowerCase() === currentUser.email.toLowerCase()) {
      toast.error("Você não pode desativar o próprio usuário administrador em uso.");
      return;
    }
    const updated = toggleManagedUserStatus(user.id, {
      email: currentUser.email,
      name: currentUser.name,
    });
    if (updated) {
      toast.success(
        `Usuário ${updated.name} ${updated.status === "ativo" ? "ativado" : "desativado"}.`
      );
      refreshData();
    }
  };

  const handleExportCsv = () => {
    const csv = exportAccessLogsToCsv(filteredLogs);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `smart-sell-logs-acesso-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Logs exportados em CSV.");
  };

  const handleClearLogs = () => {
    if (!window.confirm("Deseja limpar o histórico de logs de acesso?")) return;
    clearAccessLogs({
      email: currentUser.email,
      name: currentUser.name,
      dealership: currentUser.dealership,
    });
    toast.success("Histórico de logs reiniciado.");
    refreshData();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/65 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Controle de Usuários e Log de Acesso"
    >
      <div className="w-full max-w-6xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Administração, Controle de Usuários &amp; Log de Acesso
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Gerencie credenciais corporativas, alçadas comerciais e audite eventos de autenticação.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar painel administrativo"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 border-b border-slate-200 bg-white flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === "users"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Controle de Usuários ({users.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === "logs"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Log de Acesso ({logs.length})</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/40">
          {activeTab === "users" && (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl border border-slate-200 p-3.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Total de Usuários</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{userStats.total}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-3.5">
                  <span className="text-[11px] font-semibold text-emerald-600 uppercase">Ativos</span>
                  <p className="text-2xl font-black text-emerald-700 mt-1">{userStats.active}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-3.5">
                  <span className="text-[11px] font-semibold text-indigo-600 uppercase">Administradores</span>
                  <p className="text-2xl font-black text-indigo-700 mt-1">{userStats.admins}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-3.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Inativos / Bloqueados</span>
                  <p className="text-2xl font-black text-slate-700 mt-1">{userStats.inactive}</p>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Buscar por nome, e-mail ou concessionária..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as "all" | UserRole)}
                    aria-label="Filtrar por perfil"
                    className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                  >
                    <option value="all">Todos os perfis</option>
                    <option value="consultor">Consultor</option>
                    <option value="gerente">Gerente</option>
                    <option value="administrador">Administrador</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as "all" | UserStatus)}
                    aria-label="Filtrar por status"
                    className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                  >
                    <option value="all">Todos os status</option>
                    <option value="ativo">Ativos</option>
                    <option value="inativo">Inativos</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={openCreateForm}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Usuário</span>
                </button>
              </div>

              {/* Create/Edit User Form */}
              {isFormOpen && (
                <form
                  onSubmit={handleSaveUser}
                  className="bg-white rounded-xl border border-indigo-200 p-4 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h3 className="text-sm font-bold text-slate-900">
                      {editingUserId ? "Editar Usuário" : "Cadastrar Novo Usuário"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Ex: Maria Oliveira"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        E-mail Corporativo
                      </label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="nome@stellantis.com"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        {editingUserId ? "Nova Senha (opcional)" : "Senha Inicial"}
                      </label>
                      <div className="relative">
                        <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required={!editingUserId}
                          value={formPassword}
                          onChange={(e) => setFormPassword(e.target.value)}
                          placeholder={editingUserId ? "Manter senha atual" : "Mínimo 6 caracteres"}
                          className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Perfil de Acesso &amp; Alçada
                      </label>
                      <select
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value as UserRole)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                      >
                        <option value="consultor">{ROLE_LABELS.consultor}</option>
                        <option value="gerente">{ROLE_LABELS.gerente}</option>
                        <option value="administrador">{ROLE_LABELS.administrador}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Concessionária / Hub
                      </label>
                      <select
                        value={formDealership}
                        onChange={(e) => setFormDealership(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800"
                      >
                        {ALL_DEALERSHIPS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Status
                      </label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as UserStatus)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                      >
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                      </select>
                    </div>
                  </div>

                  {formError && (
                    <p className="text-xs font-semibold text-red-600">{formError}</p>
                  )}

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
                    >
                      {editingUserId ? "Salvar Alterações" : "Cadastrar Usuário"}
                    </button>
                  </div>
                </form>
              )}

              {/* Users Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4">Usuário</th>
                        <th className="py-3 px-4">Perfil</th>
                        <th className="py-3 px-4">Concessionária / Hub</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Último Acesso</th>
                        <th className="py-3 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredUsers.map((user) => {
                        const roleBadge = ROLE_BADGE_MAP[user.role];
                        const isSelf =
                          user.email.toLowerCase() === currentUser.email.toLowerCase();
                        return (
                          <tr key={user.id} className="hover:bg-slate-50/70 transition">
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{user.name}</span>
                                {isSelf && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                                    Você
                                  </span>
                                )}
                              </div>
                              <div className="text-slate-500 text-[11px]">{user.email}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${roleBadge.className}`}
                              >
                                {roleBadge.label}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600 max-w-[240px] truncate" title={user.dealership}>
                              {user.dealership}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                                  user.status === "ativo"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-slate-100 text-slate-600 border-slate-200"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    user.status === "ativo" ? "bg-emerald-500" : "bg-slate-400"
                                  }`}
                                />
                                {user.status === "ativo" ? "Ativo" : "Inativo"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                              {user.lastLoginAt
                                ? new Date(user.lastLoginAt).toLocaleString("pt-BR")
                                : "Nunca acessou"}
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEditForm(user)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
                                  title="Editar usuário"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Editar</span>
                                </button>
                                <button
                                  type="button"
                                  disabled={isSelf}
                                  onClick={() => handleToggleStatus(user)}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                    user.status === "ativo"
                                      ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  }`}
                                  title={
                                    user.status === "ativo"
                                      ? "Desativar acesso do usuário"
                                      : "Reativar acesso do usuário"
                                  }
                                >
                                  {user.status === "ativo" ? (
                                    <>
                                      <UserX className="w-3.5 h-3.5" />
                                      <span>Desativar</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="w-3.5 h-3.5" />
                                      <span>Ativar</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500">
                            Nenhum usuário encontrado com os filtros selecionados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "logs" && (
            <>
              {/* Log KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl border border-slate-200 p-3.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Total de Eventos</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{logStats.total}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-3.5">
                  <span className="text-[11px] font-semibold text-emerald-600 uppercase">Logins Sucesso</span>
                  <p className="text-2xl font-black text-emerald-700 mt-1">{logStats.success}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-3.5">
                  <span className="text-[11px] font-semibold text-red-600 uppercase">Tentativas Falhas</span>
                  <p className="text-2xl font-black text-red-700 mt-1">{logStats.failures}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-3.5">
                  <span className="text-[11px] font-semibold text-indigo-600 uppercase">Ações Admin</span>
                  <p className="text-2xl font-black text-indigo-700 mt-1">{logStats.adminChanges}</p>
                </div>
              </div>

              {/* Log Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={logSearch}
                      onChange={(e) => setLogSearch(e.target.value)}
                      placeholder="Buscar por usuário, e-mail, IP ou detalhe do evento..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value as "all" | AccessEventType)}
                    aria-label="Filtrar por tipo de evento"
                    className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                  >
                    <option value="all">Todos os eventos</option>
                    <option value="LOGIN_SUCESSO">Login Sucesso</option>
                    <option value="LOGIN_FALHA">Falha de Login</option>
                    <option value="LOGOUT">Logout</option>
                    <option value="USUARIO_CRIADO">Usuário Criado</option>
                    <option value="USUARIO_EDITADO">Cadastro Editado</option>
                    <option value="STATUS_ALTERADO">Status Alterado</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearLogs}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Limpar Logs</span>
                  </button>
                </div>
              </div>

              {/* Logs Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4">Data / Hora</th>
                        <th className="py-3 px-4">Evento</th>
                        <th className="py-3 px-4">Usuário / E-mail</th>
                        <th className="py-3 px-4">Perfil</th>
                        <th className="py-3 px-4">Detalhes</th>
                        <th className="py-3 px-4">IP da Máquina</th>
                        <th className="py-3 px-4">Origem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredLogs.map((log) => {
                        const badge = EVENT_BADGE_MAP[log.event];
                        const Icon = badge.icon;
                        return (
                          <tr key={log.id} className="hover:bg-slate-50/70 transition">
                            <td className="py-3 px-4 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                              {new Date(log.timestamp).toLocaleString("pt-BR")}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.className}`}
                              >
                                <Icon className="w-3 h-3" />
                                {badge.label}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{log.userName}</div>
                              <div className="text-slate-500 text-[11px]">{log.email}</div>
                            </td>
                            <td className="py-3 px-4 text-slate-700 capitalize">{log.role}</td>
                            <td className="py-3 px-4 text-slate-600 max-w-[300px]">{log.details}</td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold border border-slate-200">
                                {log.ipAddress || "Não identificado"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{log.deviceInfo}</td>
                          </tr>
                        );
                      })}
                      {filteredLogs.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-500">
                            Nenhum registro de log encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
