import { describe, it, expect } from "vitest";
import { recomposeAccessoriesByBudget } from "@/lib/investmentRecompositionEngine";
import { getAccessoriesForVehicle } from "@/types/accessories";
import { generateRecommendations } from "@/lib/recommendationEngine";
import { DEFAULT_DISCOVERY_PROFILE } from "@/context/SalesJourneyContext";
import { defaultClientData } from "@/types/accessories";

describe("Smart-Sell — Investment Recomposition Engine", () => {
  it("generates Essential, Recommended and Complete packages according to budget", () => {
    const accessories = getAccessoriesForVehicle("JEEP COMPASS LIMITED");
    const recommendations = generateRecommendations(accessories, defaultClientData, DEFAULT_DISCOVERY_PROFILE);
    const selected = accessories.slice(0, 5); // 5 selected items

    const result = recomposeAccessoriesByBudget({
      selectedAccessories: selected,
      recommendations,
      targetBudget: 3000,
    });

    expect(result.targetBudget).toBe(3000);
    expect(result.essential).toBeDefined();
    expect(result.recommended).toBeDefined();
    expect(result.complete).toBeDefined();

    // Completo deve ter todos os 5 itens originais
    expect(result.complete.accessories.length).toBe(selected.length);
    expect(result.complete.totalValue).toBeGreaterThan(0);

    // Essencial deve priorizar itens essenciais e manter valor próximo ou abaixo da capacidade
    expect(result.essential.accessories.length).toBeGreaterThan(0);
    expect(result.essential.accessories.length).toBeLessThanOrEqual(result.complete.accessories.length);

    // Recomendado deve equilibrar os itens essenciais + recomendados
    expect(result.recommended.accessories.length).toBeGreaterThanOrEqual(result.essential.accessories.length);
  });
});
