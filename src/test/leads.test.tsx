import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { 
  getReheatedLeads, saveReheatedLead, 
  deleteReheatedLead, resetModelLeads 
} from "@/lib/leadsRepository";
import { ReheatedLeadsModal } from "@/components/ReheatedLeadsModal";
import { ProposalRejectedModal } from "@/components/ProposalRejectedModal";
import VehicleVisualizationScreen from "@/components/VehicleVisualizationScreen";
import { defaultClientData, getAccessoriesForVehicle } from "@/types/accessories";

describe("Leads Repository & Reheating Flow", () => {
  beforeEach(() => {
    localStorage.clear();
    resetModelLeads();
  });

  it("loads initial model leads including Carlos Silva and Mariana Souza", () => {
    const leads = getReheatedLeads();
    expect(leads.length).toBeGreaterThanOrEqual(3);
    
    const carlos = leads.find((l) => l.clientName === "Carlos Silva");
    expect(carlos).toBeDefined();
    expect(carlos?.vehicleModel).toBe("JEEP RENEGADE TRAILHAWK");
    expect(carlos?.totalProposalValue).toBe(11212);

    const mariana = leads.find((l) => l.clientName === "Mariana Souza");
    expect(mariana).toBeDefined();
    expect(mariana?.vehicleModel).toBe("RAM RAMPAGE REBEL");
  });

  it("adds a new rejected proposal to the repository", () => {
    const newLead = saveReheatedLead({
      clientName: "Fernando Rocha",
      clientPhone: "(11) 99999-1111",
      clientData: defaultClientData,
      vehicleModel: "JEEP COMPASS BLACKHAWK",
      vehicleColor: "Preto Carbon",
      selectedAccessories: [],
      totalProposalValue: 5400,
      cdcMonthlyEstimate: "126,90",
      rejectionReason: "Orçamento / Preço no Momento",
      reheatStrategy: "Campanha Bônus Montadora",
    });

    expect(newLead.id).toBeDefined();
    const leads = getReheatedLeads();
    expect(leads.some((l) => l.clientName === "Fernando Rocha")).toBe(true);
  });

  it("deletes a lead from the repository", () => {
    const leadsBefore = getReheatedLeads();
    const idToDelete = leadsBefore[0].id;
    deleteReheatedLead(idToDelete);

    const leadsAfter = getReheatedLeads();
    expect(leadsAfter.some((l) => l.id === idToDelete)).toBe(false);
  });

  it("renders the ReheatedLeadsModal with list of model leads", () => {
    const handleResume = vi.fn();
    const handleClose = vi.fn();

    render(
      <ReheatedLeadsModal
        isOpen={true}
        onClose={handleClose}
        onResumeLead={handleResume}
      />
    );

    expect(screen.getByText(/Base de Leads para Reaquecimento/i)).toBeInTheDocument();
    expect(screen.getByText("Carlos Silva")).toBeInTheDocument();
    expect(screen.getByText("Mariana Souza")).toBeInTheDocument();
  });

  it("renders ProposalRejectedModal and saves when confirming", () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();

    render(
      <ProposalRejectedModal
        isOpen={true}
        onClose={handleClose}
        clientData={{
          ...defaultClientData,
          clientName: "Juliana Peixoto",
        }}
        selectedAccessories={getAccessoriesForVehicle("RAM RAMPAGE REBEL")}
        totalProposalValue={8694}
        cdcMonthlyEstimate="204,31"
        onSuccess={handleSuccess}
      />
    );

    expect(screen.getByText(/Registrar Proposta Recusada/i)).toBeInTheDocument();
    expect(screen.getByText("Juliana Peixoto")).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: /Mover para Base de Reaquecimento/i });
    fireEvent.click(confirmButton);

    expect(handleSuccess).toHaveBeenCalled();
    const leads = getReheatedLeads();
    expect(leads.some((l) => l.clientName === "Juliana Peixoto")).toBe(true);
  });

  it("renders 'Proposta Recusada' button on VehicleVisualizationScreen and does not render 'Apresentação Interativa Antes & Depois'", () => {
    render(
      <VehicleVisualizationScreen
        accessories={getAccessoriesForVehicle("RAM RAMPAGE REBEL")}
        clientData={defaultClientData}
        onAccessoryToggle={vi.fn()}
        onGenerateScript={vi.fn()}
        onAddToProposal={vi.fn()}
      />
    );

    // Removed badge
    expect(screen.queryByText(/Apresentação Interativa Antes & Depois/i)).not.toBeInTheDocument();

    // Proposta Recusada button
    const rejectBtn = screen.getByRole("button", { name: /Proposta Recusada/i });
    expect(rejectBtn).toBeInTheDocument();

    // Click opens modal
    fireEvent.click(rejectBtn);
    expect(screen.getByText(/Registrar Proposta Recusada/i)).toBeInTheDocument();
  });
});
