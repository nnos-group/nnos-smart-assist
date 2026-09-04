import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PackageSuggestionScreen from "@/components/PackageSuggestionScreen";
import { Accessory, ClientData } from "@/types/accessories";

const mockClientData: ClientData = {
  clientName: "João Silva Sauro",
  clientAge: "42",
  clientGender: "Masculino",
  vehicleModel: "JEEP RENEGADE SPORT",
  vehicleColor: "Verde Recon",
  vehicleYear: "2025 / 2026 (0 km)",
  state: "Mato Grosso (MT)",
  terrainType: "Uso Misto (Urbano/Estradas de Terra)",
  climateCondition: "Alta Incidência de Chuvas & Poeira",
};

const mockAccessories: Accessory[] = [
  {
    id: "bagageiro",
    name: "Bagageiro de Teto Mopar 400L",
    description: "Capacidade extra de 400L com travamento duplo",
    price: 2850,
    icon: "🧳",
    selected: true,
    stockStatus: "available",
    stockDays: 90,
    discountPercent: 0,
  },
  {
    id: "protetor",
    name: "Protetor de Cárter Reforçado",
    description: "Proteção mecânica sob estradas não pavimentadas",
    price: 950,
    icon: "🛡️",
    selected: true,
    stockStatus: "dormant",
    stockDays: 210,
    discountPercent: 12,
  },
  {
    id: "friso",
    name: "Friso Lateral com Logo Renegade",
    description: "Proteção lateral estilizada na cor do veículo",
    price: 600,
    icon: "✨",
    selected: false,
    stockStatus: "obsolete",
    stockDays: 390,
    discountPercent: 25,
  },
];

describe("PackageSuggestionScreen", () => {
  it("renders client and vehicle context ribbon cards correctly", () => {
    render(
      <PackageSuggestionScreen
        accessories={mockAccessories}
        clientData={mockClientData}
        onAccessoryToggle={vi.fn()}
        onVisualize={vi.fn()}
      />
    );

    expect(screen.getByText("João Silva Sauro")).toBeInTheDocument();
    expect(screen.getByText("JEEP RENEGADE SPORT")).toBeInTheDocument();
    expect(screen.getAllByText(/Mato Grosso/)[0]).toBeInTheDocument();
    expect(screen.getByText("94%")).toBeInTheDocument();
    expect(screen.getByText("Alta Propensão de Aceite")).toBeInTheDocument();
    expect(screen.queryByText(/MOTOR IA STELLANTIS/i)).not.toBeInTheDocument();
    expect(screen.getByText("RECOMENDAÇÃO PERSONALIZADA")).toBeInTheDocument();
  });

  it("calculates totals, discounts and installments correctly", () => {
    render(
      <PackageSuggestionScreen
        accessories={mockAccessories}
        clientData={mockClientData}
        onAccessoryToggle={vi.fn()}
        onVisualize={vi.fn()}
      />
    );

    // Selected: bagageiro (2850) + protetor (950 * 0.88 = 836) = 3686
    // Savings: 950 - 836 = 114
    expect(screen.getByText("R$ 3.686")).toBeInTheDocument();
    expect(screen.getAllByText("- R$ 114")[0]).toBeInTheDocument();
    expect(screen.getByText(/2 selecionados/)).toBeInTheDocument();
  });

  it("highlights discount percentages prominently", () => {
    render(
      <PackageSuggestionScreen
        accessories={mockAccessories}
        clientData={mockClientData}
        onAccessoryToggle={vi.fn()}
        onVisualize={vi.fn()}
      />
    );

    // Dormant 12% discount badge
    expect(screen.getByText("🔥 -12% OFF")).toBeInTheDocument();
    // Obsolete 25% discount badge
    expect(screen.getByText("🔥 -25% OFF")).toBeInTheDocument();
  });

  it("allows seller to apply extra discount and factory bonus, dynamically updating total", () => {
    render(
      <PackageSuggestionScreen
        accessories={mockAccessories}
        clientData={mockClientData}
        onAccessoryToggle={vi.fn()}
        onVisualize={vi.fn()}
      />
    );

    // Initial total is R$ 3.686
    expect(screen.getByText("R$ 3.686")).toBeInTheDocument();

    const sellerDiscountInput = screen.getByLabelText(/Desconto Adicional Concessionária/i);
    const factoryBonusInput = screen.getByLabelText(/Bônus da Montadora/i);

    // Add R$ 200 dealer discount and R$ 150 factory bonus
    fireEvent.change(sellerDiscountInput, { target: { value: "200" } });
    fireEvent.change(factoryBonusInput, { target: { value: "150" } });

    // 3686 - 200 - 150 = 3336
    expect(screen.getByText("R$ 3.336")).toBeInTheDocument();
    expect(screen.getByText("- R$ 200")).toBeInTheDocument();
    expect(screen.getByText("- R$ 150")).toBeInTheDocument();
    // Total savings: 114 (estoque) + 200 (loja) + 150 (fábrica) = 464
    expect(screen.getByText("- R$ 464")).toBeInTheDocument();
  });

  it("renders distinct stock status badges matching the legend", () => {
    render(
      <PackageSuggestionScreen
        accessories={mockAccessories}
        clientData={mockClientData}
        onAccessoryToggle={vi.fn()}
        onVisualize={vi.fn()}
      />
    );

    expect(screen.getByText("EM ESTOQUE")).toBeInTheDocument();
    expect(screen.getByText("⚡ DORMENTE • 210D")).toBeInTheDocument();
    expect(screen.getByText("🔥 OBSOLETO • 13M")).toBeInTheDocument();
    expect(screen.getByText(/Disponível \(Verde\):/i)).toBeInTheDocument();
    expect(screen.getByText(/Dormente \(>180d - Âmbar\):/i)).toBeInTheDocument();
    expect(screen.getByText(/Obsoleto \(>1 ano - Vermelho\):/i)).toBeInTheDocument();
  });

  it("calls onAccessoryToggle when clicking on an accessory card or checkbox", () => {
    const handleToggle = vi.fn();
    render(
      <PackageSuggestionScreen
        accessories={mockAccessories}
        clientData={mockClientData}
        onAccessoryToggle={handleToggle}
        onVisualize={vi.fn()}
      />
    );

    const protetorText = screen.getAllByText("Protetor de Cárter Reforçado")[0];
    fireEvent.click(protetorText);
    expect(handleToggle).toHaveBeenCalledWith("protetor");
  });

  it("calls onVisualize when clicking primary CTA", () => {
    const handleVisualize = vi.fn();
    render(
      <PackageSuggestionScreen
        accessories={mockAccessories}
        clientData={mockClientData}
        onAccessoryToggle={vi.fn()}
        onVisualize={handleVisualize}
      />
    );

    const button = screen.getByRole("button", { name: /Visualizar no Veículo 3D/i });
    fireEvent.click(button);
    expect(handleVisualize).toHaveBeenCalled();
  });

  it("does not render 0800 phone number in footer", () => {
    render(
      <PackageSuggestionScreen
        accessories={mockAccessories}
        clientData={mockClientData}
        onAccessoryToggle={vi.fn()}
        onVisualize={vi.fn()}
      />
    );

    expect(screen.queryByText(/0800 707 9000/i)).not.toBeInTheDocument();
    expect(screen.getByText("Sistemas 100% Operacionais (DMS & F&I Integrados)")).toBeInTheDocument();
  });
});
