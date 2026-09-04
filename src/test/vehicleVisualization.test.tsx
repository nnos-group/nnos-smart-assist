import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import VehicleVisualizationScreen from "@/components/VehicleVisualizationScreen";
import { Accessory, ClientData } from "@/types/accessories";

const mockClientData: ClientData = {
  clientName: "João Silva Sauro",
  clientAge: "42",
  clientGender: "Masculino",
  vehicleModel: "RAM RAMPAGE REBEL",
  vehicleColor: "Vermelho Volcano",
  vehicleYear: "2025/2026",
  state: "Mato Grosso (MT)",
  terrainType: "Uso Misto (Urbano / Rural)",
  climateCondition: "Alta Incidência de Chuvas & Poeira",
};

const mockAccessories: Accessory[] = [
  {
    id: "estribo",
    name: "Estribo Lateral Premium",
    description: "Aço carbono tubular antiderrapante",
    price: 2500,
    icon: "🚗",
    selected: true,
    stockStatus: "available",
    stockDays: 45,
    discountPercent: 0,
  },
  {
    id: "protetor",
    name: "Protetor de Caçamba HD",
    description: "Proteção reforçada anti-impacto",
    price: 1200,
    icon: "🛡️",
    selected: true,
    stockStatus: "dormant",
    stockDays: 210,
    discountPercent: 12,
  },
  {
    id: "pneus",
    name: "Pneus All-Terrain 265/70R16",
    description: "Conjunto 4 unidades alto relevo",
    price: 4800,
    icon: "⚙️",
    selected: false,
    stockStatus: "available",
    stockDays: 30,
    discountPercent: 0,
  },
];

describe("VehicleVisualizationScreen", () => {
  it("renders vehicle title, metadata and badges correctly", () => {
    render(
      <VehicleVisualizationScreen
        accessories={mockAccessories}
        clientData={mockClientData}
        onAccessoryToggle={vi.fn()}
        onGenerateScript={vi.fn()}
        onAddToProposal={vi.fn()}
      />
    );

    expect(screen.getByText(/RAM RAMPAGE REBEL — Vermelho Volcano/i)).toBeInTheDocument();
    expect(screen.getByText("João Silva Sauro")).toBeInTheDocument();
    expect(screen.getByText("Vídeo Oficial Mopar Conectado")).toBeInTheDocument();
    expect(screen.getByText(/DEPOIS • 2 ACESSÓRIOS/i)).toBeInTheDocument();
  });

  it("does not render removed quick actions and angle bar", () => {
    render(
      <VehicleVisualizationScreen
        accessories={mockAccessories}
        clientData={mockClientData}
        onAccessoryToggle={vi.fn()}
        onGenerateScript={vi.fn()}
        onAddToProposal={vi.fn()}
      />
    );

    // Removed top right buttons
    expect(screen.queryByRole("button", { name: /Girar 360°/i })).not.toBeInTheDocument();
    // Removed angle switcher bar
    expect(screen.queryByText(/Ângulo de visualização:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Motor Gráfico WebGL/i)).not.toBeInTheDocument();
  });

  it("does not render Stellantis Financial Services or Rede Oficial do Brasil in footer", () => {
    render(
      <VehicleVisualizationScreen
        accessories={mockAccessories}
        clientData={mockClientData}
        onAccessoryToggle={vi.fn()}
        onGenerateScript={vi.fn()}
        onAddToProposal={vi.fn()}
      />
    );

    expect(screen.queryByText(/Stellantis Financial Services/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Rede Oficial do Brasil/i)).not.toBeInTheDocument();
    expect(screen.getByText("Ambiente Seguro Concessionária")).toBeInTheDocument();
  });

  it("toggles between Antes and Depois views correctly", () => {
    render(
      <VehicleVisualizationScreen
        accessories={mockAccessories}
        clientData={mockClientData}
        onAccessoryToggle={vi.fn()}
        onGenerateScript={vi.fn()}
        onAddToProposal={vi.fn()}
      />
    );

    const btnAntes = screen.getByRole("button", { name: "Antes" });
    fireEvent.click(btnAntes);
    expect(screen.getByText(/ORIGINAL DE FÁBRICA • SEM ACESSÓRIOS/i)).toBeInTheDocument();

    const btnDepois = screen.getByRole("button", { name: "Depois" });
    fireEvent.click(btnDepois);
    expect(screen.getByText(/DEPOIS • 2 ACESSÓRIOS/i)).toBeInTheDocument();
  });

  it("calls onAccessoryToggle when clicking on an accessory in the right list", () => {
    const handleToggle = vi.fn();
    render(
      <VehicleVisualizationScreen
        accessories={mockAccessories}
        clientData={mockClientData}
        onAccessoryToggle={handleToggle}
        onGenerateScript={vi.fn()}
        onAddToProposal={vi.fn()}
      />
    );

    const item = screen.getByText("Pneus All-Terrain 265/70R16");
    fireEvent.click(item);
    expect(handleToggle).toHaveBeenCalledWith("pneus");
  });

  it("calls onAddToProposal when clicking primary action button", () => {
    const handleAddToProposal = vi.fn();
    render(
      <VehicleVisualizationScreen
        accessories={mockAccessories}
        clientData={mockClientData}
        onAccessoryToggle={vi.fn()}
        onGenerateScript={vi.fn()}
        onAddToProposal={handleAddToProposal}
      />
    );

    const button = screen.getByRole("button", { name: /Adicionar à Proposta/i });
    fireEvent.click(button);
    expect(handleAddToProposal).toHaveBeenCalled();
  });

  it("calls onGenerateScript when clicking secondary action button", () => {
    const handleGenerateScript = vi.fn();
    render(
      <VehicleVisualizationScreen
        accessories={mockAccessories}
        clientData={mockClientData}
        onAccessoryToggle={vi.fn()}
        onGenerateScript={handleGenerateScript}
        onAddToProposal={vi.fn()}
      />
    );

    const button = screen.getByRole("button", { name: /Gerar Argumentação Consultiva/i });
    fireEvent.click(button);
    expect(handleGenerateScript).toHaveBeenCalled();
  });

  it("calculates commercial seller discount and updates total properly", () => {
    render(
      <VehicleVisualizationScreen
        accessories={mockAccessories}
        clientData={mockClientData}
        onAccessoryToggle={vi.fn()}
        onGenerateScript={vi.fn()}
        onAddToProposal={vi.fn()}
      />
    );

    const discountInput = screen.getByLabelText(/Desconto Adicional Concessionária/i);
    expect(discountInput).toBeInTheDocument();
    fireEvent.change(discountInput, { target: { value: "200" } });
    expect(screen.getByText(/Desc\. Concessionária/i)).toBeInTheDocument();
  });

  it("generates WhatsApp share link targeting the public /visualizacao route without internal system access", () => {
    const originalOpen = window.open;
    window.open = vi.fn();

    render(
      <VehicleVisualizationScreen
        accessories={mockAccessories}
        clientData={mockClientData}
        onAccessoryToggle={vi.fn()}
        onGenerateScript={vi.fn()}
        onAddToProposal={vi.fn()}
      />
    );

    const shareBtn = screen.getByRole("button", { name: /Enviar Visualização 3D/i });
    fireEvent.click(shareBtn);

    expect(window.open).toHaveBeenCalledTimes(1);
    const openedUrl = (window.open as any).mock.calls[0][0];
    const fullyDecoded = decodeURIComponent(decodeURIComponent(openedUrl));
    expect(fullyDecoded).toContain("/visualizacao?");
    expect(fullyDecoded).toContain("client=João Silva Sauro");
    expect(fullyDecoded).toContain("model=RAM RAMPAGE REBEL");
    expect(fullyDecoded).not.toContain("#visualizacao3d");

    window.open = originalOpen;
  });
});
