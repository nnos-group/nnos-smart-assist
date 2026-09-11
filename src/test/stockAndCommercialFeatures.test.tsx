import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NavigationBar, { ViewportDevice } from "@/components/NavigationBar";
import { PricePresentationScreen } from "@/components/PricePresentationScreen";
import { ClosingScreen } from "@/components/ClosingScreen";
import { SalesJourneyProvider } from "@/context/SalesJourneyContext";

describe("Novas Funcionalidades: Análise de Estoque, Fechamento e Simulador de Telas", () => {
  it("renderiza botões de simulação de tela (Computador, Tablet, Celular) e dispara onDeviceChange", () => {
    const handleDeviceChange = vi.fn();

    render(
      <NavigationBar
        currentStep={1}
        onBack={vi.fn()}
        onLogout={vi.fn()}
        showBack={true}
        currentDevice="desktop"
        onDeviceChange={handleDeviceChange}
      />
    );

    const desktopBtn = screen.getByRole("button", { name: /computador/i });
    const tabletBtn = screen.getByRole("button", { name: /tablet/i });
    const mobileBtn = screen.getByRole("button", { name: /celular/i });

    expect(desktopBtn).toBeInTheDocument();
    expect(tabletBtn).toBeInTheDocument();
    expect(mobileBtn).toBeInTheDocument();

    fireEvent.click(tabletBtn);
    expect(handleDeviceChange).toHaveBeenCalledWith("tablet");

    fireEvent.click(mobileBtn);
    expect(handleDeviceChange).toHaveBeenCalledWith("mobile");

    fireEvent.click(desktopBtn);
    expect(handleDeviceChange).toHaveBeenCalledWith("desktop");
  });

  it("renderiza a tela de Investimento (Etapa 5) com Análise de Estoque da Concessionária e Botão Direto para Fechamento", () => {
    render(
      <SalesJourneyProvider>
        <PricePresentationScreen />
      </SalesJourneyProvider>
    );

    // Botão Solicitado para ir direto para o fechamento
    const directCloseBtn = screen.getByRole("button", { name: /ir direto para o fechamento/i });
    expect(directCloseBtn).toBeInTheDocument();

    // Painel de Análise de Estoque da Concessionária
    expect(screen.getByText(/Análise de Estoque da Concessionária/i)).toBeInTheDocument();

    // O painel vem aberto por padrão exibindo os detalhes das faixas de giro
    expect(screen.getByText(/Disponível \(≤180d\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Dormente \(>180d\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Obsoleto \(>1 ano\)/i)).toBeInTheDocument();
    expect(screen.getByText(/10% a 20% OFF/i)).toBeInTheDocument();
    expect(screen.getByText(/25% a 35% OFF/i)).toBeInTheDocument();

    // Botão de Recolher/Detalhes alterna a exibição
    const toggleDetailsBtn = screen.getByRole("button", { name: /recolher/i });
    expect(toggleDetailsBtn).toBeInTheDocument();
    fireEvent.click(toggleDetailsBtn);
    expect(screen.queryByText(/Disponível \(≤180d\)/i)).toBeNull();
  });

  it("permite remover acessórios selecionados na tela de Investimento", () => {
    render(
      <SalesJourneyProvider>
        <PricePresentationScreen />
      </SalesJourneyProvider>
    );

    // Botões de lixeira nos itens selecionados
    const removeButtons = screen.getAllByTitle(/Remover .* da proposta/i);
    expect(removeButtons.length).toBeGreaterThan(0);

    // Clica no primeiro botão de remoção
    fireEvent.click(removeButtons[0]);
  });

  it("renderiza tela de Fechamento (Etapa 7) e permite remover itens selecionados", () => {
    render(
      <SalesJourneyProvider>
        <ClosingScreen onSaleWon={vi.fn()} />
      </SalesJourneyProvider>
    );

    expect(screen.getByRole("heading", { name: /Fechamento/i })).toBeInTheDocument();

    // Botões de remoção nos itens
    const removeButtons = screen.getAllByTitle(/Retirar .* da proposta/i);
    expect(removeButtons.length).toBeGreaterThan(0);

    fireEvent.click(removeButtons[0]);
  });
});
