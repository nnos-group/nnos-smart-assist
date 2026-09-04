import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ClientDataScreen from "@/components/ClientDataScreen";
import { ClientData } from "@/types/accessories";
import { getRegionalTelemetryInsight } from "@/lib/regionalIntelligence";

const mockClientData: ClientData = {
  clientName: "Cliente Teste",
  clientAge: "38",
  clientGender: "Masculino",
  vehicleModel: "RAM RAMPAGE REBEL",
  vehicleColor: "Verde Recon",
  vehicleYear: "2025 / 2026 (0 km)",
  state: "Mato Grosso (MT)",
  terrainType: "Uso Misto (Urbano / Rural)",
  climateCondition: "Alta Incidência de Chuvas & Poeira",
};

describe("ClientDataScreen - Show room and Regional Predictive Intelligence", () => {
  it("renders 'Show room' source selector button instead of 'Ao Vivo'", () => {
    render(
      <ClientDataScreen
        clientData={mockClientData}
        onClientDataChange={vi.fn()}
        onGenerateSuggestion={vi.fn()}
      />
    );

    // Should find Show room button and badge
    expect(screen.getByRole("button", { name: /Show room/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Ao Vivo$/i })).not.toBeInTheDocument();
    expect(screen.getByText(/Atendimento presencial no salão/i)).toBeInTheDocument();
    expect(screen.getByText("SHOW ROOM")).toBeInTheDocument();
  });

  it("renders regional predictive analysis for Mato Grosso without unwanted terms", () => {
    render(
      <ClientDataScreen
        clientData={mockClientData}
        onClientDataChange={vi.fn()}
        onGenerateSuggestion={vi.fn()}
      />
    );

    // Title is present without '— Stellantis Intelligence'
    expect(screen.getByRole("heading", { name: "Análise Regional Preditiva" })).toBeInTheDocument();
    expect(screen.queryByText(/Stellantis Intelligence/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/v4\.2 Telemetria/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/chassis monitorados/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sistemas 100% Operacionais/i)).not.toBeInTheDocument();

    // Geoclimatic factors
    expect(screen.getByText(/Abrasividade do Solo & Poeira/i)).toBeInTheDocument();
    expect(screen.getByText(/Carga Térmica & Radiação UV/i)).toBeInTheDocument();

    // Business and Dealership metrics
    expect(screen.getByText(/\+14\.8%/i)).toBeInTheDocument(); // Residual bonus
    expect(screen.getByText(/R\$ 6\.800/i)).toBeInTheDocument(); // Prevented damage
    expect(screen.getByText(/10 dias/i)).toBeInTheDocument(); // Turn days
  });

  it("computes accurate regional intelligence for different Brazilian dealership regions", () => {
    // 1. Centro-Oeste (Mato Grosso)
    const mtInsight = getRegionalTelemetryInsight(
      "Mato Grosso (MT)",
      "Predominância Rural / Estradas de Terra",
      "Alta Incidência de Chuvas & Poeira",
      "RAM RAMPAGE REBEL"
    );
    expect(mtInsight.macroRegion).toBe("Centro-Oeste");
    expect(mtInsight.connectedVehiclesSample).toBe("18.420");
    expect(mtInsight.packageName).toContain("Agro & Proteção Total Off-Road");
    const soilRisk = mtInsight.geoclimaticRisks.find((r) => r.id === "soil");
    expect(soilRisk?.level).toBe("Crítico");

    // 2. Sudeste (São Paulo Urbano)
    const spInsight = getRegionalTelemetryInsight(
      "São Paulo (SP)",
      "100% Urbano / Rodovias Pavimentadas",
      "Clima Temperado / Chuvoso Moderado",
      "JEEP COMPASS LIMITED"
    );
    expect(spInsight.macroRegion).toBe("Sudeste");
    expect(spInsight.connectedVehiclesSample).toBe("34.600");
    expect(spInsight.packageName).toContain("Metrópole Blindagem Urbana");
    const urbanRisk = spInsight.geoclimaticRisks.find((r) => r.id === "urban");
    expect(urbanRisk?.level).toBe("Crítico");

    // 3. Litoral (Rio de Janeiro)
    const rjInsight = getRegionalTelemetryInsight(
      "Rio de Janeiro (RJ)",
      "Litoral / Areia & Maresia Intensa",
      "Calor Extremo & Radiação Solar Intensa",
      "JEEP RENEGADE TRAILHAWK"
    );
    expect(rjInsight.macroRegion).toBe("Sudeste");
    expect(rjInsight.packageName).toContain("Litoral Carioca");
    const salinityRisk = rjInsight.geoclimaticRisks.find((r) => r.id === "salinity");
    expect(salinityRisk?.level).toBe("Crítico");

    // 4. Sul (Paraná)
    const prInsight = getRegionalTelemetryInsight(
      "Paraná (PR)",
      "Uso Misto (Urbano / Rural)",
      "Clima Temperado / Chuvoso Moderado",
      "RAM RAMPAGE LARAMIE"
    );
    expect(prInsight.macroRegion).toBe("Sul");
    expect(prInsight.connectedVehiclesSample).toBe("22.400");
    expect(prInsight.criticalAccessories.some((a) => a.name.includes("Neblina"))).toBe(true);
  });

  it("updates regional telemetry dynamically when changing region in the screen", () => {
    const handleClientDataChange = vi.fn();
    render(
      <ClientDataScreen
        clientData={mockClientData}
        onClientDataChange={handleClientDataChange}
        onGenerateSuggestion={vi.fn()}
      />
    );

    const stateSelect = screen.getByLabelText(/Estado \/ Região/i);
    fireEvent.change(stateSelect, { target: { value: "São Paulo (SP)" } });

    expect(handleClientDataChange).toHaveBeenCalledWith(
      expect.objectContaining({ state: "São Paulo (SP)" })
    );
  });
});
