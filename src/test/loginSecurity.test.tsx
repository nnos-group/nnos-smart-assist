import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginScreen from "@/components/LoginScreen";

describe("LoginScreen Security & Authentication", () => {
  it("renders with empty password field by default (não vem pré-preenchida)", () => {
    const handleLogin = vi.fn();
    render(<LoginScreen onLogin={handleLogin} />);

    const passwordInput = screen.getByPlaceholderText(/Digite a senha de acesso corporativo.../i) as HTMLInputElement;
    expect(passwordInput).toBeDefined();
    expect(passwordInput.value).toBe("");
  });

  it("blocks login and displays error message when password is wrong", () => {
    const handleLogin = vi.fn();
    render(<LoginScreen onLogin={handleLogin} />);

    const passwordInput = screen.getByPlaceholderText(/Digite a senha de acesso corporativo.../i);
    const submitBtn = screen.getByRole("button", { name: /Iniciar Venda/i });

    // Enter wrong password
    fireEvent.change(passwordInput, { target: { value: "senhaErrada123" } });
    fireEvent.click(submitBtn);

    expect(handleLogin).not.toHaveBeenCalled();
    expect(screen.getByText(/Senha de acesso incorreta/i)).toBeDefined();
  });

  it("blocks login when password field is empty", () => {
    const handleLogin = vi.fn();
    const { container } = render(<LoginScreen onLogin={handleLogin} />);

    const form = container.querySelector("form")!;
    fireEvent.submit(form);

    expect(handleLogin).not.toHaveBeenCalled();
    expect(screen.getByText(/Senha de acesso incorreta/i)).toBeDefined();
  });

  it("successfully authenticates and calls onLogin when 'nnos2026' is entered", () => {
    const handleLogin = vi.fn();
    render(<LoginScreen onLogin={handleLogin} />);

    const passwordInput = screen.getByPlaceholderText(/Digite a senha de acesso corporativo.../i);
    const submitBtn = screen.getByRole("button", { name: /Iniciar Venda/i });

    fireEvent.change(passwordInput, { target: { value: "nnos2026" } });
    fireEvent.click(submitBtn);

    expect(handleLogin).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/Senha de acesso incorreta/i)).toBeNull();
  });

  it("clears error message when the user resumes typing", () => {
    const handleLogin = vi.fn();
    render(<LoginScreen onLogin={handleLogin} />);

    const passwordInput = screen.getByPlaceholderText(/Digite a senha de acesso corporativo.../i);
    const submitBtn = screen.getByRole("button", { name: /Iniciar Venda/i });

    // Trigger error
    fireEvent.change(passwordInput, { target: { value: "errado" } });
    fireEvent.click(submitBtn);
    expect(screen.getByText(/Senha de acesso incorreta/i)).toBeDefined();

    // Type again
    fireEvent.change(passwordInput, { target: { value: "nnos" } });
    expect(screen.queryByText(/Senha de acesso incorreta/i)).toBeNull();
  });
});
