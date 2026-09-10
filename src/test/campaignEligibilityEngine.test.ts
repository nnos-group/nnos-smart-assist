import { describe, it, expect } from "vitest";
import {
  evaluateCampaignEligibility,
  getEligibleCampaigns,
  MOCK_COMMERCIAL_CAMPAIGNS,
} from "@/lib/campaignEligibilityEngine";
import { CommercialCampaign } from "@/types/salesJourney";

describe("Campaign Eligibility Engine", () => {
  const baseCampaign: CommercialCampaign = {
    id: "camp-test",
    dealershipId: "matriz",
    name: "Campanha RAM",
    description: "Desconto",
    campaignType: "discount",
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T23:59:59Z",
    vehicleModels: ["RAM RAMPAGE REBEL"],
    discountType: "percentage",
    discountValue: 10,
    minimumPurchaseValue: 2000,
    customerMessage: "Desconto especial",
    requiresManagerApproval: false,
    active: true,
  };

  it("approves campaign when all criteria match", () => {
    const result = evaluateCampaignEligibility(baseCampaign, {
      dealershipId: "matriz",
      vehicleModel: "RAM RAMPAGE REBEL",
      selectedAccessoryIds: ["estribo", "protetor"],
      subtotal: 3500,
      currentDate: new Date("2026-06-15T12:00:00Z"),
    });

    expect(result.eligible).toBe(true);
    expect(result.rejectionReasons.length).toBe(0);
  });

  it("rejects campaign when vehicle model does not match", () => {
    const result = evaluateCampaignEligibility(baseCampaign, {
      dealershipId: "matriz",
      vehicleModel: "FIAT TORO RANCH",
      selectedAccessoryIds: ["estribo"],
      subtotal: 3500,
      currentDate: new Date("2026-06-15T12:00:00Z"),
    });

    expect(result.eligible).toBe(false);
    expect(result.rejectionReasons.some((r) => r.includes("Não se aplica ao veículo"))).toBe(true);
  });

  it("rejects campaign when subtotal is below minimum purchase value", () => {
    const result = evaluateCampaignEligibility(baseCampaign, {
      dealershipId: "matriz",
      vehicleModel: "RAM RAMPAGE REBEL",
      selectedAccessoryIds: ["friso"],
      subtotal: 1200, // min é 2000
      currentDate: new Date("2026-06-15T12:00:00Z"),
    });

    expect(result.eligible).toBe(false);
    expect(result.rejectionReasons.some((r) => r.includes("Valor mínimo não atingido"))).toBe(true);
  });

  it("filters eligible campaigns from list correctly", () => {
    const eligible = getEligibleCampaigns(MOCK_COMMERCIAL_CAMPAIGNS, {
      dealershipId: "matriz",
      vehicleModel: "RAM RAMPAGE REBEL",
      selectedAccessoryIds: ["estribo", "protetor", "capota"],
      subtotal: 6500,
      currentDate: new Date("2026-06-15T12:00:00Z"),
    });

    expect(eligible.length).toBeGreaterThan(0);
    // Não deve incluir campanhas exclusivas de Jeep Renegade
    expect(eligible.every((c) => !c.id.includes("renegade"))).toBe(true);
  });

  it("handles undefined vehicleModel, accessories or missing params gracefully without throwing TypeError", () => {
    expect(() => {
      evaluateCampaignEligibility(baseCampaign, {
        vehicleModel: undefined as any,
        selectedAccessoryIds: undefined as any,
        subtotal: undefined as any,
      });
    }).not.toThrow();

    expect(() => {
      getEligibleCampaigns(MOCK_COMMERCIAL_CAMPAIGNS, undefined as any);
    }).not.toThrow();

    expect(() => {
      getEligibleCampaigns(MOCK_COMMERCIAL_CAMPAIGNS, "JEEP COMPASS", ["tapete"], 5000);
    }).not.toThrow();
  });
});
