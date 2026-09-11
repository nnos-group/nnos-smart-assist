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

    // O painel vem recolhido por padrão por sigilo comercial
    expect(screen.queryByText(/Disponível \(≤180d\)/i)).toBeNull();

    // Botão de Exibir Análise de Giro abre os detalhes
    const expandDetailsBtn = screen.getByRole("button", { name: /exibir análise de giro/i });
    expect(expandDetailsBtn).toBeInTheDocument();
    fireEvent.click(expandDetailsBtn);

    // Agora os detalhes das faixas de giro são exibidos
    expect(screen.getByText(/Disponível \(≤180d\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Dormente \(>180d\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Obsoleto \(>1 ano\)/i)).toBeInTheDocument();
    expect(screen.getByText(/10% a 20% OFF/i)).toBeInTheDocument();
    expect(screen.getByText(/25% a 35% OFF/i)).toBeInTheDocument();

    // Botão de Recolher fecha novamente
    const collapseDetailsBtn = screen.getByRole("button", { name: /recolher informações/i });
    expect(collapseDetailsBtn).toBeInTheDocument();
    fireEvent.click(collapseDetailsBtn);
    expect(screen.queryByText(/Disponível \(≤180d\)/i)).toBeNull();
  });

  it("limita o desconto do consultor em percentual de acordo com sua alçada máxima (5%)", () => {
    render(
      <SalesJourneyProvider>
        <PricePresentationScreen />
      </SalesJourneyProvider>
    );

    const discountInput = screen.getByLabelText(/Desconto do Consultor \(%\)/i);
    expect(discountInput).toBeInTheDocument();

    // Digita um percentual dentro da alçada (3%)
    fireEvent.change(discountInput, { target: { value: "3" } });
    expect(discountInput).toHaveValue(3);

    // Tenta digitar um percentual acima da alçada de consultor (8%) -> deve limitar ao teto de 5%
    fireEvent.change(discountInput, { target: { value: "8" } });
    expect(discountInput).toHaveValue(5);
  });

  it("renderiza o botão de Enviar Proposta & Visualização 3D ao WhatsApp na etapa de Investimento", () => {
    const originalOpen = window.open;
    window.open = vi.fn();

    render(
      <SalesJourneyProvider>
        <PricePresentationScreen />
      </SalesJourneyProvider>
    );

    const whatsappBtn = screen.getByRole("button", { name: /Enviar Proposta & Visualização 3D ao WhatsApp/i });
    expect(whatsappBtn).toBeInTheDocument();
    fireEvent.click(whatsappBtn);

    expect(window.open).toHaveBeenCalledTimes(1);
    const openedUrl = (window.open as any).mock.calls[0][0];
    const urlObj = new URL(openedUrl);
    const textMessage = urlObj.searchParams.get("text") || "";

    // Frases de efeito comerciais homologadas
    expect(textMessage).toContain("100% Originais & Homologados de Fábrica");
    expect(textMessage).toContain("Garantia Total do Veículo Preservada");
    expect(textMessage).toContain("Valorização Comprovada na Revenda");
    expect(textMessage).toContain("/visualizacao?");

    window.open = originalOpen;
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
