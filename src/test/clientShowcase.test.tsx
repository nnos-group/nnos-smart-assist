import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ClientShowcaseView from "@/pages/ClientShowcaseView";

describe("ClientShowcaseView", () => {
  it("renders personalized client view from search params without seller controls", () => {
    const route = "/visualizacao?client=Carlos%20Eduardo&model=JEEP%20RENEGADE%20TRAILHAWK&color=Verde%20Recon&acc=engate,friso&total=3200&cdc=75,20";

    render(
      <MemoryRouter initialEntries={[route]}>
        <ClientShowcaseView />
      </MemoryRouter>
    );

    // Client name and model should be displayed
    expect(screen.getByText(/Olá, Carlos Eduardo!/i)).toBeInTheDocument();
    expect(screen.getByText(/JEEP RENEGADE TRAILHAWK/i)).toBeInTheDocument();
    expect(screen.getByText(/Verde Recon/i)).toBeInTheDocument();

    // Values should be properly formatted
    expect(screen.getByText(/R\$ 3\.200/i)).toBeInTheDocument();
    expect(screen.getByText(/75,20 \/ mês/i)).toBeInTheDocument();

    // Customer CTAs should be present
    expect(screen.getByRole("button", { name: /Aprovar Proposta no WhatsApp/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Falar com o Consultor/i })).toBeInTheDocument();

    // Internal seller platform controls MUST NOT be present
    expect(screen.queryByText(/Adicionar à Proposta/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Gerar Argumentação Consultiva/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Leads Reaquecidos/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/CRM/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Entrega Técnica/i)).not.toBeInTheDocument();
  });

  it("handles WhatsApp approval button click", () => {
    const originalOpen = window.open;
    window.open = vi.fn();

    const route = "/visualizacao?client=Mariana&model=RAM%20RAMPAGE%20REBEL&color=Preto";

    render(
      <MemoryRouter initialEntries={[route]}>
        <ClientShowcaseView />
      </MemoryRouter>
    );

    const approveBtn = screen.getByRole("button", { name: /Aprovar Proposta no WhatsApp/i });
    fireEvent.click(approveBtn);

    expect(window.open).toHaveBeenCalledTimes(1);
    const openedUrl = decodeURIComponent((window.open as any).mock.calls[0][0]);
    expect(openedUrl).toContain("aprovei a proposta");
    expect(openedUrl).toContain("RAM RAMPAGE REBEL");

    window.open = originalOpen;
  });

  it("allows switching between Original de Fábrica and Com Seus Acessórios views", () => {
    const route = "/visualizacao?client=Teste&model=JEEP%20RENEGADE%20TRAILHAWK";

    render(
      <MemoryRouter initialEntries={[route]}>
        <ClientShowcaseView />
      </MemoryRouter>
    );

    const btnOriginal = screen.getByRole("button", { name: "Original de Fábrica" });
    fireEvent.click(btnOriginal);
    expect(screen.getByText(/ORIGINAL DE FÁBRICA \(SEM ACESSÓRIOS\)/i)).toBeInTheDocument();

    const btnAcessorios = screen.getByRole("button", { name: "Com Seus Acessórios" });
    fireEvent.click(btnAcessorios);
    expect(screen.getByText(/^COM \d+ ACESSÓRIOS INSTALADOS$/i)).toBeInTheDocument();
  });
});
