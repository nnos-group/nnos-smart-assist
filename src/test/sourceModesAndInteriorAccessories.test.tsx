import { describe, it, expect } from "vitest";
import { generateRecommendations, calculateAccessoryMatchScore, ACCESSORY_METADATA_DATABASE } from "@/lib/recommendationEngine";
import { getAccessoriesForVehicle } from "@/types/accessories";
import { DiscoveryProfile } from "@/types/salesJourney";

describe("Interior Accessories & Source Intelligence", () => {
  it("includes metadata and 4 benefit pillars for interior accessories", () => {
    expect(ACCESSORY_METADATA_DATABASE["pelicula_solar"]).toBeDefined();
    expect(ACCESSORY_METADATA_DATABASE["iluminacao_led"]).toBeDefined();
    expect(ACCESSORY_METADATA_DATABASE["organizador_console"]).toBeDefined();
    expect(ACCESSORY_METADATA_DATABASE["capa_banco"]).toBeDefined();
    expect(ACCESSORY_METADATA_DATABASE["protetor_porta_int"]).toBeDefined();
    expect(ACCESSORY_METADATA_DATABASE["tapete_logomania"]).toBeDefined();

    const solar = ACCESSORY_METADATA_DATABASE["pelicula_solar"];
    expect(solar.practicalBenefit).toBeTruthy();
    expect(solar.protectionBenefit).toBeTruthy();
    expect(solar.safetyBenefit).toBeTruthy();
    expect(solar.convenienceBenefit).toBeTruthy();
    expect(solar.warrantyYears).toBeGreaterThanOrEqual(3);
  });

  it("recommends interior accessories when client prioritizes comfort and carries children", () => {
    const compassAccessories = getAccessoriesForVehicle("JEEP COMPASS LIMITED");
    const clientData = {
      vehicleModel: "JEEP COMPASS LIMITED",
      vehicleColor: "Branco Polar",
      vehicleYear: "2025 / 2026 (0 km)",
      clientName: "Familia Teste",
      clientAge: "38",
      clientGender: "Feminino",
      state: "São Paulo (SP)",
      terrainType: "100% Urbano / Rodovias Pavimentadas",
      climateCondition: "Calor Extremo & Radiação Solar Intensa",
    };

    const discovery: DiscoveryProfile = {
      usageLocation: "cidade",
      monthlyKm: "1000_2000",
      dirtRoadFrequency: "nunca",
      cargoUsage: "nao",
      frequentPassengers: ["criancas"],
      tripFrequency: "mensalmente",
      specialNeeds: [],
      priorities: ["conforto", "protecao", "estetica"],
      parkingLocation: "garagem_fechada",
      specificNotes: "Uso escolar e viagens de final de semana com crianças",
    };

    const recs = generateRecommendations(compassAccessories, clientData, discovery);
    expect(recs.length).toBeGreaterThanOrEqual(5);

    // Deve conter pelo menos um acessório interior entre as recomendações
    const hasInteriorRec = recs.some((r) => r.accessory.category === "interior");
    expect(hasInteriorRec).toBe(true);

    // Película solar ou tapetes devem ter pontuação alta devido a crianças e calor extremo
    const solarRec = recs.find((r) => r.accessoryId === "pelicula_solar");
    if (solarRec) {
      expect(solarRec.matchScore).toBeGreaterThanOrEqual(70);
    }
  });

  it("provides rich interior catalog accessories for Renegade Trailhawk", () => {
    const renegadeAccessories = getAccessoriesForVehicle("JEEP RENEGADE TRAILHAWK");
    const interiorItems = renegadeAccessories.filter((a) => a.category === "interior");
    expect(interiorItems.length).toBeGreaterThanOrEqual(4);

    const ids = interiorItems.map((a) => a.id);
    expect(ids).toContain("tapete_borracha");
    expect(ids).toContain("soleira");
    expect(ids).toContain("iluminacao_led");
    expect(ids).toContain("pelicula_solar");
  });
});
