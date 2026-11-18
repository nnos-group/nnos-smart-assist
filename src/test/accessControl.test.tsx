import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginScreen from "@/components/LoginScreen";
import NavigationBar from "@/components/NavigationBar";
import { AdminControlModal } from "@/components/AdminControlModal";
import {
  getManagedUsers,
  getAccessLogs,
  createManagedUser,
  toggleManagedUserStatus,
} from "@/lib/accessControlRepository";

describe("Admin Access, User Control & Access Logs", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("keeps consultor access and supports admin quick switch + login", () => {
    const onLogin = vi.fn();
    const onSessionReady = vi.fn();
    render(<LoginScreen onLogin={onLogin} onSessionReady={onSessionReady} />);

    // Switch to admin mode using quick pill
    fireEvent.click(screen.getByRole("button", { name: /Acesso Admin/i }));
    const emailInput = screen.getByLabelText(/ID Consultor/i) as HTMLInputElement;
    expect(emailInput.value).toBe("admin@stellantis.com");

    const passwordInput = screen.getByPlaceholderText(/Digite a senha de acesso corporativo.../i);
    fireEvent.change(passwordInput, { target: { value: "admin2026" } });
    fireEvent.click(screen.getByRole("button", { name: /Iniciar Venda/i }));

    expect(onLogin).toHaveBeenCalledTimes(1);
    expect(onSessionReady).toHaveBeenCalledWith(
      "administrador",
      expect.any(String),
      expect.objectContaining({
        email: "admin@stellantis.com",
        role: "administrador",
      })
    );

    const logs = getAccessLogs();
    expect(logs[0].event).toBe("LOGIN_SUCESSO");
    expect(logs[0].email).toBe("admin@stellantis.com");
  });

  it("blocks inactive user login and records LOGIN_FALHA", () => {
    const users = getManagedUsers();
    const consultor = users.find((u) => u.email === "consultor@stellantis.com")!;
    toggleManagedUserStatus(consultor.id, { email: "admin@stellantis.com", name: "Admin" });

    const onLogin = vi.fn();
    render(<LoginScreen onLogin={onLogin} />);

    const passwordInput = screen.getByPlaceholderText(/Digite a senha de acesso corporativo.../i);
    fireEvent.change(passwordInput, { target: { value: "nnos2026" } });
    fireEvent.click(screen.getByRole("button", { name: /Iniciar Venda/i }));

    expect(onLogin).not.toHaveBeenCalled();
    expect(screen.getByText(/Usuário desativado pelo administrador/i)).toBeDefined();

    const logs = getAccessLogs();
    expect(logs[0].event).toBe("LOGIN_FALHA");
  });

  it("shows Admin menu in NavigationBar only for administrador role", () => {
    const onOpenUserControl = vi.fn();
    const { rerender } = render(
      <NavigationBar
        currentStep={1}
        onBack={vi.fn()}
        onLogout={vi.fn()}
        showBack={false}
        onOpenUserControl={onOpenUserControl}
        userSession={{
          userId: "usr-01",
          name: "Ricardo",
          email: "consultor@stellantis.com",
          role: "consultor",
          dealership: "Matriz",
          dealershipId: "matriz",
        }}
      />
    );

    expect(screen.queryByRole("button", { name: /Admin/i })).toBeNull();

    rerender(
      <NavigationBar
        currentStep={1}
        onBack={vi.fn()}
        onLogout={vi.fn()}
        showBack={false}
        onOpenUserControl={onOpenUserControl}
        userSession={{
          userId: "usr-admin",
          name: "Admin",
          email: "admin@stellantis.com",
          role: "administrador",
          dealership: "Matriz",
          dealershipId: "matriz",
        }}
      />
    );

    const adminBtn = screen.getByRole("button", { name: /Admin/i });
    fireEvent.click(adminBtn);
    fireEvent.click(screen.getByText(/Log de Acesso/i));
    expect(onOpenUserControl).toHaveBeenCalledWith("logs");
  });

  it("allows creating users and viewing access logs in AdminControlModal", () => {
    createManagedUser(
      {
        name: "Novo Consultor",
        email: "novo@stellantis.com",
        password: "novaSenha123",
        role: "consultor",
        dealership: "Concessionária Jeep - Filial Indaiatuba",
        status: "ativo",
      },
      { email: "admin@stellantis.com", name: "Admin" }
    );

    render(
      <AdminControlModal
        isOpen={true}
        onClose={vi.fn()}
        currentUser={{
          userId: "usr-admin",
          name: "Admin",
          email: "admin@stellantis.com",
          role: "administrador",
          dealership: "Matriz",
          dealershipId: "matriz",
        }}
      />
    );

    expect(screen.getByText("Novo Consultor")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: /Log de Acesso/i }));
    expect(screen.getByText(/Novo Consultor \(novo@stellantis\.com\) criado/i)).toBeDefined();
  });
});
