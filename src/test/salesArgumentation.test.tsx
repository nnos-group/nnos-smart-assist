import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { generatePrepareRecommendation, generateRecoveryRecommendation, generateWhatsAppArgument } from "@/lib/salesArgumentEngine";
import { calculateParetoAnalysis, getConversionAnalytics, saveArgumentationLog } from "@/lib/argumentationRepository";
import { getLostSalesAnalysis } from "@/lib/leadsRepository";
import SellArgumentBlock from "@/components/SellArgumentBlock";
import LostSalesDashboard from "@/components/LostSalesDashboard";
import { defaultClientData, getAccessoriesForVehicle } from "@/types/accessories";

const mockClientData = {
  ...defaultClientData,
  clientName: "Marcos Vinicius",
  vehicleModel: "RAM RAMPAGE REBEL",
  vehicleColor: "Vermelho Volcano",
  state: "Mato Grosso (MT)",
  terrainType: "Uso Misto (Urbano / Rural)",
  climateCondition: "Calor Intenso & Poeira Frequente",
};

describe("Smart-Sell — Sales Argumentation Engine", () => {
  it("generates contextual prepare recommendation with why, approaches, and WhatsApp script", () => {
    const accessories = getAccessoriesForVehicle("RAM RAMPAGE REBEL");
    const rec = generatePrepareRecommendation(accessories, mockClientData, "live");

    expect(rec.mode).toBe("prepare");
    expect(rec.confidenceScore).toBeGreaterThanOrEqual(70);
    expect(rec.individualArguments.length).toBeGreaterThan(0);
    expect(rec.packageNarrative.headline).toContain("RAMPAGE");
    expect(rec.packageNarrative.keyBenefits.length).toBeGreaterThan(0);
    expect(rec.whatsappMessage).toContain("Marcos");
    expect(rec.whatsappMessage).toContain("RAM RAMPAGE REBEL");
  });

  it("generates recovery recommendation when customer hesitates or refuses items", () => {
    const accessories = getAccessoriesForVehicle("RAM RAMPAGE REBEL");
    const rec = generateRecoveryRecommendation(accessories, mockClientData, "showroom", {
      lossReason: "Orçamento / Preço no Momento",
      refusedAccessoryIds: ["capota"],
      originalProposalValue: 8500,
    });

    expect(rec.mode).toBe("recover");
    expect(rec.packageNarrative.headline).toContain("Revisado");
    expect(rec.packageNarrative.narrative).toContain("Marcos");
    expect(rec.whatsappMessage).toContain("Revisado");
  });

  it("calculates Pareto analysis and analytics correctly", () => {
    const pareto = calculateParetoAnalysis();
    expect(pareto.totalOpportunities).toBeGreaterThan(0);
    expect(pareto.totalLostValue).toBeGreaterThan(0);
    expect(pareto.topRefusedAccessories.length).toBeGreaterThan(0);
    expect(pareto.topLossReasons.length).toBeGreaterThan(0);

    const analytics = getConversionAnalytics();
    expect(analytics.totalArgumentations).toBeGreaterThan(0);

    const lostSalesFromRepo = getLostSalesAnalysis();
    expect(lostSalesFromRepo.totalOpportunities).toBe(pareto.totalOpportunities);
  });
});

describe("SellArgumentBlock Component", () => {
  it("renders 'COMO VENDER ESTA RECOMENDAÇÃO' header and toggles content", () => {
    const accessories = getAccessoriesForVehicle("RAM RAMPAGE REBEL");
    render(
      <SellArgumentBlock
        accessories={accessories}
        clientData={mockClientData}
        clientSource="live"
      />
    );

    expect(screen.getByText(/COMO VENDER ESTA RECOMENDAÇÃO/i)).toBeInTheDocument();
    expect(screen.getByText(/Argumentação personalizada para/i)).toBeInTheDocument();
    expect(screen.getByText(/Pronta para uso/i)).toBeInTheDocument();

    // Expande o bloco ao clicar no accordion
    const toggleBtn = screen.getByRole("button", { name: /COMO VENDER ESTA RECOMENDAÇÃO/i });
    fireEvent.click(toggleBtn);

    // Botão inicial de preparar abordagem
    const prepareBtn = screen.getByRole("button", { name: /Preparar minha abordagem/i });
    expect(prepareBtn).toBeInTheDocument();
    fireEvent.click(prepareBtn);

    // Deve exibir modos de visualização (Pacote e Por Acessório)
    expect(screen.getByText(/Argumento do Pacote/i)).toBeInTheDocument();
    expect(screen.getByText(/Por Acessório/i)).toBeInTheDocument();
  });
});

describe("LostSalesDashboard Component", () => {
  it("renders Pareto KPIs and ranking tables when open", () => {
    const handleClose = vi.fn();
    render(<LostSalesDashboard isOpen={true} onClose={handleClose} />);

    expect(screen.getByText(/Painel de Vendas Perdidas/i)).toBeInTheDocument();
    expect(screen.getByText(/Análise de Pareto/i)).toBeInTheDocument();
    expect(screen.getByText(/Oportunidades Perdidas/i)).toBeInTheDocument();
    expect(screen.getByText(/Valor Total Perdido/i)).toBeInTheDocument();
    expect(screen.getByText(/Ticket Médio Perdido/i)).toBeInTheDocument();
    expect(screen.getByText(/Acessórios Mais Recusados/i)).toBeInTheDocument();
    expect(screen.getByText(/Principais Motivos de Perda/i)).toBeInTheDocument();
  });
});
