import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SalesScriptScreen from "@/components/SalesScriptScreen";
import { defaultClientData, getAccessoriesForVehicle } from "@/types/accessories";

const mockClientData = {
  ...defaultClientData,
  clientName: "João Silva Sauro",
  vehicleModel: "RAM RAMPAGE REBEL",
  vehicleColor: "Vermelho Volcano",
  state: "Mato Grosso (MT)",
  terrainType: "Uso Misto (Urbano / Rural)",
};

describe("SalesScriptScreen (Etapa 4)", () => {
  it("renders header, client summary, and consultative opening quote", () => {
    const accessories = getAccessoriesForVehicle("RAM RAMPAGE REBEL");
    render(
      <SalesScriptScreen
        clientData={mockClientData}
        accessories={accessories}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText(/Argumentação Consultiva & Quebra de Objeções/i)).toBeInTheDocument();
    expect(screen.getByText("João Silva Sauro")).toBeInTheDocument();
    expect(screen.getByText("RAM RAMPAGE REBEL")).toBeInTheDocument();
    expect(screen.getByText(/Abertura Consultiva Personalizada/i)).toBeInTheDocument();
    expect(screen.getByText(/Confiança IA: 96%/i)).toBeInTheDocument();

    // Verificações de termos removidos conforme solicitação do usuário
    expect(screen.queryByText(/& Copiloto IA/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Motor de IA:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sales Copilot Turbo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Stellantis Financial Services/i)).not.toBeInTheDocument();
  });

  it("renders 3 value pillars with structured arguments and tips", () => {
    const accessories = getAccessoriesForVehicle("RAM RAMPAGE REBEL");
    render(
      <SalesScriptScreen
        clientData={mockClientData}
        accessories={accessories}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText(/Proteção do Investimento & Revenda/i)).toBeInTheDocument();
    expect(screen.getByText(/Segurança & Performance Operacional/i)).toBeInTheDocument();
    expect(screen.getByText(/Facilidade F&I & Diluição no CDC/i)).toBeInTheDocument();
    expect(screen.getByText(/Dica Contra Preço Alto:/i)).toBeInTheDocument();
  });

  it("selects objection preset and generates dynamic AI response on screen", () => {
    const accessories = getAccessoriesForVehicle("RAM RAMPAGE REBEL");
    render(
      <SalesScriptScreen
        clientData={mockClientData}
        accessories={accessories}
        onClose={vi.fn()}
      />
    );

    const presetBtn = screen.getByRole("button", { name: /Não vê necessidade imediata/i });
    expect(presetBtn).toBeInTheDocument();
    fireEvent.click(presetBtn);

    const generateBtn = screen.getByRole("button", { name: /Gerar Contra-Argumento IA/i });
    fireEvent.click(generateBtn);

    expect(screen.getByText(/Script Recomendado para o Consultor/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. Validação Empática:/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Quebra Técnica de Objeção:/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Fechamento de Valor F&I:/i)).toBeInTheDocument();
    expect(screen.getByText(/Compreendo o seu ponto/i)).toBeInTheDocument();
  });

  it("generates real-time custom counter-argument when typing 'a esposa não acha necessário neste momento'", () => {
    const accessories = getAccessoriesForVehicle("RAM RAMPAGE REBEL");
    render(
      <SalesScriptScreen
        clientData={mockClientData}
        accessories={accessories}
        onClose={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/Descreva com as palavras do cliente/i);
    fireEvent.change(input, { target: { value: "a esposa não acha necessário neste momento" } });

    const generateBtn = screen.getByRole("button", { name: /Gerar Contra-Argumento IA/i });
    fireEvent.click(generateBtn);

    // O texto em tela deve refletir a objeção da esposa/família
    expect(screen.getByText(/A decisão em conjunto com a sua família ou cônjuge é fundamental/i)).toBeInTheDocument();
    expect(screen.getByText(/Para quem viaja com o senhor, o que mais conta é a ergonomia/i)).toBeInTheDocument();
    expect(screen.getByText(/Que tal enviarmos a visualização 3D oficial agora mesmo para ela conferir no WhatsApp\?/i)).toBeInTheDocument();
  });

  it("triggers onClose when clicking 'Concluir e Enviar para Aprovação F&I'", () => {
    const handleClose = vi.fn();
    const accessories = getAccessoriesForVehicle("RAM RAMPAGE REBEL");
    render(
      <SalesScriptScreen
        clientData={mockClientData}
        accessories={accessories}
        onClose={handleClose}
      />
    );

    const finishBtn = screen.getByRole("button", { name: /Concluir e Enviar para Aprovação F&I/i });
    fireEvent.click(finishBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it("triggers onBack when clicking 'Voltar para Visualização 3D'", () => {
    const handleBack = vi.fn();
    const accessories = getAccessoriesForVehicle("RAM RAMPAGE REBEL");
    render(
      <SalesScriptScreen
        clientData={mockClientData}
        accessories={accessories}
        onClose={vi.fn()}
        onBack={handleBack}
      />
    );

    const backBtn = screen.getByRole("button", { name: /Voltar para Visualização 3D/i });
    fireEvent.click(backBtn);
    expect(handleBack).toHaveBeenCalled();
  });
});
