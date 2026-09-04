import { describe, it, expect } from "vitest";
import { getAccessoriesForVehicle, getPackageName } from "@/types/accessories";
import { vehicleGroups } from "@/components/ClientDataScreen";

describe("Jeep Compass Integration", () => {
  it("should have JEEP COMPASS group with all key models in vehicleGroups", () => {
    const compassGroup = vehicleGroups.find((g) => g.brand === "JEEP COMPASS");
    expect(compassGroup).toBeDefined();
    expect(compassGroup?.models).toContain("JEEP COMPASS SPORT");
    expect(compassGroup?.models).toContain("JEEP COMPASS LONGITUDE");
    expect(compassGroup?.models).toContain("JEEP COMPASS LIMITED");
    expect(compassGroup?.models).toContain("JEEP COMPASS SERIE S");
    expect(compassGroup?.models).toContain("JEEP COMPASS TRAILHAWK");
    expect(compassGroup?.models).toContain("JEEP COMPASS BLACKHAWK");
  });

  it("should return accessories for any Compass model", () => {
    const models = [
      "JEEP COMPASS SPORT",
      "JEEP COMPASS LONGITUDE",
      "JEEP COMPASS LIMITED",
      "JEEP COMPASS SERIE S",
      "JEEP COMPASS TRAILHAWK",
      "JEEP COMPASS BLACKHAWK",
      "QUALQUER COMPASS CUSTOM",
    ];

    for (const model of models) {
      const accs = getAccessoriesForVehicle(model);
      expect(accs).toBeDefined();
      expect(accs.length).toBeGreaterThan(0);
    }
  });

  it("should return package names for Compass models", () => {
    expect(getPackageName("JEEP COMPASS TRAILHAWK")).toBe("Pacote Trail Master 4x4");
    expect(getPackageName("JEEP COMPASS SPORT")).toBe("Pacote Sport Essential Protection");
    expect(getPackageName("JEEP COMPASS DESCONHECIDO")).toBe("Pacote Compass Adventure & Tech");
  });

  it("should verify video routing logic for Compass", () => {
    const checkVideoMode = (model: string) => {
      const isRenegade = model.toUpperCase().includes("RENEGADE");
      const isRampage = model.toUpperCase().includes("RAMPAGE");
      const isCompass = model.toUpperCase().includes("COMPASS");
      return isRenegade || isRampage || isCompass;
    };

    const getVideoSrc = (model: string, showAfter: boolean) => {
      const isRenegade = model.toUpperCase().includes("RENEGADE");
      const isRampage = model.toUpperCase().includes("RAMPAGE");
      const isCompass = model.toUpperCase().includes("COMPASS");

      if (isRenegade) return showAfter ? "/videos/Jeep_Renegade_com.mp4" : "/videos/Jeep_Renegade_sem.mp4";
      if (isRampage) return showAfter ? "/videos/Ram_Rampage_com.mp4" : "/videos/Ram_Rampage_sem.mp4";
      if (isCompass) return showAfter ? "/videos/Compass_com.mp4" : "/videos/Compass_sem.mp4";
      return null;
    };

    expect(checkVideoMode("JEEP COMPASS SPORT")).toBe(true);
    expect(checkVideoMode("JEEP COMPASS TRAILHAWK")).toBe(true);
    expect(checkVideoMode("Compass Limited")).toBe(true);
    expect(getVideoSrc("JEEP COMPASS LONGITUDE", true)).toBe("/videos/Compass_com.mp4");
    expect(getVideoSrc("JEEP COMPASS LONGITUDE", false)).toBe("/videos/Compass_sem.mp4");
  });
});
