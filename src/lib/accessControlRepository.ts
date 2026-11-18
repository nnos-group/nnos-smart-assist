import { UserRole } from "@/types/salesJourney";

export type UserStatus = "ativo" | "inativo";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  dealership: string;
  status: UserStatus;
  password: string;
  createdAt: string;
  lastLoginAt?: string;
}

export type AccessEventType =
  | "LOGIN_SUCESSO"
  | "LOGIN_FALHA"
  | "LOGOUT"
  | "USUARIO_CRIADO"
  | "USUARIO_EDITADO"
  | "STATUS_ALTERADO";

export interface AccessLogEntry {
  id: string;
  timestamp: string;
  email: string;
  userName: string;
  role: UserRole | "desconhecido";
  dealership: string;
  event: AccessEventType;
  details: string;
  deviceInfo: string;
}

const USERS_STORAGE_KEY = "smart_sell_managed_users_v1";
const LOGS_STORAGE_KEY = "smart_sell_access_logs_v1";
const MAX_LOG_ENTRIES = 250;

export const ROLE_LABELS: Record<UserRole, string> = {
  consultor: "Consultor de Vendas (Alçada 5%)",
  gerente: "Gerente Geral (Alçada 15%)",
  administrador: "Administrador (Alçada 25%)",
};

export const CORPORATE_MASTER_PASSWORDS = ["nnos2026", "stellantis2026", "mopar2026", "admin2026"];

const DEFAULT_USERS: ManagedUser[] = [
  {
    id: "usr-01",
    name: "Ricardo Mendes",
    email: "consultor@stellantis.com",
    role: "consultor",
    dealership: "Concessionária Jeep - Matriz Campinas (Orosimbo Maia)",
    status: "ativo",
    password: "nnos2026",
    createdAt: "2026-01-10T09:00:00.000Z",
    lastLoginAt: "2026-11-18T11:20:00.000Z",
  },
  {
    id: "usr-02",
    name: "Fernanda Costa",
    email: "gerente@stellantis.com",
    role: "gerente",
    dealership: "Concessionária Jeep - Matriz Campinas (Orosimbo Maia)",
    status: "ativo",
    password: "stellantis2026",
    createdAt: "2026-01-10T09:05:00.000Z",
    lastLoginAt: "2026-11-17T17:45:00.000Z",
  },
  {
    id: "usr-admin",
    name: "Administrador Smart-Sell",
    email: "admin@stellantis.com",
    role: "administrador",
    dealership: "Concessionária Jeep - Matriz Campinas (Orosimbo Maia)",
    status: "ativo",
    password: "admin2026",
    createdAt: "2026-01-05T08:00:00.000Z",
    lastLoginAt: "2026-11-18T08:30:00.000Z",
  },
];

const DEFAULT_LOGS: AccessLogEntry[] = [
  {
    id: "log-seed-1",
    timestamp: "2026-11-18T11:20:00.000Z",
    email: "consultor@stellantis.com",
    userName: "Ricardo Mendes",
    role: "consultor",
    dealership: "Concessionária Jeep - Matriz Campinas (Orosimbo Maia)",
    event: "LOGIN_SUCESSO",
    details: "Autenticação corporativa realizada no terminal.",
    deviceInfo: "Desktop / Web",
  },
  {
    id: "log-seed-2",
    timestamp: "2026-11-18T08:30:00.000Z",
    email: "admin@stellantis.com",
    userName: "Administrador Smart-Sell",
    role: "administrador",
    dealership: "Concessionária Jeep - Matriz Campinas (Orosimbo Maia)",
    event: "LOGIN_SUCESSO",
    details: "Sessão administrativa iniciada.",
    deviceInfo: "Desktop / Web",
  },
];

function notifyChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("smart_sell_access_control_updated"));
  }
}

function getDeviceInfo(): string {
  if (typeof navigator === "undefined") return "Terminal Corporativo";
  const ua = navigator.userAgent || "";
  if (/iPad|Tablet/i.test(ua)) return "Tablet / Web";
  if (/Mobile|Android|iPhone/i.test(ua)) return "Mobile / Web";
  return "Desktop / Web";
}

function safeReadStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      window.localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

export function getManagedUsers(): ManagedUser[] {
  return safeReadStorage<ManagedUser[]>(USERS_STORAGE_KEY, DEFAULT_USERS);
}

export function findManagedUserByEmail(email: string): ManagedUser | undefined {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return undefined;
  return getManagedUsers().find((u) => u.email.trim().toLowerCase() === normalized);
}

export function createManagedUser(
  input: Omit<ManagedUser, "id" | "createdAt" | "lastLoginAt">,
  actor?: { email: string; name: string }
): ManagedUser {
  const users = getManagedUsers();
  const normalizedEmail = input.email.trim().toLowerCase();

  if (users.some((u) => u.email.trim().toLowerCase() === normalizedEmail)) {
    throw new Error("Já existe um usuário cadastrado com este e-mail corporativo.");
  }

  const newUser: ManagedUser = {
    ...input,
    id: `usr-${Date.now()}`,
    email: normalizedEmail,
    name: input.name.trim(),
    createdAt: new Date().toISOString(),
  };

  safeWriteStorage(USERS_STORAGE_KEY, [newUser, ...users]);

  appendAccessLog({
    email: actor?.email || "admin@stellantis.com",
    userName: actor?.name || "Administrador",
    role: "administrador",
    dealership: newUser.dealership,
    event: "USUARIO_CRIADO",
    details: `Usuário ${newUser.name} (${newUser.email}) criado com perfil ${newUser.role}.`,
  });

  notifyChange();
  return newUser;
}

export function updateManagedUser(
  id: string,
  patch: Partial<Omit<ManagedUser, "id" | "createdAt">>,
  actor?: { email: string; name: string }
): ManagedUser | null {
  const users = getManagedUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;

  const updated: ManagedUser = {
    ...users[idx],
    ...patch,
    email: patch.email ? patch.email.trim().toLowerCase() : users[idx].email,
    name: patch.name ? patch.name.trim() : users[idx].name,
  };

  const next = [...users];
  next[idx] = updated;
  safeWriteStorage(USERS_STORAGE_KEY, next);

  appendAccessLog({
    email: actor?.email || "admin@stellantis.com",
    userName: actor?.name || "Administrador",
    role: "administrador",
    dealership: updated.dealership,
    event: "USUARIO_EDITADO",
    details: `Cadastro de ${updated.name} (${updated.email}) atualizado (perfil: ${updated.role}).`,
  });

  notifyChange();
  return updated;
}

export function toggleManagedUserStatus(
  id: string,
  actor?: { email: string; name: string }
): ManagedUser | null {
  const users = getManagedUsers();
  const target = users.find((u) => u.id === id);
  if (!target) return null;

  const nextStatus: UserStatus = target.status === "ativo" ? "inativo" : "ativo";
  const updated: ManagedUser = { ...target, status: nextStatus };

  safeWriteStorage(
    USERS_STORAGE_KEY,
    users.map((u) => (u.id === id ? updated : u))
  );

  appendAccessLog({
    email: actor?.email || "admin@stellantis.com",
    userName: actor?.name || "Administrador",
    role: "administrador",
    dealership: updated.dealership,
    event: "STATUS_ALTERADO",
    details: `Status de ${updated.name} (${updated.email}) alterado para ${nextStatus.toUpperCase()}.`,
  });

  notifyChange();
  return updated;
}

export function recordUserLastLogin(email: string): void {
  const normalized = email.trim().toLowerCase();
  const users = getManagedUsers();
  const idx = users.findIndex((u) => u.email.trim().toLowerCase() === normalized);
  if (idx === -1) return;

  const next = [...users];
  next[idx] = { ...next[idx], lastLoginAt: new Date().toISOString() };
  safeWriteStorage(USERS_STORAGE_KEY, next);
  notifyChange();
}

export function getAccessLogs(): AccessLogEntry[] {
  return safeReadStorage<AccessLogEntry[]>(LOGS_STORAGE_KEY, DEFAULT_LOGS);
}

export function appendAccessLog(
  entry: Omit<AccessLogEntry, "id" | "timestamp" | "deviceInfo"> & { deviceInfo?: string }
): AccessLogEntry {
  const logs = getAccessLogs();
  const newEntry: AccessLogEntry = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    deviceInfo: entry.deviceInfo || getDeviceInfo(),
  };

  const next = [newEntry, ...logs].slice(0, MAX_LOG_ENTRIES);
  safeWriteStorage(LOGS_STORAGE_KEY, next);
  notifyChange();
  return newEntry;
}

export function clearAccessLogs(actor?: { email: string; name: string; dealership?: string }): void {
  const resetEntry: AccessLogEntry = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    email: actor?.email || "admin@stellantis.com",
    userName: actor?.name || "Administrador",
    role: "administrador",
    dealership: actor?.dealership || "Matriz Campinas",
    event: "USUARIO_EDITADO",
    details: "Histórico de logs de acesso limpo pelo administrador.",
    deviceInfo: getDeviceInfo(),
  };
  safeWriteStorage(LOGS_STORAGE_KEY, [resetEntry]);
  notifyChange();
}

export function exportAccessLogsToCsv(logs: AccessLogEntry[]): string {
  const header = ["Data/Hora", "Usuario", "Email", "Perfil", "Concessionaria", "Evento", "Detalhes", "Dispositivo"];
  const escapeCsv = (val: string) => `"${(val || "").replace(/"/g, '""')}"`;

  const rows = logs.map((l) => [
    new Date(l.timestamp).toLocaleString("pt-BR"),
    l.userName,
    l.email,
    l.role,
    l.dealership,
    l.event,
    l.details,
    l.deviceInfo,
  ]);

  return [header, ...rows].map((row) => row.map(escapeCsv).join(";")).join("\n");
}
