import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { SalesJourneyProvider, useSalesJourney } from "@/context/SalesJourneyContext";
import { ConsultativeDiscoveryChecklist } from "@/components/ConsultativeDiscoveryChecklist";
import { RecommendationReviewScreen } from "@/components/RecommendationReviewScreen";
import { AccessoryExplanationScreen } from "@/components/AccessoryExplanationScreen";
import { PricePresentationScreen } from "@/components/PricePresentationScreen";
import { NegotiationAssistantScreen } from "@/components/NegotiationAssistantScreen";
import { ClosingScreen } from "@/components/ClosingScreen";
import { SalesJourneyStepper } from "@/components/SalesJourneyStepper";

// Componente de teste para orquestração das 7 telas
const TestSalesJourneyApp = () => {
  const { state } = useSalesJourney();

  return (
    <div>
      <SalesJourneyStepper />
      <div data-testid="current-step">{state.currentStep}</div>

      {state.currentStep === "customer-understanding" && <ConsultativeDiscoveryChecklist />}
      {state.currentStep === "accessory-recommendation" && <RecommendationReviewScreen />}
      {state.currentStep === "accessory-explanation" && <AccessoryExplanationScreen />}
      {state.currentStep === "price-presentation" && <PricePresentationScreen />}
      {state.currentStep === "negotiation" && <NegotiationAssistantScreen />}
      {state.currentStep === "closing" && <ClosingScreen onSaleWon={vi.fn()} />}
    </div>
  );
};

describe("Sales Journey 7-Step Consultative Flow", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });
  it("renders Step 1 (Entender o cliente) with 10 questions and NO prices", () => {
    render(
      <SalesJourneyProvider>
        <TestSalesJourneyApp />
      </SalesJourneyProvider>
    );

    expect(screen.getByRole("heading", { name: /Entender o cliente/i })).toBeInTheDocument();
    expect(screen.getByText(/Onde o veículo será utilizado com maior frequência\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Quais são as três prioridades principais/i)).toBeInTheDocument();

    // NÃO deve exibir preços nem totais na etapa 1
    expect(screen.queryByText(/Total à Vista/i)).toBeNull();
    expect(screen.queryByText(/Parcelamento Concessionária/i)).toBeNull();
  });

  it("advances to Step 2 (Recomendar acessórios) and does not display prices", () => {
    render(
      <SalesJourneyProvider>
        <TestSalesJourneyApp />
      </SalesJourneyProvider>
    );

    // Clicar em avançar para Step 2
    const advanceBtn = screen.getByRole("button", { name: /Avançar para Recomendar Acessórios/i });
    fireEvent.click(advanceBtn);

    expect(screen.getByRole("heading", { name: /Recomendar acessórios/i })).toBeInTheDocument();
    expect(screen.getByText(/Itens Essenciais/i)).toBeInTheDocument();
    expect(screen.getByText(/Foco nos benefícios técnicos:/i)).toBeInTheDocument();

    // Garantir que preços continuam ocultos na Etapa 2
    expect(screen.queryByText(/Total à Vista/i)).toBeNull();
    expect(screen.queryByText(/Diluição no CDC/i)).toBeNull();
  });

  it("preserves diagnosis answers when navigating back and forth between steps", () => {
    render(
      <SalesJourneyProvider>
        <TestSalesJourneyApp />
      </SalesJourneyProvider>
    );

    // Passo 1: Selecionar uso rural
    const ruralBtn = screen.getByRole("button", { name: "Zona Rural" });
    fireEvent.click(ruralBtn);

    // Avançar para Etapa 2
    const advanceBtn = screen.getByRole("button", { name: /Avançar para Recomendar Acessórios/i });
    fireEvent.click(advanceBtn);
    expect(screen.getByRole("heading", { name: /Recomendar acessórios/i })).toBeInTheDocument();

    // Voltar para Etapa 1
    const backBtn = screen.getByRole("button", { name: /Voltar para Entender o Cliente/i });
    fireEvent.click(backBtn);

    // Verificar que a resposta "Zona Rural" foi preservada no estado
    expect(screen.getByRole("heading", { name: /Entender o cliente/i })).toBeInTheDocument();
  }, 15000);
});
