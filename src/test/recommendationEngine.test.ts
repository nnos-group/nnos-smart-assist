import { describe, it, expect } from "vitest";
import {
  generateRecommendations,
  calculateAccessoryMatchScore,
  isAccessoryTechnicallyCompatible,
} from "@/lib/recommendationEngine";
import { defaultClientData, getAccessoriesForVehicle } from "@/types/accessories";
import { DiscoveryProfile } from "@/types/salesJourney";

describe("Recommendation Engine", () => {
  const baseDiscovery: DiscoveryProfile = {
    usageLocation: "uso_misto",
    monthlyKm: "1000_2000",
    dirtRoadFrequency: "semanalmente",
    cargoUsage: "ferramentas",
    frequentPassengers: ["criancas"],
    tripFrequency: "quinzenalmente",
    specialNeeds: ["protecao_cacamba", "acesso_facilitado"],
    priorities: ["protecao", "praticidade", "seguranca"],
    parkingLocation: "garagem_fechada",
    specificNotes: "",
  };

  it("checks technical compatibility strictly", () => {
    // Bagageiro é compatível com SUVs (Renegade, Compass), mas não com RAM Rampage
    expect(isAccessoryTechnicallyCompatible("bagageiro", "RAM RAMPAGE REBEL")).toBe(false);
    expect(isAccessoryTechnicallyCompatible("bagageiro", "JEEP COMPASS LONGITUDE")).toBe(true);
    expect(isAccessoryTechnicallyCompatible("estribo", "RAM RAMPAGE REBEL")).toBe(true);
  });

  it("classifies essential items when profile indicates heavy rural and tools usage", () => {
    const accessories = getAccessoriesForVehicle("RAM RAMPAGE REBEL");
    const recs = generateRecommendations(accessories, defaultClientData, baseDiscovery);

    expect(recs.length).toBeGreaterThan(0);

    const essentialTiers = recs.filter((r) => r.tier === "essential");
    expect(essentialTiers.length).toBeLessThanOrEqual(3);
    expect(essentialTiers.length).toBeGreaterThan(0);

    // Protetor ou Estribo devem estar entre os essenciais para esse perfil
    const essentialIds = essentialTiers.map((r) => r.accessoryId);
    expect(essentialIds.some((id) => id === "protetor" || id === "estribo")).toBe(true);

    // Cada item recomendado deve conter justificativa rica e respostas relacionadas
    recs.forEach((r) => {
      expect(r.reason).toBeDefined();
      expect(r.problemSolved).toBeDefined();
      expect(r.benefitDelivered).toBeDefined();
      expect(r.matchScore).toBeGreaterThanOrEqual(0);
    });
  });

  it("respects quotas: max 3 essentials, max 3 recommended, max 2 complementary", () => {
    const accessories = getAccessoriesForVehicle("RAM RAMPAGE REBEL");
    const recs = generateRecommendations(accessories, defaultClientData, baseDiscovery);

    const essentials = recs.filter((r) => r.tier === "essential");
    const recommended = recs.filter((r) => r.tier === "recommended");
    const complementary = recs.filter((r) => r.tier === "complementary");

    expect(essentials.length).toBeLessThanOrEqual(3);
    expect(recommended.length).toBeLessThanOrEqual(3);
    expect(complementary.length).toBeLessThanOrEqual(2);
  });
});
